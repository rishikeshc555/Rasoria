import React, { useContext, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { CartContext } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom"; 

const Navbar = () => {
  const { cartItems, setIsCartOpen } = useContext(CartContext);
  const navigate = useNavigate();
  
  // NEW: State to control the mobile menu dropdown
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Safely check if a user is logged in
  const userString = sessionStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  // Handle the logout process
  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/auth"); 
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-orange-800 whitespace-nowrap overflow-hidden text-ellipsis">
          R A S O R I A
        </h1>

        {/* Navigation Links - Desktop */}
        <ul className="hidden md:flex gap-10 font-medium text-gray-800 text-lg items-center">
          <li><a href="#home" className="hover:text-orange-600 transition">Home</a></li>
          <li><a href="#about" className="hover:text-orange-600 transition">About</a></li>
          <li><a href="#menu" className="hover:text-orange-600 transition">Menu</a></li>
          <li><a href="#reservation" className="hover:text-orange-600 transition">Reservation</a></li>
          <li><a href="#contact" className="hover:text-orange-600 transition">Contact</a></li>
          
          {/* Cart Icon */}
          <li>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center hover:text-orange-600 transition"
            >
              <FaShoppingCart size={24} />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </button>
          </li>

          {/* Authentication Section (Desktop) */}
          <li className="pl-4 border-l-2 border-gray-200">
            {user ? (
              <div className="flex items-center gap-4">
                {user.role === "admin" ? (
                  <Link
                    to="/admin"
                    className="text-sm bg-gray-800 text-white px-4 py-1.5 rounded hover:bg-black transition duration-300 shadow-sm font-semibold"
                  >
                    Admin Panel
                  </Link>
                ) : (
                  <Link 
                    to="/dashboard" 
                    className="text-gray-800 font-medium text-base hover:text-orange-600 transition underline-offset-4 hover:underline"
                  >
                    Hi, {user.name.split(" ")[0]}
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-sm border border-gray-800 text-gray-800 px-4 py-1.5 rounded hover:bg-gray-800 hover:text-white transition duration-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="text-sm bg-orange-600 text-white px-5 py-2.5 rounded-md font-semibold hover:bg-orange-700 transition duration-300 shadow-sm"
              >
                Login / Sign Up
              </Link>
            )}
          </li>
        </ul>

        {/* Mobile View Icons (Hamburger + Cart + Auth) */}
        <div className="flex items-center gap-4 md:hidden">
          
          {/* Authentication Section (Mobile) */}
          {user ? (
            <button
              onClick={handleLogout}
              className="text-xs border border-gray-800 text-gray-800 px-2 py-1 rounded hover:bg-gray-800 hover:text-white transition duration-300"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/auth"
              className="text-xs bg-orange-600 text-white px-3 py-1.5 rounded-md font-semibold shadow-sm"
            >
              Login / Sign Up {/* FIXED: Changed from just "Login" */}
            </Link>
          )}

          {/* Cart Icon */}
          <button onClick={() => setIsCartOpen(true)} className="relative text-gray-800">
            <FaShoppingCart size={24} />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </button>
          
          {/* Hamburger Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="focus:outline-none"
          >
            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /> // X icon when open
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /> // 3 lines when closed
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* NEW: Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t py-4 px-6 flex flex-col gap-4 z-50">
          <a href="#home" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-800 font-medium text-lg border-b pb-2">Home</a>
          <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-800 font-medium text-lg border-b pb-2">About</a>
          <a href="#menu" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-800 font-medium text-lg border-b pb-2">Menu</a>
          <a href="#reservation" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-800 font-medium text-lg border-b pb-2">Reservation</a>
          <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-800 font-medium text-lg">Contact</a>
          
          {/* If user is logged in, give them a dashboard link on mobile */}
          {user && (
             <Link 
               to={user.role === "admin" ? "/admin" : "/dashboard"} 
               onClick={() => setIsMobileMenuOpen(false)}
               className="bg-orange-600 text-white text-center py-2 rounded-md font-bold mt-2"
             >
               Go to Dashboard
             </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;