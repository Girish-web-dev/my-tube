import React, { useState, useEffect, useContext, useCallback, useRef } from 'react';
import * as api from '../api';
import VideoCard from '../components/VideoCard';
import { AuthContext } from '../context/AuthContext';
import Spinner from '../components/Common/Spinner';
import PremiumBanner from '../components/PremiumBanner';
import styles from './HomePage.module.css';
import toast from 'react-hot-toast';

const HomePage = () => {
  const [videos, setVideos] = useState([]);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const { user } = useContext(AuthContext);
  const [activeFilter, setActiveFilter] = useState('For You');
 
  const observer = useRef();
 
  const lastVideoElementRef = useCallback(node => {
    if (loading || loadingMore) return; 
    if (observer.current) observer.current.disconnect(); 
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && nextPageToken) {
        loadMoreVideos(); // ...then load more videos!
      }
    });

    if (node) observer.current.observe(node); 
  }, [loading, loadingMore, nextPageToken]);

  const loadMoreVideos = useCallback(async () => {
    if (!nextPageToken || loadingMore) return;
    setLoadingMore(true);
    try {
      let response;
      if (activeFilter === 'For You') {
        response = await api.getYouTubeVideos(nextPageToken);
      } else {
        response = await api.searchYouTubeVideos(activeFilter, nextPageToken);
      }
      
      const newVideoItems = response.data.data.items || [];
      const formattedVideos = newVideoItems.map(video => ({
        ...video,
        id: typeof video.id === 'object' ? video.id.videoId : video.id,
      }));
      
      setVideos(prev => [...prev, ...formattedVideos]); 
      setNextPageToken(response.data.data.nextPageToken); 

    } catch (error) {
      toast.error("Could not load more videos.");
    } finally {
      setLoadingMore(false);
    }
  }, [nextPageToken, loadingMore, activeFilter]);

  useEffect(() => {
    if (!user) return;
    const fetchInitialVideos = async () => {
      setLoading(true);
      setVideos([]); 
      try {
        let response;
        if (activeFilter === 'For You') {
          response = await api.getYouTubeVideos();
        } else {
          response = await api.searchYouTubeVideos(activeFilter);
        }
        
        const videoItems = response.data.data?.items || [];
        const formattedVideos = videoItems.map(video => ({
          ...video,
          id: typeof video.id === 'object' ? video.id.videoId : video.id,
        }));
        setVideos(formattedVideos);
        setNextPageToken(response.data.data.nextPageToken || null);
      } catch (error) {
        toast.error("Could not load videos.");
      } finally {
        setLoading(false);
      }
    };
    fetchInitialVideos();
  }, [user, activeFilter]);


  if (!user) {
    window.location.href = '/auth';
    return <Spinner />;
  }

  return (
    <>
      <PremiumBanner />
      <div className={styles.filterTags}>
        <button className={`${styles.tag} ${activeFilter === 'For You' ? styles.activeTag : ''}`} onClick={() => setActiveFilter('For You')}>For You</button>
        {user?.feedPreferences?.map(interest => (
          <button key={interest} className={`${styles.tag} ${activeFilter === interest ? styles.activeTag : ''}`} onClick={() => setActiveFilter(interest)}>{interest}</button>
        ))}
      </div>
      
      {loading ? (
        <Spinner />
      ) : (
        <div className={styles.gridContainer}>
          {videos.map((video, index) => {
            // If this is the last video in the current list, attach our special ref to it
            if (videos.length === index + 1) {
              return <div ref={lastVideoElementRef} key={video.id}><VideoCard video={video} isYouTubeVideo={true} index={index} /></div>
            } else {
              return <VideoCard key={video.id} video={video} isYouTubeVideo={true} index={index} />
            }
          })}
        </div>
      )}
      {loadingMore && <Spinner />}
      {!loading && !nextPageToken && videos.length > 0 && <p className={styles.endMessage}>You've reached the end!</p>}
      {!loading && videos.length === 0 && <p className={styles.emptyMessage}>No videos found for "{activeFilter}".</p>}
    </>
  );
};

export default HomePage;
