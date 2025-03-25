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

    if (req.user.userId !== userId) {
      // ✅ Fix: Ensure correct ID check
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const disposedWaste = await DisposedWaste.find({ userId }).sort({
      disposedAt: -1,
    });

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

    if (!wasteName) {
      return res.status(400).json({ message: "Waste name is required" });
    }

    // ✅ Normalize the waste name (trim spaces & ignore case)
    const normalizedWasteName = wasteName.trim().replace(/\s+/g, " ");
    
    const wasteItem = await WasteInfo.findOne({
      name: { $regex: `^${normalizedWasteName.replace(/\s/g, "\\s")}$`, $options: "i" },
    });

    if (!wasteItem) {
      return res.status(404).json({ message: "Waste item not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const disposedWaste = await DisposedWaste.create({
      userId,
      wasteName: wasteItem.name,
      category: wasteItem.category,
      disposalMethod: wasteItem.disposal,
      pointsEarned: wasteItem.points,
      disposedAt: new Date(),
    });

    user.disposalHistory.push({
      wasteName: wasteItem.name,
      category: wasteItem.category,
      disposalMethod: wasteItem.disposal,
      pointsEarned: wasteItem.points,
      disposedAt: new Date(),
    });

    user.points += wasteItem.points;
    await user.save();

    res.json({
      message: "Disposal recorded successfully",
      points: wasteItem.points,
      disposedWaste,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


module.exports = router;
