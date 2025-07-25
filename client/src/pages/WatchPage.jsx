import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import * as api from "../api";
import VideoPlayer from "../components/VideoPlayer";
import Spinner from "../components/Common/Spinner";
import styles from "./WatchPage.module.css";

const WatchPage = () => {
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get URL parameters and location
  const { id } = useParams();
  const location = useLocation();

  // Check if the URL indicates this is a YouTube video
  const isYouTubeVideo = location.pathname.startsWith("/watch/yt/");

  useEffect(() => {
    // If it's one of our own videos, fetch its data from our backend
    if (!isYouTubeVideo) {
      const fetchVideo = async () => {
        try {
          setLoading(true);
          const { data } = await api.getVideo(id);
          setVideo(data.data);
        } catch (error) {
          console.error("Failed to fetch video details", error);
        } finally {
          setLoading(false);
        }
      };
      fetchVideo();
    } else {
      // If it's a YouTube video, we don't need to fetch data, just stop the spinner.
      setLoading(false);
    }
  }, [id, isYouTubeVideo]);

  if (loading) return <Spinner />;

  // Render the YouTube Iframe Player
  if (isYouTubeVideo) {
    const youtubeVideoUrl = `https://www.youtube.com/embed/${id}?autoplay=1`;
    return (
      <div className={styles.pageContainer}>
        <div className={styles.playerWrapper}>
          <iframe
            src={youtubeVideoUrl}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ width: "100%", height: "100%" }}
          ></iframe>
        </div>
        {/* You could add another API call here to get the YouTube video's title/description if desired */}
      </div>
    );
  }

  // Render our own video player
  if (!video)
    return (
      <div className={styles.pageContainer}>
        <h1 className="metallic-text">Video not found.</h1>
      </div>
    );

  return (
    <div className={styles.pageContainer}>
      <div className={styles.playerWrapper}>
        <VideoPlayer src={video.filePath} />
      </div>
      <div className={styles.detailsWrapper}>
        <h1 className={`${styles.title} metallic-text`}>{video.title}</h1>
        <div className={styles.metadata}>
          <span>By {video.uploader.username}</span>
          <span>•</span>
          <span>{new Date(video.createdAt).toLocaleDateString()}</span>
          <span>•</span>
          <span>{video.views} views</span>
        </div>
        <p className={styles.description}>{video.description}</p>
      </div>
    </div>
  );
};

export default WatchPage;
