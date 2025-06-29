const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  purchaseDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['confirmed'], default: 'confirmed' }
}, {
  timestamps: true
});

// Ensure one ticket per user per event
TicketSchema.index({ user: 1, event: 1 }, { unique: true });

module.exports = mongoose.model('Ticket', TicketSchema);