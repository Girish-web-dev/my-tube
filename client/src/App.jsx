import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Sidebar from "./components/Layout/Sidebar";
import Header from "./components/Layout/Header";
import HomePage from "./pages/HomePage";
import WatchPage from "./pages/WatchPage";
import AuthPage from "./pages/AuthPage";
import UploadPage from "./pages/UploadPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import InterestsPage from "./pages/InterestsPage";
import SavedVideosPage from "./pages/SavedVideosPage";
import TrendingPage from "./pages/TrendingPage";
import ProfilePage from "./pages/ProfilePage";
import "./App.css";

const MainLayout = ({ children }) => (
  <div className="app-container">
    <Sidebar />
    <div className="main-content">
      <Header />
      <div className="page-wrapper">{children}</div>
    </div>
  </div>
);

const AppContent = () => {
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/auth" || location.pathname === "/interests";

  return (
    <>
      <Routes future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        {isAuthPage ? (
          <>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/interests" element={<InterestsPage />} />
          </>
        ) : (
          <Route
            path="/*"
            element={
              <MainLayout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/trending" element={<TrendingPage />} />
                  <Route path="/saved" element={<SavedVideosPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/results" element={<SearchResultsPage />} />
                  <Route path="/watch/yt/:id" element={<WatchPage />} />
                  <Route path="/watch/:id" element={<WatchPage />} />
                  <Route path="/upload" element={<UploadPage />} />
                </Routes>
              </MainLayout>
            }
          />
        )}
      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{ style: { background: "#333", color: "#fff" } }}
      />
      <AppContent />
    </Router>
  );
}

export default App;
