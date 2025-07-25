const User = require("../models/User.model");
const SavedVideo = require("../models/SavedVideo.model");
const bcrypt = require("bcryptjs"); // Required for password comparison and hashing
const logger = require("../utils/logger");

// --- Functions for managing user's feed preferences ---
exports.getFeedPreferences = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, data: user.feedPreferences });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateFeedPreferences = async (req, res) => {
  try {
    const { preferences } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { feedPreferences: preferences },
      { new: true, runValidators: true }
    );
    res.status(200).json({ success: true, data: user.feedPreferences });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- Functions for managing user's saved videos ---
exports.getSavedVideos = async (req, res) => {
  try {
    const savedVideos = await SavedVideo.find({ user: req.user.id }).sort({
      savedAt: -1,
    });
    res.status(200).json({ success: true, data: savedVideos });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.addSavedVideo = async (req, res) => {
  try {
    const { videoId, videoData } = req.body;
    await SavedVideo.create({ user: req.user.id, videoId, videoData });
    res.status(201).json({ success: true, message: "Video saved." });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ success: false, message: "Video already saved." });
    }
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.removeSavedVideo = async (req, res) => {
  try {
    await SavedVideo.findOneAndDelete({
      user: req.user.id,
      videoId: req.params.videoId,
    });
    res.status(200).json({ success: true, message: "Video removed." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// --- NEW FUNCTION for changing the user's password ---
/**
 * @desc    Change user password
 * @route   PUT /api/user/change-password
 * @access  Private
 */
exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Please provide both old and new passwords.",
      });
  }

  if (newPassword.length < 6) {
    return res
      .status(400)
      .json({
        success: false,
        message: "New password must be at least 6 characters long.",
      });
  }

  try {
    // Get user from DB, making sure to include the password field for comparison
    const user = await User.findById(req.user.id).select("+password");

    // Check if the provided old password is correct
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect old password." });
    }

    // Hash the new password before saving
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    logger.info(`Password changed successfully for user: ${user.username}`);
    res
      .status(200)
      .json({ success: true, message: "Password updated successfully." });
  } catch (error) {
    logger.error(
      `Password change error for user ${req.user.id}: ${error.message}`
    );
    res.status(500).json({ success: false, message: "Server error." });
  }
};
