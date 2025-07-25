const express = require("express");
const router = express.Router();

// --- THIS IS THE FIX ---
// We destructure BOTH functions from the controller file.
const {
  getPopularVideos,
  searchVideos,
} = require("../controllers/youtube.controller");
const { protect } = require("../middleware/auth.middleware");

// Route to get a personalized or popular feed.
// The 'protect' middleware gives this route access to the logged-in user.
router.get("/popular", protect, getPopularVideos);

// Route for handling video searches.
// This now correctly references the 'searchVideos' function we imported.
router.get("/search", searchVideos);

module.exports = router;
