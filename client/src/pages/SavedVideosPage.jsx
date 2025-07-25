import React, { useState, useEffect } from "react";
import * as api from "../api";
import VideoCard from "../components/VideoCard";
import Spinner from "../components/Common/Spinner";
import styles from "./SearchResultsPage.module.css"; // Reuse styles

const SavedVideosPage = () => {
  const [savedVideos, setSavedVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedVideos = async () => {
    setLoading(true);
    try {
      const { data } = await api.getSavedVideos();
      setSavedVideos(data.data);
    } catch (error) {
      console.error("Failed to fetch saved videos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedVideos();
  }, []);

  const handleVideoUnsaved = (unsavedVideoId) => {
    // This function now correctly filters the main state array
    setSavedVideos((currentVideos) =>
      currentVideos.filter((videoItem) => videoItem.videoId !== unsavedVideoId)
    );
  };

  if (loading) return <Spinner />;

  return (
    <div className={styles.pageContainer}>
      <h1 className={`${styles.pageTitle}`}>Saved Videos</h1>
      <div className={styles.gridContainer}>
        {savedVideos.length > 0 ? (
          // --- THIS IS THE CRITICAL FIX ---
          // We now map over the 'savedVideos' array and pass the nested
          // 'videoData' object to the VideoCard component.
          savedVideos.map((savedItem, index) => (
            <VideoCard
              key={savedItem.videoId || index}
              video={savedItem.videoData} // <-- Pass the correct object
              isYouTubeVideo={true}
              isSavedPage={true}
              onUnsave={() => handleVideoUnsaved(savedItem.videoId)}
              index={index}
            />
          ))
        ) : (
          <p>You haven't saved any videos yet.</p>
        )}
      </div>
    </div>
  );
};

export default SavedVideosPage;
