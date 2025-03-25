const mongoose = require("mongoose");

const WasteInfoSchema = new mongoose.Schema({
  category: { type: String, required: true },
  name: { type: String, required: true, unique: true },
  info: { type: String, required: true },
  disposal: { type: String, required: true },
  facts: { type: String, required: true },
  points: { type: Number, required: true }
});

module.exports = mongoose.model("WasteInfo", WasteInfoSchema);
