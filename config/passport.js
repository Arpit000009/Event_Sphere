const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Load User model
const User = require('../models/User');

module.exports = function (passport) {
  // Local Strategy
  passport.use(new LocalStrategy({
    usernameField: 'email', // by default it looks for 'username'
  }, async (email, password, done) => {
    try {
      // Match user
      const user = await User.findOne({ email: email.toLowerCase() });

      if (!user) {
        return done(null, false, { message: 'Incorrect email' });
      }

      // Match password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: 'Incorrect password' });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));

  // Serialize user to session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id).select('-password'); // Optional: remove password
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};
