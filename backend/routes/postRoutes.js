const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Post = require("../models/postModel");
const { isAuthenticated } = require("../middleware/auth"); // Middleware to check if the user is authenticated

// ✅ Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files to the "uploads" directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Add a timestamp to the file name
  },
});
const upload = multer({ storage });

// ✅ Create a new post
router.post("/", isAuthenticated, upload.single("media"), async (req, res) => {
  const { content, link } = req.body;

  // Validate input
  if (!content && !req.file && !link) {
    return res.status(400).json({ error: "Post content, media, or link is required." });
  }

  try {
    // Create a new post
    const newPost = new Post({
      content: content || (req.file ? `/uploads/${req.file.filename}` : null), // Use media path if content is not provided
      author: req.user.name, // Assuming `req.user` contains the authenticated user's info
      userId: req.user._id,
      media: req.file ? `/uploads/${req.file.filename}` : null, // Save media path if a file is uploaded
      link: link || null, // Save link if provided
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ error: "Failed to create post. Please try again." });
  }
});

// ✅ Fetch all posts (for the home feed)
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }); // Sort posts by newest first
    res.status(200).json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ error: "Failed to fetch posts. Please try again." });
  }
});

module.exports = router;