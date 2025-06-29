const Event = require('../models/Event');
const Ticket = require('../models/Ticket');

// Show create form
exports.getCreateForm = (req, res) => {
  res.render('events/create', { title: 'Create Event' });
};

// Create new event
exports.createEvent = async (req, res) => {
  try {
    const { title, date, description, time, location, price } = req.body;
    
    const newEvent = new Event({
      title,
      date,
      description,
      time,
      location,
      price,
      creator: req.session.userId
    });
    
    await newEvent.save();
    res.redirect('/dashboard');
  } catch (err) {
    console.error('Error creating event:', err);
    res.status(500).send('Internal Server Error');
  }
};

// Show event details
exports.getEventDetails = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('creator').lean();
    
    if (!event) return res.status(404).send('Event not found');
    
    res.render('events/details', {
      event,
      user: res.locals.user,
      title: event.title
    });
  } catch (err) {
    console.error('Error fetching event:', err);
    res.status(500).send('Internal Server Error');
  }
};

// Show edit form
exports.getEditForm = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).lean();
    
    if (!event) return res.status(404).send('Event not found');
    if (event.creator.toString() !== req.session.userId) {
      return res.status(403).send('Access denied');
    }
    
    res.render('events/edit', { event, title: 'Edit Event' });
  } catch (err) {
    console.error('Error loading edit form:', err);
    res.status(500).send('Internal Server Error');
  }
};

// Update event
exports.updateEvent = async (req, res) => {
  try {
    const { title, date, description, time, location, price } = req.body;
    
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).send('Event not found');
    if (event.creator.toString() !== req.session.userId) {
      return res.status(403).send('Access denied');
    }
    
    await Event.findByIdAndUpdate(req.params.id, {
      title,
      date,
      description,
      time,
      location,
      price
    }, { new: true });
    
    res.redirect('/dashboard');
  } catch (err) {
    console.error('Error updating event:', err);
    res.status(500).send('Internal Server Error');
  }
};

// Delete event
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).send('Event not found');
    if (event.creator.toString() !== req.session.userId) {
      return res.status(403).send('Access denied');
    }
    
    await Event.findByIdAndDelete(req.params.id);
    await Ticket.deleteMany({ event: req.params.id }); // Clean up tickets
    res.redirect('/dashboard');
  } catch (err) {
    console.error('Error deleting event:', err);
    res.status(500).send('Internal Server Error');
  }
};

// Render price page
exports.renderPricePage = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.session.userId;
    
    // Get event details
    const event = await Event.findById(eventId).lean();
    if (!event) {
      return res.status(404).send('Event not found');
    }
    
    // Check if user already purchased ticket
    const alreadyPurchased = await Ticket.findOne({
      user: userId,
      event: eventId
    });
    
    res.render('events/price', {
      event,
      alreadyPurchased: !!alreadyPurchased,
      user: res.locals.user
    });
  } catch (err) {
    console.error('Error in renderPricePage:', err);
    res.status(500).send('Something went wrong');
  }
};