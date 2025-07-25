// client/src/components/VideoPlayer.jsx
import React from 'react';

const VideoPlayer = ({ src }) => {
  if (!src) return <div>Loading video...</div>;

  // The server is at localhost:5001
  const serverUrl = 'http://localhost:5001';
  // The path from the database is now 'uploads/video-123.mp4'
  const videoUrl = `${serverUrl}/${src}`;

  return (
    <video controls autoPlay style={{ width: '100%', maxHeight: '70vh', backgroundColor: '#000' }}>
      <source src={videoUrl} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

export default VideoPlayer;