import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from "react";
import * as api from "../api";
import VideoCard from "../components/VideoCard";
import { AuthContext } from "../context/AuthContext";
import Spinner from "../components/Common/Spinner";
import styles from "./SearchResultsPage.module.css"; // Reuse styles for consistency
import toast from "react-hot-toast";

const TrendingPage = () => {
  const [videos, setVideos] = useState([]);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const { user } = useContext(AuthContext);

  const observer = useRef();
  const lastVideoElementRef = useCallback(
    (node) => {
      if (loading || loadingMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && nextPageToken) {
          loadMoreVideos(); // ...then load more videos!
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, loadingMore, nextPageToken]
  );
  const loadMoreVideos = useCallback(async () => {
    if (!nextPageToken || loadingMore) return;
    setLoadingMore(true);
    try {
      const { data } = await api.getYouTubeVideos(nextPageToken);

      const newVideoItems = data.data.items || [];
      const formattedVideos = newVideoItems.map((video) => ({
        ...video,
        id: typeof video.id === "object" ? video.id.videoId : video.id,
      }));

      setVideos((prev) => [...prev, ...formattedVideos]); 
      setNextPageToken(data.data.nextPageToken); 
    } catch (error) {
      toast.error("Could not load more trending videos.");
    } finally {
      setLoadingMore(false);
    }
  }, [nextPageToken, loadingMore]);
  useEffect(() => {
    if (user) {
      const fetchInitialTrending = async () => {
        setLoading(true);
        try {
          const { data } = await api.getYouTubeVideos();

          const videoItems = data.data?.items || [];
          const formattedVideos = videoItems.map((video) => ({
            ...video,
            id: typeof video.id === "object" ? video.id.videoId : video.id,
          }));
          setVideos(formattedVideos);
          setNextPageToken(data.data.nextPageToken || null);
        } catch (error) {
          toast.error("Could not load trending videos.");
        } finally {
          setLoading(false);
        }
      };
      fetchInitialTrending();
    }
  }, [user]);
  if (!user && !loading) {
    window.location.href = "/auth";
    return <Spinner />;
  }

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Trending Videos</h1>

      {loading ? (
        <Spinner />
      ) : (
        <div className={styles.gridContainer}>
          {videos.map((video, index) => {
            // If this is the last video, attach our special ref to it
            if (videos.length === index + 1) {
              return (
                <div ref={lastVideoElementRef} key={video.id}>
                  <VideoCard
                    video={video}
                    isYouTubeVideo={true}
                    index={index}
                  />
                </div>
              );
            } else {
              return (
                <VideoCard
                  key={video.id}
                  video={video}
                  isYouTubeVideo={true}
                  index={index}
                />
              );
            }
          })}
        </div>
      )}

      {loadingMore && <Spinner />}
      {!loading && !nextPageToken && videos.length > 0 && (
        <p className={styles.endMessage}>
          You've reached the end of the trending list!
        </p>
      )}
      {!loading && videos.length === 0 && (
        <p>Could not load trending videos at this time.</p>
      )}
    </div>
  );
};

export default TrendingPage;
