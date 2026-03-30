import React, { useContext } from "react";
import TrufflePasta from "../assets/TrufflePasta.jpg";
import GrilledSalmon from "../assets/GrilledSalmon.jpg";
import MargheritaPizza from "../assets/MargheritaPizza.jpg";
import CaesarSalad from "../assets/CaesarSalad.jpg";
import TandooriChicken from "../assets/TandooriChicken.jpg";
import GulabJamun from "../assets/GulabJamun.jpg";
import { CartContext } from "../context/CartContext";

const dishes = [
  {
    name: "Truffle Pasta",
    description: "Creamy truffle sauce tossed with handmade pasta.",
    price: "₹599",
    image: TrufflePasta,
  },
  {
    name: "Grilled Salmon",
    description: "Perfectly seared salmon with lemon herb dressing.",
    price: "₹799",
    image: GrilledSalmon,
  },
  {
    name: "Margherita Pizza",
    description: "Classic stone-baked pizza with fresh basil and mozzarella.",
    price: "₹499",
    image: MargheritaPizza,
  },
  {
    name: "Caesar Salad",
    description: "Crisp romaine, parmesan & garlic croutons.",
    price: "₹349",
    image: CaesarSalad,
  },
  {
    name: "Tandoori Chicken",
    description: "Spicy marinated chicken grilled to perfection.",
    price: "₹549",
    image: TandooriChicken,
  },
  {
    name: "Gulab Jamun",
    description: "Traditional Indian sweet soaked in rose syrup.",
    price: "₹199",
    image: GulabJamun,
  },
];

const Menu = () => {
  // We need cartItems to check what's in the cart, and updateQuantity for the + / - buttons
  const { cartItems, addToCart, updateQuantity } = useContext(CartContext);

  // Helper function to find out how many of a specific dish are in the cart
  const getDishQuantity = (dishName) => {
    const item = cartItems.find((cartItem) => cartItem.name === dishName);
    return item ? item.quantity : 0;
  };

  return (
    <section id="menu" className="py-20 bg-beige-100">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-serif font-bold text-brown-900">Our Menu</h2>
        <p className="text-orange-600 mt-2 text-lg">Explore Our Dishes</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {dishes.map((dish, index) => {
          const quantity = getDishQuantity(dish.name); // Check quantity for this specific dish

          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col"
            >
              <img
                src={dish.image}
                alt={dish.name}
                className="w-full h-56 object-cover"
              />
              <div className="p-5 flex-grow">
                <h3 className="text-xl font-semibold text-brown-900 mb-2">{dish.name}</h3>
                <p className="text-gray-600 mb-4">{dish.description}</p>
                <span className="text-orange-600 font-bold text-lg">{dish.price}</span>
              </div>
              
              <div className="p-5 pt-0 mt-auto">
                {/* Conditional Rendering: Show Add button OR + / - Controls */}
                {quantity === 0 ? (
                  <button
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 rounded-md transition-all duration-300 active:scale-95"
                    onClick={() => addToCart(dish)}
                  >
                    Add to Cart
                  </button>
                ) : (
                  <div className="w-full flex items-center justify-between bg-orange-50 rounded-md overflow-hidden border border-orange-500 shadow-sm">
                    <button
                      className="px-4 py-2 bg-orange-100 text-orange-700 hover:bg-orange-600 hover:text-white font-bold text-lg transition-colors w-1/3"
                      onClick={() => updateQuantity(dish.name, -1)}
                    >
                      -
                    </button>
                    <span className="font-bold text-brown-900 text-lg w-1/3 text-center">
                      {quantity}
                    </span>
                    <button
                      className="px-4 py-2 bg-orange-100 text-orange-700 hover:bg-orange-600 hover:text-white font-bold text-lg transition-colors w-1/3"
                      onClick={() => updateQuantity(dish.name, 1)}
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Menu;