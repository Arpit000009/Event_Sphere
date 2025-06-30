const express = require('express');
const router = express.Router();
const passport = require('passport');

const authCtrl = require('../controllers/authController');

router.get('/', authCtrl.getLogin);             // ✅ renders login page at /
router.get('/login', authCtrl.getLogin);
router.post('/login', authCtrl.postLogin);

router.get('/register', authCtrl.getRegister);
router.post('/register', authCtrl.postRegister);

router.get('/logout', authCtrl.logout);

router.get('/contact', (req, res) => {
    res.render('contact');
  });
router.get('/about', (req, res) => {
    res.render('../views/auth/about.ejs');
  });

  // Google OAuth login route
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth callback route
router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    req.session.userId = req.user._id; // set session manually
    res.redirect('/dashboard'); // or wherever you want to redirect after login
  }
);

module.exports = router;