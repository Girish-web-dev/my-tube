const express = require("express");
const router = express.Router();

// Import all required functions from the controller
const {
  getFeedPreferences,
  updateFeedPreferences,
  getSavedVideos,
  addSavedVideo,
  removeSavedVideo,
  changePassword, // <-- Import the new function
} = require("../controllers/user.controller");

// Import the authentication middleware
const { protect } = require("../middleware/auth.middleware");

// Route for managing feed preferences
router
  .route("/preferences")
  .get(protect, getFeedPreferences)
  .put(protect, updateFeedPreferences);

// Routes for managing saved videos
router
  .route("/saved-videos")
  .get(protect, getSavedVideos)
  .post(protect, addSavedVideo);
router.delete("/saved-videos/:videoId", protect, removeSavedVideo);

// --- NEW ROUTE for changing password ---
router.put("/change-password", protect, changePassword);

module.exports = router;
