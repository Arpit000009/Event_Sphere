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
const Event = require('../models/Event');
const User = require('../models/User');

exports.purchaseTicket = async (req, res) => {
  const userId = req.session.userId;
  const eventId = req.params.eventId;

  try {
    const event = await Event.findById(eventId);

    if (!event.attendees.includes(userId)) {
      event.attendees.push(userId);
      await event.save();
    }

    req.session[`purchased_${eventId}`] = true; // persist UI across sessions

    res.redirect('/dashboard');
  } catch (err) {
    console.error('❌ Error in purchaseTicket:', err);
    res.status(500).send('Error processing ticket');
  }
};
