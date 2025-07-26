import React from "react";
import { Link } from "react-router-dom";
import styles from "./VideoCard.module.css";
import { FiBookmark, FiTrash2 } from "react-icons/fi";
import * as api from "../api";
import toast from "react-hot-toast";

const VideoCard = ({
  video,
  isYouTubeVideo = false,
  index,
  isSavedPage = false,
  onUnsave,
}) => {
  if (!video || !video.id) {
    return null;
  }

  const formatViews = (views) => {
    if (!views) return "0";
    const num = Number(views);
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const handleSaveVideo = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const videoToSave = { videoId: video.id, videoData: video };
    api
      .saveVideo(videoToSave)
      .then(() => toast.success("Video saved!"))
      .catch((err) =>
        toast.error(err.response?.data?.message || "Could not save video.")
      );
  };

  const handleUnsaveVideo = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const loadingToast = toast.loading("Removing video...");
    try {
      await api.unsaveVideo(video.id);
      toast.dismiss(loadingToast);
      toast.success("Video removed.");
      if (onUnsave) onUnsave(video.id);
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Could not remove video.");
    }
  };

  let videoData = {};
  if (isYouTubeVideo) {
    videoData = {
      url: `/watch/yt/${video.id}`,
      thumbnailUrl: video.snippet?.thumbnails?.high?.url || "",
      title: video.snippet?.title || "Untitled Video",
      channel: video.snippet?.channelTitle || "Unknown Channel",
      views: formatViews(video.statistics?.viewCount),
    };
  } else {
    const serverUrl = "http://localhost:5001";
    videoData = {
      url: `/watch/${video._id}`,
      thumbnailUrl: `${serverUrl}/${video.thumbnailPath}`,
      title: video.title,
      channel: video.uploader?.username || "Unknown Uploader",
      views: formatViews(video.views),
    };
  }

  if (!videoData.thumbnailUrl) {
    return null;
  }

  return (
    <Link to={videoData.url} className={styles.cardLink}>
      <div className={styles.thumbnailWrapper}>
        <img
          src={videoData.thumbnailUrl}
          alt={videoData.title}
          className={styles.thumbnail}
        />
        {isSavedPage ? (
          <button
            onClick={handleUnsaveVideo}
            className={`${styles.actionButton} ${styles.unsaveButton}`}
          >
            <FiTrash2 />
          </button>
        ) : isYouTubeVideo ? (
          <button onClick={handleSaveVideo} className={styles.actionButton}>
            <FiBookmark />
          </button>
        ) : null}
      </div>
      <div className={styles.info}>
        <h3 className={styles.title}>{videoData.title}</h3>
        <div className={styles.metadata}>
          <span>{videoData.channel}</span>
          <span>•</span>
          <span>{videoData.views} views</span>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
