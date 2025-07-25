import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import * as api from "../api";
import VideoCard from "../components/VideoCard";
import Spinner from "../components/Common/Spinner";
import styles from "./ProfilePage.module.css";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const [myVideos, setMyVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    const fetchMyVideos = async () => {
      try {
        setLoading(true);
        // --- THIS IS THE FIX ---
        // We are explicitly calling api.getMyVideos(), which is the
        // secure endpoint that only returns videos for the logged-in user.
        const { data } = await api.getMyVideos();
        setMyVideos(data.data);
      } catch (error) {
        console.error("Failed to fetch your videos:", error);
        toast.error("Could not load your videos.");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchMyVideos();
    }
  }, [user]);

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long.");
      return;
    }
    const loadingToast = toast.loading("Updating password...");
    try {
      const { data } = await api.changePassword(passwordData);
      toast.dismiss(loadingToast);
      toast.success(data.message);
      setPasswordData({ oldPassword: "", newPassword: "" });
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(
        error.response?.data?.message || "Failed to update password."
      );
    }
  };

  if (!user) {
    return (
      <div className={styles.pageContainer}>
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.profileHeader}>
        <div className={styles.avatar}>
          {user.username.charAt(0).toUpperCase()}
        </div>
        <div className={styles.userInfo}>
          <h1 className={styles.username}>{user.username}</h1>
          <p className={styles.email}>{user.email}</p>
        </div>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.contentArea}>
          <h2>Your Uploaded Videos</h2>
          {loading ? (
            <Spinner />
          ) : (
            <div className={styles.gridContainer}>
              {myVideos.length > 0 ? (
                myVideos.map((video) => (
                  <VideoCard
                    key={video._id}
                    video={video}
                    isYouTubeVideo={false}
                  />
                ))
              ) : (
                <p className={styles.emptyMessage}>
                  You haven't uploaded any videos yet.
                </p>
              )}
            </div>
          )}
        </div>

        <div className={styles.contentArea}>
          <h2>Change Password</h2>
          <form onSubmit={handlePasswordSubmit} className={styles.passwordForm}>
            <input
              type="password"
              name="oldPassword"
              placeholder="Old Password"
              value={passwordData.oldPassword}
              onChange={handlePasswordChange}
              required
              className={styles.inputField}
            />
            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              required
              className={styles.inputField}
            />
            <button type="submit" className={styles.submitButton}>
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
