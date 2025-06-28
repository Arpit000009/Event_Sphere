const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  time: String,
  location: String,
  price: { type: Number, required: false, default: 0 },  // ✅ Add this line
  privacy: { type: String, default: 'public' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Event', EventSchema);
