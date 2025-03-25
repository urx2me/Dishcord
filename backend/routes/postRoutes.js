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

router.post("/:postId/reactions", isAuthenticated, async (req, res) => {
  const { reaction } = req.body; // e.g., "like", "love", etc.
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if the user has already reacted
    const userReactionField = `reactions.${reaction}`;
    const userReactionIndex = post.reactionsUsers?.findIndex(
      (r) => r.userId.toString() === req.user._id.toString()
    );

    if (userReactionIndex !== -1) {
      // If the user has already reacted, toggle the reaction
      const existingReaction = post.reactionsUsers[userReactionIndex].reaction;
      if (existingReaction === reaction) {
        // Remove the reaction
        post.reactions[reaction] -= 1;
        post.reactionsUsers.splice(userReactionIndex, 1);
      } else {
        // Change the reaction
        post.reactions[existingReaction] -= 1;
        post.reactions[reaction] += 1;
        post.reactionsUsers[userReactionIndex].reaction = reaction;
      }
    } else {
      // Add a new reaction
      post.reactions[reaction] += 1;
      post.reactionsUsers.push({ userId: req.user._id, reaction });
    }

    await post.save();
    res.status(200).json(post);
  } catch (err) {
    console.error("Error updating reactions:", err);
    res.status(500).json({ error: "Failed to update reactions" });
  }
});

// Add a comment to a post
router.post("/:postId/comments", isAuthenticated, async (req, res) => {
  const { text } = req.body;
  const { postId } = req.params;

  if (!text.trim()) {
    return res.status(400).json({ error: "Comment text cannot be empty" });
  }

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const comment = {
      userId: req.user._id,
      username: req.user.name,
      text,
    };

    post.comments.push(comment);
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ error: "Failed to add comment" });
  }
});

router.put("/:postId/comments/:commentId", isAuthenticated, async (req, res) => {
  const { postId, commentId } = req.params;
  const { text } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    // Ensure the user owns the comment
    if (comment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    comment.text = text;
    await post.save();

    res.status(200).json({ comments: post.comments });
  } catch (err) {
    console.error("Error editing comment:", err);
    res.status(500).json({ error: "Failed to edit comment" });
  }
});

router.delete("/:postId/comments/:commentId", isAuthenticated, async (req, res) => {
  const { postId, commentId } = req.params;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    // Ensure the user owns the comment
    if (comment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    post.comments = post.comments.filter((c) => c._id.toString() !== commentId);
    await post.save();

    res.status(200).json({ comments: post.comments });
  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(500).json({ error: "Failed to delete comment" });
  }
});