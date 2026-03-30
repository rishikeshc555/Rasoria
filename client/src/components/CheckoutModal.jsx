import React, { useState } from "react";
import toast from "react-hot-toast"; // <-- Import toast

const CheckoutModal = ({ isOpen, onClose, cartItems, totalAmount, clearCart, closeCart }) => {
  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phone: "",
    address: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const orderData = {
      ...formData,
      items: cartItems.map(item => ({
        name: item.name,
        price: parseInt(item.price.replace(/\D/g, ""), 10),
        quantity: item.quantity
      })),
      totalAmount,
    };

    try {
      const response = await fetch("http://localhost:5001/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Order placed successfully!"); // <-- Sleek success message
        clearCart();
        onClose();
        closeCart();
      } else {
        toast.error("Failed to place order. Please try again."); // <-- Sleek error message
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("An error occurred during checkout."); // <-- Sleek error message
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      {/* Dark Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-60 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="bg-white rounded-xl shadow-2xl z-10 w-full max-w-md overflow-hidden transform transition-all">
        <div className="bg-orange-600 px-6 py-4 flex justify-between items-center text-white">
          <h2 className="text-xl font-bold font-serif">Complete Your Order</h2>
          <button onClick={onClose} className="text-white hover:text-orange-200 text-2xl leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input required type="text" name="customerName" value={formData.customerName} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500" placeholder="John Doe" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500" placeholder="john@example.com" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500" placeholder="+91 98765 43210" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
            <textarea required name="address" value={formData.address} onChange={handleChange} rows="3" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500" placeholder="123 Food Street, City, State, Zip" />
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
            <span className="text-gray-600 font-medium">Amount to Pay:</span>
            <span className="text-xl font-bold text-brown-900">₹{totalAmount}</span>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg transition duration-300 disabled:opacity-50 mt-4"
          >
            {isSubmitting ? "Processing..." : "Confirm Order"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutModal;