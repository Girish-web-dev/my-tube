import axios from "axios";

// 1. Create an Axios instance with a base URL
// The 'proxy' in package.json will forward requests from '/api' to your backend server.
const API = axios.create({ baseURL: "/api" });

// 2. Use an Interceptor to automatically attach the JWT token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    // If a token exists, add it to the Authorization header for protected routes.
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// ========================================================================
// EXPORTED API FUNCTIONS
// These are the functions your React components will import and call.
// ========================================================================

// --- Authentication ---
export const login = (formData) => API.post("/auth/login", formData);
export const register = (formData) => API.post("/auth/register", formData);

// --- User Profile & Preferences ---
export const updateUserPreferences = (preferences) =>
  API.put("/user/preferences", preferences);
export const changePassword = (passwordData) =>
  API.put("/user/change-password", passwordData);

// --- YouTube API ---
// THIS IS THE CRITICAL UPDATE FOR INFINITE SCROLL:
// These functions now accept a 'pageToken' to fetch the next page of results.
// If no token is provided, it fetches the first page.
export const getYouTubeVideos = (pageToken = "") =>
  API.get(`/youtube/popular?pageToken=${pageToken}`);
export const searchYouTubeVideos = (query, pageToken = "") =>
  API.get(`/youtube/search?q=${query}&pageToken=${pageToken}`);

// --- Your Platform's Videos ---
export const uploadVideo = (formData) =>
  API.post("/videos", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const getVideo = (id) => API.get(`/videos/${id}`);
export const getMyVideos = () => API.get("/videos/my-videos");

// --- Saved Videos ---
export const getSavedVideos = () => API.get("/user/saved-videos");
export const saveVideo = (videoData) =>
  API.post("/user/saved-videos", videoData);
export const unsaveVideo = (videoId) =>
  API.delete(`/user/saved-videos/${videoId}`);


