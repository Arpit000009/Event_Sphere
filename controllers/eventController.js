const Event = require('../models/Event');

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
      createdBy: req.session.userId
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
    const event = await Event.findById(req.params.id).populate('createdBy').lean();

    if (!event) return res.status(404).send('Event not found');

    res.render('events/details', {
      event,
      user: req.session.user,  // ensure user context is passed if needed in details.ejs
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
    await Event.findByIdAndDelete(req.params.id);
    res.redirect('/dashboard');
  } catch (err) {
    console.error('Error deleting event:', err);
    res.status(500).send('Internal Server Error');
  }
};
