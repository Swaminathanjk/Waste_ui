const jwt = require("jsonwebtoken");
require("dotenv").config(); // Load environment variables

module.exports = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const token = authHeader.split(" ")[1]; // Extract token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use .env secret
    req.user = decoded; // Attach userId to request
    next();
  } catch (error) {
    return res.status(400).json({ message: "Invalid token" });
  }
};
