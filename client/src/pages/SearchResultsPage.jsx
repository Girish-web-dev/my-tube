import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import * as api from "../api";
import VideoCard from "../components/VideoCard";
import Spinner from "../components/Common/Spinner";

// --- THIS IS THE CRITICAL FIX ---
// We are changing the import to use the HomePage stylesheet, which already has the grid styles we need.
import styles from "./HomePage.module.css";
// --- END OF FIX ---

const SearchResultsPage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const query = searchParams.get("search_query");

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const { data } = await api.searchYouTubeVideos(query);

        if (data.data && Array.isArray(data.data.items)) {
          const formattedVideos = data.data.items.map((video) => ({
            ...video,
            id: typeof video.id === "object" ? video.id.videoId : video.id,
          }));
          setVideos(formattedVideos);
        } else {
          setVideos([]);
        }
      } catch (error) {
        console.error("Failed to fetch search results:", error);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query]);

  if (loading) return <Spinner />;

  return (
    // We use the className from the imported HomePage styles
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>
        {" "}
        {/* This will now need a style */}
        Results for: "{query}"
      </h1>
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
          <p>No results found for your search.</p>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;
