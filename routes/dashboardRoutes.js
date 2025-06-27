const express = require('express');
const router = express.Router();
const dashboardCtrl = require('../controllers/dashboardController');
const auth = require('../middleware/auth');

router.get('/', auth, dashboardCtrl.getDashboard);

module.exports = router;
