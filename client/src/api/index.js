import axios from "axios";

const API = axios.create({ baseURL: "/api" });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    // If a token exists, add it to the Authorization header for protected routes.
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const login = (formData) => API.post("/auth/login", formData);
export const register = (formData) => API.post("/auth/register", formData);

export const updateUserPreferences = (preferences) =>
  API.put("/user/preferences", preferences);
export const changePassword = (passwordData) =>
  API.put("/user/change-password", passwordData);

export const getYouTubeVideos = (pageToken = "") =>
  API.get(`/youtube/popular?pageToken=${pageToken}`);
export const searchYouTubeVideos = (query, pageToken = "") =>
  API.get(
    `/youtube/search?q=${encodeURIComponent(query)}&pageToken=${pageToken}`
  );

export const uploadVideo = (formData) =>
  API.post("/videos", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const getVideo = (id) => API.get(`/videos/${id}`);
export const getMyVideos = () => API.get("/videos/my-videos");

export const getSavedVideos = () => API.get("/user/saved-videos");
export const saveVideo = (videoData) =>
  API.post("/user/saved-videos", videoData);
export const unsaveVideo = (videoId) =>
  API.delete(`/user/saved-videos/${videoId}`);
