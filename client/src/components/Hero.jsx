import React from "react";

// A simple, elegant SVG for a decorative flourish.
const FlourishIcon = () => (
  <svg
    className="w-32 h-auto text-amber-400"
    viewBox="0 0 130 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1 10H40L50 1"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M129 10H90L80 1"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="65" cy="10" r="8" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const Hero = () => {
  return (
    // Main section container.
    // The critical scaling property is now an inline style to prevent it from being overridden.
    <section
      id="home"
      className="relative w-full flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-900 to-black p-4"
      style={{ minHeight: '100vh' }} // <-- THIS IS THE FIX
    >
      {/* Content container */}
      <div className="text-center z-10">
        {/* Restaurant Name */}
        <p className="text-amber-400 font-medium text-lg tracking-widest mb-4">
          R A S O R I A
        </p>

        {/* Main Headline */}
        <h1 className="text-white text-5xl md:text-7xl font-serif font-bold leading-tight mb-6">
          Delicious Food &<br /> Wonderful Eating Experience
        </h1>

        {/* Decorative Flourish */}
        <div className="flex justify-center my-8">
          <FlourishIcon />
        </div>

        {/* Sub-headline */}
        <p className="text-gray-300 max-w-2xl mx-auto text-lg md:text-xl mb-10">
          Experience culinary excellence and warm hospitality, where every dish
          tells a story of passion and flavor.
        </p>

        {/* Call-to-Action (CTA) Button */}
        <a
          href="#menu"
          className="inline-block bg-amber-500 text-gray-900 font-bold py-4 px-10 rounded-full text-lg uppercase tracking-wider transform transition-all duration-300 hover:bg-amber-400 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/20"
        >
          View Menu
        </a>
      </div>
    </section>
  );
};

export default Hero;