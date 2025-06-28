routes/ticketRoutes.js
const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const { ensureAuth, isUser } = require('../middleware/auth');

router.post('/purchase/:eventId', ensureAuth, isUser, ticketController.purchaseTicket);

module.exports = router;
