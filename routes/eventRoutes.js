const express = require('express');
const router = express.Router();
const eventCtrl = require('../controllers/eventController');
const ticketCtrl = require('../controllers/ticketController');
const auth = require('../middleware/auth');

// Admin-only routes
router.get('/new', auth, auth.isAdmin, eventCtrl.getCreateForm);
router.post('/', auth, auth.isAdmin, eventCtrl.createEvent);
router.get('/:id/edit', auth, auth.isAdmin, eventCtrl.getEditForm);
router.put('/:id', auth, auth.isAdmin, eventCtrl.updateEvent);
router.delete('/:id', auth, auth.isAdmin, eventCtrl.deleteEvent);

// Public and user routes
router.get('/:id', eventCtrl.getEventDetails);
router.get('/:id/price', auth, eventCtrl.renderPricePage);

// Ticket purchase route
router.post('/:eventId/purchase', auth, ticketCtrl.purchaseTicket);

module.exports = router;