const Event = require('../models/Event');
const Ticket = require('../models/Ticket');

exports.getDashboard = async (req, res) => {
  try {
    const userId = req.session.userId;
    const userRole = res.locals.user?.role;
    
    let events;
    
    if (userRole === 'admin') {
      // Admin sees their created events with attendees
      events = await Event.find({ creator: userId })
        .populate('attendees.user', 'name email')
        .sort({ date: 1 });
    } else {
      // Regular users see all events
      events = await Event.find({})
        .populate('creator', 'name')
        .sort({ date: 1 })
        .lean();
      
      // Check which events the user has purchased tickets for
      const userTickets = await Ticket.find({ user: userId }).select('event');
      const purchasedEventIds = userTickets.map(ticket => ticket.event.toString());
      
      // Mark events as purchased
      events.forEach(event => {
        event.purchased = purchasedEventIds.includes(event._id.toString());
      });
    }
    
    res.render('dashboard', {
      events,
      user: res.locals.user,
      message: req.query.message
    });
  } catch (err) {
    console.error('Error in getDashboard:', err);
    res.status(500).send('Something went wrong');
  }
};