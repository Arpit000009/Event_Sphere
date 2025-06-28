const Event = require('../models/Event');

exports.getDashboard = async (req, res) => {
  const { role, userId } = req.session;

  const query = role === 'admin' 
    ? { createdBy: userId } 
    : { 'createdBy': { $exists: true }, 'createdBy.role': 'admin' };

  const events = await Event.find(role === 'admin' ? { createdBy: userId } : {}).populate('createdBy');
  res.render('dashboard', { events });
};

