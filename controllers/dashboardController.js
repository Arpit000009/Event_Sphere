const Ticket = require('../models/Ticket');
const Event = require('../models/Event');
const User = require('../models/User');

exports.getDashboard = async (req, res) => {
  const { role, userId } = req.session;

  let events = [];

  if (role === 'admin') {
    // Get events created by the admin
    events = await Event.find({ createdBy: userId }).lean();

    // For each event, find ticket buyers
    for (const event of events) {
      const tickets = await Ticket.find({ event: event._id }).populate('user').lean();

      // Attach user info to the event
      event.purchasedUsers = tickets.map(ticket => ({
        name: ticket.user?.name || 'Unknown',
        email: ticket.user?.email || 'N/A'
      }));
    }

  } else {
    // Get all events for regular users
    events = await Event.find().lean();

    // Find all tickets bought by this user
    const userTickets = await Ticket.find({ user: userId }).lean();
    const purchasedEventIds = userTickets.map(t => t.event.toString());

    // Mark events as purchased for UI logic
    events = events.map(event => ({
      ...event,
      purchased: purchasedEventIds.includes(event._id.toString())
    }));
  }

  res.render('dashboard', { events });
};
