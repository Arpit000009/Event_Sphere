const Event = require('../models/Event');

exports.getDashboard = async (req, res) => {
  const events = await Event.find({ createdBy: req.session.userId });
  res.render('dashboard', { events });
};
