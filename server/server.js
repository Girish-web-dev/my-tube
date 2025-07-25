// Load environment variables FIRST.
const dotenv = require("dotenv");
dotenv.config();

// --- DIAGNOSTIC CHECK ---
// This block will run immediately and tell us if the .env file was loaded.
console.log("--- Environment Variables Check ---");
console.log("PORT:", process.env.PORT);
console.log(
  "MONGO_URI:",
  process.env.MONGO_URI ? "Loaded Successfully" : "!!! MISSING !!!"
);
console.log(
  "YOUTUBE_API_KEYS:",
  process.env.YOUTUBE_API_KEYS ? "Loaded Successfully" : "!!! MISSING !!!"
);
console.log("---------------------------------");
// --- END DIAGNOSTIC CHECK ---

const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const logger = require("./utils/logger");

// The rest of the file remains the same...
connectDB();
const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/videos", require("./routes/video.routes"));
app.use("/api/user", require("./routes/user.routes"));
app.use("/api/youtube", require("./routes/youtube.routes.js"));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
