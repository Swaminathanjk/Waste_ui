const express = require("express");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const DisposedWaste = require("../models/DisposedWaste");



const router = express.Router();


router.get("/alluser", authMiddleware, async (req, res) => {
  try {
    const users = await User.find({}, "name points").sort({ points: -1 }); // Sort by highest points
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Fetch user details
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch disposed waste history
    const disposedWaste = await DisposedWaste.find({ userId }).sort({ disposedAt: -1 });

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

// Get disposal history of a user
router.get("/:userId/disposal-history", async (req, res) => {
  try {
    const { userId } = req.params;

    // Find user and return only disposal history
    const user = await User.findById(userId).select("disposalHistory points");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      points: user.points,
      disposalHistory: user.disposalHistory
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
