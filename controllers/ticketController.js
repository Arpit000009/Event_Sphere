const Event = require('../models/Event');

// Render Razorpay payment UI
exports.renderBuyPage = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).send('Event not found');
    res.render('payment', { event }); // Use `views/payment.ejs`
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Purchase simulation (replace with Razorpay)
exports.purchaseTicket = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).send('Event not found');

    // In real Razorpay flow, you'd verify payment signature here
    res.send(`✅ Payment successful for ₹${event.price}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
