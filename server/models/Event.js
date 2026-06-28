const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: { type: String, enum: ['Music','Tech','Sports','Art','Food','Other'] },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  venue: { name: String, address: String, city: String },
  date: { type: Date, required: true },
  endDate: Date,
  banner: String,
  ticketTiers: [{
    name: String,
    price: Number,
    totalSeats: Number,
    bookedSeats: { type: Number, default: 0 },
    perks: [String]
  }],
  status: { type: String, enum: ['draft','published','cancelled','completed'], default: 'draft' },
  tags: [String],
  views: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);