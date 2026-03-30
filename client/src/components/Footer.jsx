import React from "react";
import { FaInstagram, FaFacebookF, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#2c1e1e] text-white py-10">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8">
        
        {/* Contact Info */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
          <p>📞 Phone: +91 6392196590</p>
          <p>📧 Email: contact@rasoria.com</p>
          <p>📍 Location: New Ashok Nagar, Delhi</p>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
          <div className="flex gap-4 text-xl">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-orange-500 transition"
            >
              <FaInstagram />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-orange-500 transition"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-orange-500 transition"
            >
              <FaTwitter />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="md:text-right">
          <h3 className="text-xl font-semibold mb-4">Rasoria</h3>
          <p>© {new Date().getFullYear()} Rasoria. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
