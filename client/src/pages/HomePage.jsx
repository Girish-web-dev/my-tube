import React, { useState, useEffect, useContext } from "react";
import * as api from "../api";
import VideoCard from "../components/VideoCard";
import { AuthContext } from "../context/AuthContext";
import Spinner from "../components/Common/Spinner";
import PremiumBanner from "../components/PremiumBanner";
import styles from "./HomePage.module.css";
import toast from "react-hot-toast";

const HomePage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const [activeFilter, setActiveFilter] = useState("For You");

  useEffect(() => {
    if (!user) {
      window.location.href = "/auth";
      return;
    }

    const fetchVideos = async () => {
      setLoading(true);
      try {
        let response;
        if (activeFilter === "For You") {
          response = await api.getYouTubeVideos();
        } else {
          response = await api.searchYouTubeVideos(activeFilter);
        }
        if (response.data && Array.isArray(response.data.data)) {
          const formattedVideos = response.data.data.map((video) => ({
            ...video,
            id: typeof video.id === "object" ? video.id.videoId : video.id,
          }));
          setVideos(formattedVideos);
        } else {
          setVideos([]);
        }
      } catch (error) {
        console.error("Failed to fetch videos:", error);
        toast.error("Could not load videos.");
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [user, activeFilter]);

  if (!user) {
    return <Spinner />;
  }

  return (
    <>
      <PremiumBanner />
      <div className={styles.filterTags}>
        <button
          className={`${styles.tag} ${
            activeFilter === "For You" ? styles.activeTag : ""
          }`}
          onClick={() => setActiveFilter("For You")}
        >
          {" "}
          For You{" "}
        </button>
        {user?.feedPreferences?.map((interest) => (
          <button
            key={interest}
            className={`${styles.tag} ${
              activeFilter === interest ? styles.activeTag : ""
            }`}
            onClick={() => setActiveFilter(interest)}
          >
            {" "}
            {interest}{" "}
          </button>
        ))}
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <div className={styles.gridContainer}>
          {videos && videos.length > 0 ? (
            videos.map((video, index) => (
              <VideoCard
                key={video.id || index}
                video={video}
                index={index}
                isYouTubeVideo={true}
              />
            ))
          ) : (
            <p>No videos found.</p>
          )}
        </div>
      )}
    </>
  );
};

export default HomePage;
