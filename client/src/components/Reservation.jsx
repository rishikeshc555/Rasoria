import React, { useState } from "react";
import { API_BASE_URL } from "../apiConfig";

const Reservation = () => {
  const [formData, setFormData] = useState({
    name: "", email: "", date: "", time: "", guests: "", message: ""
  });
  const [status, setStatus] = useState(null);
  
  // Track if the user is currently interacting with the date/time fields
  const [dateFocused, setDateFocused] = useState(false);
  const [timeFocused, setTimeFocused] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const response = await fetch(`${API_BASE_URL}/api/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setStatus("success");
        setFormData({ name: "", email: "", date: "", time: "", guests: "", message: "" });
        setDateFocused(false);
        setTimeFocused(false);
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

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 bg-white shadow-xl rounded-xl p-5 md:p-8">
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your Name" required className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500" />
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Your Email" required className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500" />

          {/* Date Input */}
          <div className="relative w-full">
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              onFocus={() => setDateFocused(true)}
              onBlur={() => setDateFocused(false)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-700 bg-white"
            />
            {/* Overlay hides when focused OR when data is entered */}
            {!formData.date && !dateFocused && (
              <div className="absolute top-1 bottom-1 left-1 right-12 flex items-center pl-3 bg-white text-gray-400 pointer-events-none">
                Select Date
              </div>
            )}
          </div>

          {/* Time Input */}
          <div className="relative w-full">
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              onFocus={() => setTimeFocused(true)}
              onBlur={() => setTimeFocused(false)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-700 bg-white"
            />
            {/* Overlay hides when focused OR when data is entered */}
            {!formData.time && !timeFocused && (
              <div className="absolute top-1 bottom-1 left-1 right-12 flex items-center pl-3 bg-white text-gray-400 pointer-events-none">
                Select Time
              </div>
            )}
          </div>

          <select name="guests" value={formData.guests} onChange={handleChange} required className="w-full md:col-span-2 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-600">
            <option value="">Number of Guests</option>
            <option value="1">1 Guest</option>
            <option value="2">2 Guests</option>
            <option value="3">3 Guests</option>
            <option value="4">4 Guests</option>
            <option value="5">5 Guests</option>
            <option value="6+">6+ Guests</option>
          </select>

          <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Special Requests (optional)" className="w-full md:col-span-2 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"></textarea>

          <button type="submit" disabled={status === "submitting"} className="w-full md:col-span-2 bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg text-lg font-semibold transition duration-300 disabled:opacity-50">
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