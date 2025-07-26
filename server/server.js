const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, './.env') });
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const logger = require('./utils/logger');

console.log('--- Environment Variables Check ---');
console.log('PORT:', process.env.PORT);
console.log('MONGO_URI:', process.env.MONGO_URI ? 'Loaded Successfully' : '!!! MISSING !!!');
console.log('YOUTUBE_API_KEYS:', process.env.YOUTUBE_API_KEYS ? 'Loaded Successfully' : '!!! MISSING !!!');
console.log('---------------------------------');

connectDB();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/videos', require('./routes/video.routes'));
app.use('/api/user', require('./routes/user.routes'));
app.use('/api/youtube', require('./routes/youtube.routes.js'));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
