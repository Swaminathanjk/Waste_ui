const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/waste", require("./routes/waste"));  // Waste info routes
app.use("/api/disposal", require("./routes/disposal")); //global disposal
app.use("/api/user", require("./routes/user")); //user details
app.use("/api/auth", require("./routes/auth")); //user auth
app.use("/api/waste", require("./routes/disposedWaste")); //user disposal

// Default Route
app.get("/", (req, res) => {
  res.send("Waste Sorting API is running...");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
