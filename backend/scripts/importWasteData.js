const mongoose = require("mongoose");
const WasteInfo = require("../models/WasteInfo");
const wasteData = require("../waste.json");
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB");

    // Clear existing data (optional)
    await WasteInfo.deleteMany();

    // Insert new waste data
    await WasteInfo.insertMany(wasteData);

    console.log("Waste data imported successfully!");
    mongoose.disconnect();
  })
  .catch((err) => console.error("Error connecting to MongoDB:", err));
