const express = require("express");
const WasteInfo = require("../models/WasteInfo"); // Waste data model
const router = express.Router();

// Get all waste items
router.get("/api/waste/waste-items", async (req, res) => {
  try {
    const wasteItems = await WasteInfo.find({}).lean(); // Use lean() for faster response
    res.json(wasteItems);
  } catch (error) {
    console.error("Error fetching waste items:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get a specific waste item by name
router.get("/waste-items/:name", async (req, res) => {
  try {
    const wasteItem = await WasteInfo.findOne({ name: req.params.name });
    if (!wasteItem) {
      return res.status(404).json({ message: "Waste item not found" });
    }
    res.json(wasteItem);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching waste item", error: error.message });
  }
});

module.exports = router;
