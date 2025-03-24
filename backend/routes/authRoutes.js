const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const User = require("../models/userModel"); // Import the User model
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const router = express.Router();

// ✅ Google authentication route
router.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// ✅ Google OAuth callback route
router.get("/google/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:3000/dashboard",
    failureRedirect: "http://localhost:3000/login"
  })
);

router.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      console.error("Error during logout:", err);
      return next(err); // Pass the error to the error handler
    }

    // Destroy the session
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).json({ error: "Failed to log out" });
      }

      // Clear the session cookie
      res.clearCookie("connect.sid", { path: "/" });

      // Send a success response
      res.status(200).json({ message: "Logged out successfully" });
    });
  });
});

// ✅ Get logged-in user data
router.get("/user", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user); // Return the logged-in user
  } else {
    res.status(200).json(null); // Return null if no user is logged in
  }
});

// ✅ Registration Route
router.post("/register", async (req, res) => {
  console.log("Request received at /register");
  console.log("Request body:", req.body);

  const { email, password } = req.body;

  if (!email || !password) {
    console.log("Validation failed: Missing email or password");
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("Validation failed: Email already exists");
      return res.status(400).json({ error: "Email already exists" });
    }

    // Extract the name from the email (everything before the '@')
    const name = email.split("@")[0];

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = new User({
      email,
      password: hashedPassword,
      name, // Set the name to the extracted value
    });
    await newUser.save();

    console.log("User registered successfully:", newUser);
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err); // Handle errors
    }
    if (!user) {
      return res.status(401).json({ error: info.message }); // Authentication failed
    }

    // Log the user in
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      res.status(200).json({ message: "Login successful", user });
    });
  })(req, res, next);
});

module.exports = router;

router.post("/password-reset", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000; // Token valid for 1 hour

    // Save the token and expiry to the user
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // Send the reset email
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // Your email password
      },
    });

    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
    const mailOptions = {
      to: user.email,
      subject: "Password Reset Request",
      html: `<p>You requested a password reset. Click the link below to reset your password:</p>
             <a href="${resetUrl}">${resetUrl}</a>
             <p>This link will expire in 1 hour.</p>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Password reset email sent" });
  } catch (err) {
    console.error("Error during password reset request:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  if (!newPassword) {
    return res.status(400).json({ error: "New password is required" });
  }

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }, // Ensure the token is not expired
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password and clear the reset token
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Error during password reset:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});