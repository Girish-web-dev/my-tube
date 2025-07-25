const mongoose = require("mongoose");

const SavedVideoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  videoId: {
    // This will be the YouTube video ID string
    type: String,
    required: true,
  },
  videoData: {
    // We store the video info so we don't have to re-fetch it
    type: Object,
    required: true,
  },
  savedAt: {
    type: Date,
    default: Date.now,
  },
});

// Prevent a user from saving the same video twice
SavedVideoSchema.index({ user: 1, videoId: 1 }, { unique: true });

module.exports = mongoose.model("SavedVideo", SavedVideoSchema);
