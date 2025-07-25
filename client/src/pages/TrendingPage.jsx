import React, { useState, useEffect, useContext } from "react";
import * as api from "../api";
import VideoCard from "../components/VideoCard";
import { AuthContext } from "../context/AuthContext";
import Spinner from "../components/Common/Spinner";
import styles from "./SearchResultsPage.module.css"; // Reuse styles for consistency

const TrendingPage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      const fetchTrendingVideos = async () => {
        try {
          setLoading(true);
          const { data } = await api.getYouTubeVideos();

          // --- THIS IS THE CRITICAL FIX ---
          // We now access the 'items' array inside the response data object.
          if (data.data && Array.isArray(data.data.items)) {
            const formattedVideos = data.data.items.map((video) => ({
              ...video,
              id: typeof video.id === "object" ? video.id.videoId : video.id,
            }));
            setVideos(formattedVideos);
          } else {
            setVideos([]);
          }
          // --- END OF FIX ---
        } catch (error) {
          console.error("Failed to fetch trending videos:", error);
          setVideos([]);
        } finally {
          setLoading(false);
        }
      };
      fetchTrendingVideos();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) return <Spinner />;

  return (
    <div className={styles.pageContainer}>
      <h1 className={`${styles.pageTitle}`}>Trending Videos</h1>
      <div className={styles.gridContainer}>
        {videos.length > 0 ? (
          videos.map((video, index) => (
            <VideoCard
              key={video.id || index}
              video={video}
              isYouTubeVideo={true}
              index={index}
            />
          ))
        ) : (
          <p>Could not load trending videos at this time.</p>
        )}
      </div>
    </div>
  );
};

export default TrendingPage;
