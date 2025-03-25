// backend/routes/waste.js
const express = require("express");
const WasteInfo = require("../models/WasteInfo");
const router = express.Router();

// ✅ Get all waste items
router.get("/waste-items", async (req, res) => {
  try {
    const wasteItems = await WasteInfo.find();
    res.json(wasteItems);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching waste data", error: error.message });
  }
});

// ✅ Get a specific waste item by name
router.get("/waste-items/:name", async (req, res) => {
  try {
    const wasteName = req.params.name.trim().replace(/\s+/g, " "); // Normalize spaces

    const wasteItem = await WasteInfo.findOne({
      name: { $regex: `^${wasteName.replace(/\s/g, "\\s")}$`, $options: "i" },
    });

    if (!wasteItem)
      return res.status(404).json({ message: "Waste item not found" });

    res.json(wasteItem);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching waste item", error: error.message });
  }
});

module.exports = router;
