const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:5000/api/auth/google/callback',
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });
      
      if (!user) {
        user = await User.create({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          isGoogleUser: true,
          emailVerified: true,
          profileCompleted: true,
        });
      }
      
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

// Google Login Route
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google Callback Route
router.get('/google/callback', 
  passport.authenticate('google', { session: false, failureRedirect: 'http://localhost:3000/login' }),
  (req, res) => {
    const token = generateToken(req.user.id);
    const userData = {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      profileCompleted: true
    };
    res.redirect(`http://localhost:3000/google-callback?token=${token}&user=${encodeURIComponent(JSON.stringify(userData))}`);
  }
);

module.exports = router;