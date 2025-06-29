const Ticket = require('../models/Ticket');
const Event = require('../models/Event');
const User = require('../models/User');

exports.purchaseTicket = async (req, res) => {
  try {
    const userId = req.session.userId;
    const eventId = req.params.eventId;
    
    // Check if already purchased
    const alreadyPurchased = await Ticket.findOne({ user: userId, event: eventId });
    if (alreadyPurchased) {
      return res.redirect('/dashboard?message=already_purchased');
    }
    
    // Get event and user details
    const event = await Event.findById(eventId);
    const user = await User.findById(userId);
    
    if (!event || !user) {
      return res.status(404).send('Event or User not found');
    }
    
    // Create ticket
    await Ticket.create({
      user: userId,
      event: eventId
    });
    
    // Add user to event's attendees list
    await Event.findByIdAndUpdate(eventId, {
      $push: {
        attendees: {
          user: userId,
          name: user.name,
          email: user.email,
          registeredAt: new Date()
        }
      }
    });
    
    res.redirect('/dashboard?message=ticket_confirmed');
  } catch (err) {
    console.error('Error in purchaseTicket:', err);
    res.status(500).send('Something went wrong');
  }
};