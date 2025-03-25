// backend/routes/disposal.js
const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const DisposedWaste = require("../models/DisposedWaste");
const WasteInfo = require("../models/WasteInfo");
const User = require("../models/User");

const router = express.Router();

// ✅ Store Global Disposal Record
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { wasteName } = req.body;
    const userId = req.user.userId;

    if (!wasteName) {
      return res.status(400).json({ message: "Waste name is required" });
    }

    // ✅ Normalize the waste name (trim spaces & ignore case)
    const normalizedWasteName = wasteName.trim().replace(/\s+/g, " ");

    const wasteItem = await WasteInfo.findOne({
      name: {
        $regex: `^${normalizedWasteName.replace(/\s/g, "\\s")}$`,
        $options: "i",
      },
    });

    if (!wasteItem) {
      return res.status(404).json({ message: "Waste item not found" });
    }

    const disposedWaste = new DisposedWaste({
      userId,
      wasteName: wasteItem.name,
      category: wasteItem.category,
      disposalMethod: wasteItem.disposal,
      pointsEarned: wasteItem.points,
      disposedAt: new Date(),
    });

    await disposedWaste.save();

    const user = await User.findById(userId);
    user.points += wasteItem.points;
    await user.save();

    res.json({
      message: "Waste added successfully",
      pointsEarned: wasteItem.points,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Fetch Global Disposal Records
router.get("/", async (req, res) => {
  try {
    const disposedWaste = await DisposedWaste.find().sort({ disposedAt: -1 });
    res.json(disposedWaste);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
