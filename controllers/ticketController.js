// const Event = require('../models/Event');

// exports.renderPaymentPage = async (req, res) => {
//   const event = await Event.findById(req.params.eventId).lean();
//   res.render('payment', { event });
// };


// // exports.purchaseTicket = async (req, res) => {
// //   try {
// //     // You can store ticket record or just redirect
// //     res.send('Payment success (not yet implemented)');
// //   } catch (err) {
// //     console.error('❌ Error in purchaseTicket:', err);
// //     res.status(500).send('Server Error');
// //   }
// // };


// ticketController.js
const Ticket = require('../models/Ticket');
const Event = require('../models/Event');

exports.purchaseTicket = async (req, res) => {
  try {
    const userId = req.session.userId;
    const eventId = req.params.eventId;

    // Check if already purchased
    const alreadyPurchased = await Ticket.findOne({ user: userId, event: eventId });
    if (alreadyPurchased) {
      return res.redirect('/dashboard'); // Or show "already purchased" message
    }

    // Create ticket
    await Ticket.create({
      user: userId,
      event: eventId
    });

    res.redirect('/dashboard'); // Ticket successfully purchased
  } catch (err) {
    console.error('❌ Error in purchaseTicket:', err);
    res.status(500).send('Something went wrong');
  }
};

