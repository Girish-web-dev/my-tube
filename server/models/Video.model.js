const mongoose = require("mongoose");

const VideoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please add a title"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
  },
  filePath: {
    type: String,
    required: true,
  },
  thumbnailPath: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  uploader: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Video", VideoSchema);
