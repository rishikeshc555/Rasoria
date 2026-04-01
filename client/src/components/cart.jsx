import React, { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import CheckoutModal from "./CheckoutModal"; 
import { useNavigate } from "react-router-dom"; // <-- NEW
import toast from "react-hot-toast"; // <-- NEW

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, isCartOpen, setIsCartOpen } = useContext(CartContext);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false); 
  const navigate = useNavigate(); // <-- NEW

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const priceNumber = parseInt(item.price.replace(/\D/g, ""), 10);
      return total + (isNaN(priceNumber) ? 0 : priceNumber * item.quantity);
    }, 0);
  };

  // NEW: Authentication Guard Function
  const handleProceedToCheckout = () => {
    const storedUser = sessionStorage.getItem("user");
    
    if (!storedUser) {
      toast.error("Please login or create an account to place your order!", {
        duration: 4000,
      });
      setIsCartOpen(false); // Close the cart
      navigate("/auth"); // Send them to login
      return;
    }

    // If logged in, open the modal
    setIsCheckoutOpen(true);
  };

  return (
    <>
      {/* Cart Background Overlay */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] transition-opacity" onClick={() => setIsCartOpen(false)}></div>
      )}

      {/* Cart Slide-out Panel */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex flex-col h-full">
          <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
            <h2 className="text-2xl font-serif font-bold text-brown-900">Your Order</h2>
            <button onClick={() => setIsCartOpen(false)} className="text-gray-500 hover:text-orange-600 text-3xl font-bold transition">&times;</button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {cartItems.length === 0 ? (
              <div className="text-center text-gray-500 mt-10">
                <p>Your cart is empty.</p>
              </div>
            ) : (
              <ul className="space-y-6">
                {cartItems.map((item, index) => (
                  <li key={index} className="flex flex-col gap-2 border-b pb-4">
                    <div className="flex items-center gap-4">
                      <img src={item.image} alt={item.name} className="w-16 h-16 rounded-md object-cover" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{item.name}</h4>
                        <p className="text-orange-600 font-medium">{item.price}</p>
                      </div>
                      <button onClick={() => removeFromCart(item.name)} className="text-red-500 hover:text-red-700 text-sm font-medium">Remove</button>
                    </div>
                    
                    <div className="flex items-center gap-3 mt-2 self-end border rounded-md px-2 py-1">
                      <button onClick={() => updateQuantity(item.name, -1)} className="text-gray-600 hover:text-orange-600 font-bold px-2">-</button>
                      <span className="font-semibold text-gray-800">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.name, 1)} className="text-gray-600 hover:text-orange-600 font-bold px-2">+</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="p-6 border-t bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-gray-700">Total:</span>
              <span className="text-2xl font-bold text-brown-900">₹{calculateTotal()}</span>
            </div>
            {/* UPDATED: Calling handleProceedToCheckout instead of opening modal directly */}
            <button 
              onClick={handleProceedToCheckout} 
              disabled={cartItems.length === 0}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg text-lg font-semibold transition duration-300 disabled:opacity-50"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>

      {/* Render the Checkout Modal */}
      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        cartItems={cartItems}
        totalAmount={calculateTotal()}
        clearCart={clearCart}
        closeCart={() => setIsCartOpen(false)}
      />
    </>
  );
};

export default Cart;