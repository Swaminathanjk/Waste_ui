// Backend: waste.js (Handles user disposal history)
const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");
const WasteInfo = require("../models/WasteInfo");
const DisposedWaste = require("../models/DisposedWaste");

const router = express.Router();

// ✅ Fetch User's Disposed Waste
router.get("/user/:userId", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const disposedWaste = await DisposedWaste.find({ userId }).sort({ disposedAt: -1 });
    res.json(disposedWaste);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Log Waste Disposal under User
router.post("/dispose", authMiddleware, async (req, res) => {
  try {
    const { wasteName } = req.body;
    const userId = req.user.userId;

    const wasteItem = await WasteInfo.findOne({ name: wasteName });
    if (!wasteItem) {
      return res.status(404).json({ message: "Waste item not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.disposalHistory.push({
      wasteName: wasteItem.name,
      category: wasteItem.category,
      disposalMethod: wasteItem.disposal,
      pointsEarned: wasteItem.points,
    });

    user.points += wasteItem.points;
    await user.save();

    res.json({ message: "Disposal recorded successfully", points: wasteItem.points });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;