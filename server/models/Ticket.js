const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tierName: String,
  price: Number,
  qrCode: String,
  qrToken: String,
  status: { type: String, enum: ['booked','checked-in','cancelled'], default: 'booked' },
  paymentId: String,
  checkedInAt: Date,
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);