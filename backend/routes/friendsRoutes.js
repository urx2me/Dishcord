const express = require("express");
const User = require("../models/userModel"); // Import the User model
const router = express.Router();

// Send a friend request
router.post("/send-request", async (req, res) => {
  const { senderId, receiverId } = req.body;

  try {
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if a request already exists
    if (receiver.friendRequests.includes(senderId)) {
      return res.status(400).json({ error: "Friend request already sent" });
    }

    // Add the sender's ID to the receiver's friendRequests array
    receiver.friendRequests.push(senderId);
    await receiver.save();

    res.status(200).json({ message: "Friend request sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send friend request" });
  }
});

// Accept a friend request
router.post("/accept-request", async (req, res) => {
  const { userId, senderId } = req.body;

  try {
    const user = await User.findById(userId);
    const sender = await User.findById(senderId);

    if (!user || !sender) {
      return res.status(404).json({ error: "User not found" });
    }

    // Remove the sender's ID from the user's friendRequests array
    user.friendRequests = user.friendRequests.filter((id) => id.toString() !== senderId);

    // Add each other to the friends list
    user.friends.push(senderId);
    sender.friends.push(userId);

    await user.save();
    await sender.save();

    res.status(200).json({ message: "Friend request accepted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to accept friend request" });
  }
});

// Reject a friend request
router.post("/reject-request", async (req, res) => {
  const { userId, senderId } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Remove the sender's ID from the user's friendRequests array
    user.friendRequests = user.friendRequests.filter((id) => id.toString() !== senderId);

    await user.save();

    res.status(200).json({ message: "Friend request rejected" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to reject friend request" });
  }
});

// Get friend requests
router.get("/friend-requests/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate("friendRequests", "name email");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ friendRequests: user.friendRequests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch friend requests" });
  }
});

// Get suggested friends
router.get("/suggested-friends/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find users who are not friends and have no pending requests
    const suggestedFriends = await User.find({
      _id: { $ne: userId, $nin: [...user.friends, ...user.friendRequests] },
    }).select("name email");

    res.status(200).json({ suggestedFriends });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch suggested friends" });
  }
});

// Get friends list
router.get("/friends/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate("friends", "name email");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ friends: user.friends });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch friends list" });
  }
});

// Cancel a friend request
router.post("/cancel-request", async (req, res) => {
    const { senderId, receiverId } = req.body;
  
    try {
      const receiver = await User.findById(receiverId);
  
      if (!receiver) {
        return res.status(404).json({ error: "User not found" });
      }
  
      // Remove the sender's ID from the receiver's friendRequests array
      receiver.friendRequests = receiver.friendRequests.filter((id) => id.toString() !== senderId);
      await receiver.save();
  
      res.status(200).json({ message: "Friend request cancelled" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to cancel friend request" });
    }
  });

  // Unfriend a user
router.post("/unfriend", async (req, res) => {
    const { userId, friendId } = req.body;
  
    try {
      const user = await User.findById(userId);
      const friend = await User.findById(friendId);
  
      if (!user || !friend) {
        return res.status(404).json({ error: "User not found" });
      }
  
      // Remove each other from the friends list
      user.friends = user.friends.filter((id) => id.toString() !== friendId);
      friend.friends = friend.friends.filter((id) => id.toString() !== userId);
  
      await user.save();
      await friend.save();
  
      res.status(200).json({ message: "Unfriended successfully" });
    } catch (err) {
      console.error("Error unfriending user:", err);
      res.status(500).json({ error: "Failed to unfriend user" });
    }
  });

module.exports = router;