const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  price: { type: Number, required: true },
  category: { type: String, required: true }, // e.g., "Main Course", "Dessert"
  imageUrl: { type: String, default: '' },
  isOutOfStock: { type: Boolean, default: false } // Admin can toggle this
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', menuItemSchema);