const mongoose = require("mongoose");

const DisposedWasteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  wasteName: { type: String, required: true },
  category: { type: String, required: true },
  disposalMethod: { type: String, required: true },
  pointsEarned: { type: Number, required: true },
  disposedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("DisposedWaste", DisposedWasteSchema);
