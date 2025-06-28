const Event = require('../models/Event');

exports.getDashboard = async (req, res) => {
  const { role, userId } = req.session;
  const query = role === 'admin' ? { createdBy: userId } : {};
  const events = await Event.find(query).lean();
  res.render('dashboard', { events });
};