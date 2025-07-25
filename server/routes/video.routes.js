const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware");

// --- THE FIX: Import the new getMyVideos function ---
const {
  uploadVideo,
  getVideos,
  getVideoById,
  getMyVideos,
} = require("../controllers/video.controller");

// This route handles getting all videos (not used by us) and uploading a new one
router.route("/").get(getVideos).post(protect, uploadVideo);

// --- THE FIX: Add the new route for fetching a user's own videos ---
router.get("/my-videos", protect, getMyVideos);

// This route handles getting a single video by its ID
router.route("/:id").get(getVideoById);

module.exports = router;
