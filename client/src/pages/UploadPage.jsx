import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as api from "../api";
import styles from "./UploadPage.module.css";
import { FiFile, FiImage } from "react-icons/fi";

const UploadPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
  });
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile || !thumbnailFile) {
      alert("Please select both a video and a thumbnail file.");
      return;
    }
    setIsUploading(true);
    const uploadData = new FormData();
    uploadData.append("title", formData.title);
    uploadData.append("description", formData.description);
    uploadData.append("tags", formData.tags);
    uploadData.append("videoFile", videoFile);
    uploadData.append("thumbnailFile", thumbnailFile);

    try {
      await api.uploadVideo(uploadData);
      alert("Video uploaded successfully!");
      navigate("/");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formContainer}>
        <h1 className={`${styles.title} metallic-text`}>Upload Your Video</h1>
        <p className={styles.subtitle}>Share your creation with the world.</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            name="title"
            placeholder="Title"
            onChange={handleChange}
            required
            className={styles.inputField}
          />
          <textarea
            name="description"
            placeholder="Description"
            onChange={handleChange}
            required
            className={styles.inputField}
            rows="4"
          />
          <input
            type="text"
            name="tags"
            placeholder="Tags (comma-separated, e.g., tech,react,dev)"
            onChange={handleChange}
            className={styles.inputField}
          />

          <label className={styles.fileLabel}>
            <FiFile />
            <span>{videoFile ? videoFile.name : "Select Video File"}</span>
            <input
              type="file"
              name="videoFile"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files[0])}
              required
            />
          </label>

          <label className={styles.fileLabel}>
            <FiImage />
            <span>
              {thumbnailFile ? thumbnailFile.name : "Select Thumbnail Image"}
            </span>
            <input
              type="file"
              name="thumbnailFile"
              accept="image/*"
              onChange={(e) => setThumbnailFile(e.target.files[0])}
              required
            />
          </label>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Publish Video"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadPage;
