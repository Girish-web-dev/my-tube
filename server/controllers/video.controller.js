const Video = require("../models/Video.model");
const multer = require("multer");
const path = require("path");
const logger = require("../utils/logger");

// Multer storage configuration for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/uploads/"),
  filename: (req, file, cb) =>
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    ),
});

const upload = multer({ storage }).fields([
  { name: "videoFile" },
  { name: "thumbnailFile" },
]);

// --- Controller Functions ---

// Handles video uploads
exports.uploadVideo = (req, res) => {
  upload(req, res, async (err) => {
    if (err)
      return res
        .status(400)
        .json({ success: false, message: `File Upload Error: ${err.message}` });
    if (!req.files.videoFile || !req.files.thumbnailFile)
      return res
        .status(400)
        .json({
          success: false,
          message: "Please upload both a video and a thumbnail file.",
        });

    const { title, description, tags } = req.body;
    const videoPath = req.files.videoFile[0].path
      .replace(/\\/g, "/")
      .split("public/")[1];
    const thumbnailPath = req.files.thumbnailFile[0].path
      .replace(/\\/g, "/")
      .split("public/")[1];

    const video = new Video({
      title,
      description,
      filePath: videoPath,
      thumbnailPath,
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
      uploader: req.user.id,
    });

    try {
      await video.save();
      logger.info(`Video uploaded by ${req.user.username}: ${video.title}`);
      res.status(201).json({ success: true, data: video });
    } catch (error) {
      logger.error(`DB save error: ${error.message}`);
      res
        .status(500)
        .json({ success: false, message: "Server error while saving video." });
    }
  });
};

// Gets a single video by its ID
exports.getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id).populate(
      "uploader",
      "username"
    );
    if (!video)
      return res
        .status(404)
        .json({ success: false, message: "Video not found" });
    video.views += 1;
    await video.save();
    res.status(200).json({ success: true, data: video });
  } catch (error) {
    logger.error(`Get video by ID error: ${error.message}`);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// --- THIS IS THE GUARANTEED SECURE FUNCTION ---
// It ONLY finds videos where the 'uploader' field matches the ID from the user's secure token.
// It is impossible for this function to return another user's videos.
exports.getMyVideos = async (req, res) => {
  try {
    const videos = await Video.find({ uploader: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, count: videos.length, data: videos });
  } catch (error) {
    logger.error(
      `Get my videos error for user ${req.user.id}: ${error.message}`
    );
    res
      .status(500)
      .json({ success: false, message: "Server error while fetching videos." });
  }
};

// This function is not used but is here for completeness.
exports.getVideos = async (req, res) => {
  try {
    const videos = await Video.find()
      .populate("uploader", "username")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: videos.length, data: videos });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
