// Load environment variables FIRST.
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const logger = require('./utils/logger');

connectDB();
const app = express();
app.use(cors());
app.use(express.json());

// Serve static files for user uploads (thumbnails, etc.)
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// --- API Routes ---
// All your backend routes will be prefixed with /api
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/videos', require('./routes/video.routes'));
app.use('/api/user', require('./routes/user.routes'));
app.use('/api/youtube', require('./routes/youtube.routes.js'));

// --- THIS IS THE CRITICAL PRODUCTION CHANGE ---
// Check if we are in production
if (process.env.NODE_ENV === 'production') {
  // Serve the static files from the React app's build folder
  app.use(express.static(path.join(__dirname, '../client/build')));

  // For any request that doesn't match an API route, send back the React app's index.html file.
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });
}
// --- END OF CHANGE ---

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
