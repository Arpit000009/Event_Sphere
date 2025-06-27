const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/authController');

router.get('/', authCtrl.getLogin);             // ✅ renders login page at /
router.get('/login', authCtrl.getLogin);
router.post('/login', authCtrl.postLogin);

router.get('/register', authCtrl.getRegister);
router.post('/register', authCtrl.postRegister);

router.get('/logout', authCtrl.logout);

module.exports = router;
