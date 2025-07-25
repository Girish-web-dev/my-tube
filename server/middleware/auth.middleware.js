const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const logger = require("../utils/logger");

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    logger.warn("Authentication attempt with no token.");
    return res
      .status(401)
      .json({ success: false, message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    logger.error(`Authentication error: ${err.message}`);
    return res
      .status(401)
      .json({ success: false, message: "Not authorized, token failed" });
  }
};
