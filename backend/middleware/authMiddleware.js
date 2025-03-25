const jwt = require("jsonwebtoken");
require("dotenv").config(); // Load environment variables

module.exports = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.userId) {
      // ✅ Ensure correct key is checked
      return res
        .status(400)
        .json({ message: "Invalid token payload: Missing user ID" });
    }

    req.user = { userId: decoded.userId }; // ✅ Fix: Assign correct key
    console.log("Authenticated User ID:", req.user.userId);

    next();
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Invalid token", error: error.message });
  }
};
