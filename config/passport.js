<<<<<<< HEAD
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
=======
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const User = require('../models/User'); // Make sure this path is correct

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // console.log('Google Profile:', profile);
    
    // Check if user already exists in database
    let existingUser = await User.findOne({ 
      $or: [
        { googleId: profile.id },
        { email: profile.emails[0].value }
      ]
    });

    if (existingUser) {
      // Update Google ID if it wasn't set before
      if (!existingUser.googleId) {
        existingUser.googleId = profile.id;
        await existingUser.save();
      }
      console.log('Existing user found:', existingUser.email);
      return done(null, existingUser);
    }

    // Create new user
    const newUser = new User({
      googleId: profile.id,
      name: profile.displayName,
      email: profile.emails[0].value,
      profilePhoto: profile.photos[0].value,
      role: 'user', // Default role
      isVerified: true // Google users are automatically verified
    });

    const savedUser = await newUser.save();
    console.log('New user created:', savedUser.email);
    return done(null, savedUser);

  } catch (error) {
    console.error('Error in Google Strategy:', error);
    return done(error, null);
  }
}));

passport.serializeUser((user, done) => {
  console.log('Serializing user:', user._id);
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    console.log('Deserializing user:', user ? user.email : 'User not found');
    done(null, user);
  } catch (error) {
    console.error('Error deserializing user:', error);
    done(error, null);
  }
});
>>>>>>> 59c2140 (final)
