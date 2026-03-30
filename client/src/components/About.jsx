import React from "react";

const About = () => {
  return (
    <section
      id="about"
      className="py-20 bg-white text-brown-900"
    >
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        {/* Left Image */}
        <div>
          <img
            src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80"
            alt="Elegant Restaurant Interior"
            className="rounded-xl shadow-lg"
          />
        </div>

        {/* Right Text Content */}
        <div>
          <h2 className="text-4xl font-serif font-bold mb-4">
            Welcome to Our Restaurant
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            At <span className="text-orange-600 font-semibold">Rasoria</span>, we’re more than just a place to eat — we're a culinary experience. 
            Our mission is to craft unforgettable moments through delicious food, warm ambiance, and heartfelt service.
          </p>
          <p className="text-md text-gray-600 mb-6">
            Whether it's a romantic dinner, a family gathering, or a business lunch — Rasoria is the perfect destination. 
            Our chefs use only the freshest ingredients to serve meals that speak to the soul.
          </p>
          <a
            href="#menu"
            className="inline-block px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-full transition duration-300"
          >
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
};

export default About;
