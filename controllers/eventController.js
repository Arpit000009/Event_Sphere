const Event = require('../models/Event');

exports.getCreateForm = (req, res) => res.render('events/create');

exports.createEvent = async (req, res) => {
  await Event.create({ ...req.body, createdBy: req.session.userId });
  res.redirect('/dashboard');
};

exports.getEventDetails = async (req, res) => {
  const event = await Event.findById(req.params.id).populate('createdBy');
  res.render('events/details', { event });
};

exports.getEditForm = async (req, res) => {
  const event = await Event.findById(req.params.id);
  res.render('events/edit', { event });
};

exports.updateEvent = async (req, res) => {
  await Event.findByIdAndUpdate(req.params.id, req.body);
  res.redirect('/dashboard');
};

exports.deleteEvent = async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.redirect('/dashboard');
};
