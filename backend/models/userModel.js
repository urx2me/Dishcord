const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  googleId: { type: String, unique: true, sparse: true }, // Optional for email/password users
  name: { type: String }, // Optional for email/password users
  email: { type: String, required: true, unique: true }, // Required for all users
  password: { type: String }, // Required for email/password users
  avatar: { type: String }, // Optional for all users
  resetToken: { type: String }, // Token for password reset
  resetTokenExpiry: { type: Date }, // Expiry time for the reset token
});

module.exports = mongoose.model("User", userSchema);