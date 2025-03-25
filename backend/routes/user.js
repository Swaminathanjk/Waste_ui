// backend/routes/user.js
const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");
const DisposedWaste = require("../models/DisposedWaste");

const router = express.Router();

// ✅ Get All Users (Leaderboard)
router.get("/alluser", authMiddleware, async (req, res) => {
  try {
    const users = await User.find({}, "name points").sort({ points: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Get User Profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const disposedWaste = await DisposedWaste.find({ userId }).sort({
      disposedAt: -1,
    });
    res.json({
      name: user.name,
      email: user.email,
      points: user.points,
      disposedWaste,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Get User's Disposal History
router.get("/:userId/disposal-history", authMiddleware, async (req, res) => {
  try {
    if (req.user.userId !== req.params.userId) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const user = await User.findById(req.params.userId).select(
      "disposalHistory points"
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    // ✅ Ensure disposalHistory is sorted (latest first)
    const sortedHistory = user.disposalHistory.sort(
      (a, b) => new Date(b.disposedAt) - new Date(a.disposedAt)
    );

    res.json({ points: user.points, disposalHistory: sortedHistory });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
