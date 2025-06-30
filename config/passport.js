const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// ADD THIS:
const GoogleStrategy = require('passport-google-oauth20').Strategy;

module.exports = function (passport) {
  // ✅ Local Strategy
  passport.use(new LocalStrategy({
    usernameField: 'email'
  }, async (email, password, done) => {
    // your local auth logic
  }));

  // ✅ Google Strategy — ADD BELOW LOCAL STRATEGY
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const existingUser = await User.findOne({ googleId: profile.id });
      if (existingUser) return done(null, existingUser);

      const newUser = new User({
        googleId: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName
      });

      await newUser.save();
      return done(null, newUser);
    } catch (err) {
      return done(err, null);
    }
  }));

  // ✅ Sessions
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id).select('-password');
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};
