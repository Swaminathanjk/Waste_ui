const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  points: { type: Number, default: 0 }, // Total points earned
  disposalHistory: [
    {
      wasteName: { type: String, required: true },
      category: { type: String, required: true },
      disposalMethod: { type: String, required: true },
      pointsEarned: { type: Number, required: true },
    },
  ],
});

module.exports = mongoose.model("User", UserSchema);
