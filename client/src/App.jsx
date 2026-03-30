import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast"; // <-- Import Toaster
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Menu from "./components/Menu";
import About from "./components/About";
import Reservation from "./components/Reservation";
import Footer from "./components/Footer";
import Cart from "./components/cart";
import AdminDashboard from "./components/pages/AdminDashboard";
import AuthPage from "./components/pages/AuthPage";
import CustomerDashboard from "./components/pages/CustomerDashboard";

const MainWebsite = () => (
  <div className="bg-white text-black relative">
    <Navbar />
    <Cart />
    <Hero />
    <Menu />
    <About />
    <Reservation />
    <Footer />
  </div>
);

function App() {
  return (
    <Router>
      {/* Add the Toaster here so it works across the whole app */}
      <Toaster 
        position="top-center" 
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }} 
      />
      <Routes>
        <Route path="/" element={<MainWebsite />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={<CustomerDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;