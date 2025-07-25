const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

// Register user
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    logger.info(`User registered: ${user.username}`);
    sendTokenResponse(user, 201, res);
  } catch (error) {
    logger.error(`Registration error: ${error.message}`);
    res
      .status(400)
      .json({ success: false, message: "User registration failed." });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide email and password" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    logger.info(`User logged in: ${user.username}`);
    sendTokenResponse(user, 200, res);
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Helper to create and send token with full user data
const sendTokenResponse = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.status(statusCode).json({
    success: true,
    token,
    // THE FIX IS HERE: We now send the full user object, including preferences
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      feedPreferences: user.feedPreferences, // <-- This is the crucial addition
    },
  });
};
