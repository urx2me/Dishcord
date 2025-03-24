const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");

require("dotenv").config();

// ✅ Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = new User({
            googleId: profile.id,
            name: profile.displayName, // This sets the name field
            email: profile.emails[0].value,
            avatar: profile.photos[0].value,
          });
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// ✅ Local Strategy for Email/Password Login
passport.use(
  new LocalStrategy(
    { usernameField: "email" }, // Use "email" instead of the default "username"
    async (email, password, done) => {
      try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, { message: "Incorrect email or password." });
        }

        // Check if the password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: "Incorrect email or password." });
        }

        // If everything is fine, return the user
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// ✅ Serialize user
passport.serializeUser((user, done) => {
  done(null, user.id); // Save only the user ID in the session
});

// ✅ Deserialize user
passport.deserializeUser(async (id, done) => {
  try {
    // Fetch the full user object, including the name field
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});