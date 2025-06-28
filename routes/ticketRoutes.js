// const express = require('express');
// const router = express.Router();
// const ticketController = require('../controllers/ticketController');

// // ✅ Import middlewares individually
// const ensureAuth = require('../middleware/auth');
// const isUser = require('../middleware/auth').isUser;

// // ✅ Routes
// router.get('/buy/:eventId', ensureAuth, isUser, ticketController.renderPaymentPage);
// // router.post('/purchase/:eventId', ensureAuth, isUser, ticketController.purchaseTicket);

// module.exports = router;

// ticketRoutes.js
const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');

// Render price.ejs
router.get('/buy/:eventId', ticketController.renderPaymentPage);

// Optional (for after-payment redirects)
router.get('/success', (req, res) => {
  res.send('✅ Payment completed successfully.');
});

router.get('/cancel', (req, res) => {
  res.send('❌ Payment cancelled.');
});

module.exports = router;


