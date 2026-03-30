import React, { useState } from "react";

const Reservation = () => {
  const [formData, setFormData] = useState({
    name: "", email: "", date: "", time: "", guests: "", message: ""
  });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const response = await fetch("http://localhost:5001/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setStatus("success");
        setFormData({ name: "", email: "", date: "", time: "", guests: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Error submitting reservation:", error);
      setStatus("error");
    }
  };

  return (
    <section id="reservation" className="py-20 bg-beige-100 text-brown-900">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-serif font-bold mb-4">Reserve a Table</h2>
        <p className="text-lg text-gray-700 mb-10">
          Planning a special night? Book your table now and let us take care of the rest.
        </p>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6 bg-white shadow-xl rounded-xl p-8">
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your Name" required className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500" />
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Your Email" required className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500" />
          <input type="date" name="date" value={formData.date} onChange={handleChange} required className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500" />
          <input type="time" name="time" value={formData.time} onChange={handleChange} required className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500" />
          
          <select name="guests" value={formData.guests} onChange={handleChange} required className="md:col-span-2 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500">
            <option value="">Number of Guests</option>
            <option value="1">1 Guest</option>
            <option value="2">2 Guests</option>
            <option value="3">3 Guests</option>
            <option value="4">4 Guests</option>
            <option value="5">5 Guests</option>
            <option value="6+">6+ Guests</option>
          </select>

          <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Special Requests (optional)" className="md:col-span-2 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"></textarea>
          
          <button type="submit" disabled={status === "submitting"} className="md:col-span-2 bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg text-lg font-semibold transition duration-300 disabled:opacity-50">
            {status === "submitting" ? "Booking..." : "Book Now"}
          </button>

          {status === "success" && <p className="md:col-span-2 text-green-600 font-medium">Table reserved successfully!</p>}
          {status === "error" && <p className="md:col-span-2 text-red-600 font-medium">Something went wrong. Please try again.</p>}
        </form>
      </div>
    </section>
  );
};

export default Reservation;