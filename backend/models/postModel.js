const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      trim: true,
    },
    author: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    media: {
      type: String, // Path to the uploaded media file
    },
    link: {
      type: String, // URL link
    },
    reactions: {
      like: { type: Number, default: 0 },
      love: { type: Number, default: 0 },
      haha: { type: Number, default: 0 },
      wow: { type: Number, default: 0 },
      sad: { type: Number, default: 0 },
      angry: { type: Number, default: 0 },
    },
    reactionsUsers: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // User who reacted
        reaction: { type: String }, // Reaction type (e.g., "like", "love")
      },
    ],
    comments: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        username: { type: String },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);