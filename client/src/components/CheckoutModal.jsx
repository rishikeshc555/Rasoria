import React, { useState, useEffect } from "react"; // <-- NEW: Added useEffect
import toast from "react-hot-toast";

const CheckoutModal = ({ isOpen, onClose, cartItems, totalAmount, clearCart, closeCart }) => {
  const mockSavedAddresses = [
    { id: "1", street: "123 Main St, Apt 4B", city: "New York", zipCode: "10001", phone: "9876543210" },
    { id: "2", street: "456 Office Blvd, Floor 2", city: "New York", zipCode: "10005", phone: "9876543210" }
  ];

  const [addressMode, setAddressMode] = useState("saved"); 
  const [selectedSavedAddress, setSelectedSavedAddress] = useState(mockSavedAddresses[0] || null);
  
  const [newAddressForm, setNewAddressForm] = useState({
    street: "", city: "", zipCode: "", phone: "",
  });
  
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // NEW: Handle Mobile Back Button (Popstate)
  useEffect(() => {
    if (!isOpen) return;

    // Push a fake state to the browser history stack
    window.history.pushState({ modalOpen: true }, '', window.location.href);

    const handlePopState = (e) => {
      // If the user hits the back button, close the modal instead of leaving the page
      onClose();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleNewAddressChange = (e) => {
    setNewAddressForm({ ...newAddressForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    const realUserId = storedUser ? (storedUser._id || storedUser.id) : null;

    if (!realUserId) {
      toast.error("Please log in to place an order.");
      setIsSubmitting(false);
      return;
    }

    const finalAddress = addressMode === "saved" 
      ? { street: selectedSavedAddress.street, city: selectedSavedAddress.city, zipCode: selectedSavedAddress.zipCode, phone: selectedSavedAddress.phone }
      : newAddressForm;

    const orderData = {
      user: realUserId, 
      items: cartItems.map(item => ({
        name: item.name,
        price: parseInt(item.price.replace(/\D/g, ""), 10),
        quantity: item.quantity
      })),
      totalAmount,
      deliveryAddress: finalAddress,
      paymentMethod
    };

    try {
      const response = await fetch("https://rasoria-api.onrender.com/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // <-- Safety check to ensure CORS works
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Order placed successfully!"); 
        clearCart();
        onClose();
        closeCart();
      } else {
        toast.error("Failed to place order."); 
      }
    } catch (error) {
      toast.error("An error occurred during checkout."); 
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black bg-opacity-60 transition-opacity" onClick={onClose}></div>

      <div className="bg-white rounded-xl shadow-2xl z-10 w-full max-w-md overflow-hidden transform transition-all max-h-[90vh] overflow-y-auto">
        <div className="bg-orange-600 px-6 py-4 flex justify-between items-center text-white sticky top-0">
          <h2 className="text-xl font-bold font-serif">Complete Order</h2>
          <button onClick={onClose} className="text-white hover:text-orange-200 text-2xl leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Address Selection Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Delivery Address</h3>
            
            <div className="flex gap-4 mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="addressMode" checked={addressMode === "saved"} onChange={() => setAddressMode("saved")} className="text-orange-600 focus:ring-orange-500" />
                <span className="text-sm font-medium text-gray-700">Saved Addresses</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="addressMode" checked={addressMode === "new"} onChange={() => setAddressMode("new")} className="text-orange-600 focus:ring-orange-500" />
                <span className="text-sm font-medium text-gray-700">Add New Address</span>
              </label>
            </div>

            {addressMode === "saved" && (
              <div className="space-y-3">
                {mockSavedAddresses.map(addr => (
                  <div key={addr.id} onClick={() => setSelectedSavedAddress(addr)} className={`border rounded-lg p-3 cursor-pointer transition-all ${selectedSavedAddress?.id === addr.id ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-orange-300"}`}>
                    <p className="text-sm font-bold text-gray-800">{addr.street}</p>
                    <p className="text-xs text-gray-600">{addr.city}, {addr.zipCode}</p>
                    <p className="text-xs text-gray-600 mt-1">📞 {addr.phone}</p>
                  </div>
                ))}
              </div>
            )}

            {addressMode === "new" && (
              <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
                <input required type="text" name="street" value={newAddressForm.street} onChange={handleNewAddressChange} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-orange-500" placeholder="Street Address" />
                <div className="grid grid-cols-2 gap-3">
                  <input required type="text" name="city" value={newAddressForm.city} onChange={handleNewAddressChange} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-orange-500" placeholder="City" />
                  <input required type="text" name="zipCode" value={newAddressForm.zipCode} onChange={handleNewAddressChange} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-orange-500" placeholder="Zip Code" />
                </div>
                <input required type="tel" name="phone" value={newAddressForm.phone} onChange={handleNewAddressChange} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-orange-500" placeholder="Phone Number" />
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Payment Method</h3>
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-orange-500 bg-white">
              <option value="COD">💵 Cash on Delivery (COD)</option>
              <option value="POD">💳 Pay on Delivery (Card/UPI)</option>
            </select>
          </div>

          <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
            <span className="text-gray-600 font-medium">Total:</span>
            <span className="text-xl font-bold text-brown-900">₹{totalAmount}</span>
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg transition duration-300 disabled:opacity-50 mt-4">
            {isSubmitting ? "Processing..." : "Confirm Order"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutModal;