const express = require("express");
const User = require("../models/User");
const WasteInfo = require("../models/WasteInfo");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Store disposal action
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { wasteName } = req.body;
    const userId = req.user.userId;

    const wasteData = await WasteInfo.findOne({ name: wasteName });
    if (!wasteData) {
      return res.status(404).json({ message: "Waste item not found" });
    }

    const disposedWaste = new DisposedWaste({
      userId,
      wasteName,
      category: wasteData.category,
      disposalMethod: wasteData.disposal,
      pointsEarned: wasteData.points,
    });

    await disposedWaste.save();
    res.json({ message: "Waste added to disposal record", points: wasteData.points });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


module.exports = router;
