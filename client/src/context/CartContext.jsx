import React, { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (item) => {
    setCartItems((prev) => {
      const existingItem = prev.find((i) => i.name === item.name);
      if (existingItem) {
        return prev.map((i) =>
          i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (name, amount) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.name === name);
      if (existingItem) {
        const newQuantity = existingItem.quantity + amount;
        
        // 🚨 NEW LOGIC: If quantity hits 0, remove it from the cart
        if (newQuantity <= 0) {
          return prev.filter((item) => item.name !== name);
        } else {
          return prev.map((item) =>
            item.name === name ? { ...item, quantity: newQuantity } : item
          );
        }
      }
      return prev;
    });
  };

  const removeFromCart = (nameToRemove) => {
    setCartItems((prev) => prev.filter((item) => item.name !== nameToRemove));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};