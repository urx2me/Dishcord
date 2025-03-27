const express = require("express");
const router = express.Router();
const multer = require("multer");
const Story = require("../models/storyModel"); // Story model
const User = require("../models/userModel"); // User model

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/stories/"); // Directory to store uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});
const upload = multer({ storage });

// Upload a story
router.post("/upload", upload.single("file"), async (req, res) => {
  const { userId, title } = req.body;

  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    const newStory = new Story({
      userId,
      title,
      fileUrl: `/uploads/stories/${req.file.filename}`,
      createdAt: new Date(),
    });

    await newStory.save();
    res.status(201).json({ message: "Story uploaded successfully", story: newStory });
  } catch (err) {
    console.error("Error uploading story:", err);
    res.status(500).json({ error: "Failed to upload story" });
  }
});

// Fetch all of the user's stories
router.get("/user/:userId", async (req, res) => {
    const { userId } = req.params;
  
    try {
      const stories = await Story.find({ userId })
        .sort({ createdAt: 1 }) // Fetch in ascending order of creation
        .populate("userId", "name"); // Populate userId to get the name
  
      res.status(200).json({ stories }); // Return an array of stories
    } catch (err) {
      console.error("Error fetching user's stories:", err);
      res.status(500).json({ error: "Failed to fetch user's stories" });
    }
  });
// Fetch friends' stories
// Fetch friends' stories
router.get("/friends/:userId", async (req, res) => {
    const { userId } = req.params;
  
    try {
      const user = await User.findById(userId).populate("friends");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const friendIds = user.friends.map((friend) => friend._id);
      const stories = await Story.find({ userId: { $in: friendIds } })
        .sort({ createdAt: -1 })
        .populate("userId", "name"); // Populate the userId field and select only the name
  
      const formattedStories = stories.map(story => ({
        _id: story._id,
        userId: story.userId._id,
        name: story.userId.name, // Access the name from the populated user object
        fileUrl: story.fileUrl,
        title: story.title,
      }));
  
      res.status(200).json({ stories: formattedStories });
    } catch (err) {
      console.error("Error fetching friends' stories:", err);
      res.status(500).json({ error: "Failed to fetch friends' stories" });
    }
  });


module.exports = router;