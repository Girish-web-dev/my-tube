import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import * as api from "../api";
import { AuthContext } from "../context/AuthContext";
import styles from "./InterestsPage.module.css";
import { FiPlus, FiX } from "react-icons/fi";
import toast from "react-hot-toast"; // Import the toast library

const InterestsPage = () => {
  const [currentInterest, setCurrentInterest] = useState("");
  const [interests, setInterests] = useState([]);
  const [isFinishing, setIsFinishing] = useState(false);
  const navigate = useNavigate();
  const { updateUser } = useContext(AuthContext); // Get the updateUser function from context

  const handleAddInterest = () => {
    const trimmedInterest = currentInterest.trim();

    // Validation checks
    if (!trimmedInterest) return;
    if (interests.length >= 5) {
      toast.error("You can add a maximum of 5 interests.");
      return;
    }
    if (
      interests
        .map((i) => i.toLowerCase())
        .includes(trimmedInterest.toLowerCase())
    ) {
      toast.error("You've already added this interest.");
      return;
    }

    setInterests([...interests, trimmedInterest]);
    setCurrentInterest(""); // Clear the input field after adding
  };

  const handleRemoveInterest = (interestToRemove) => {
    setInterests(interests.filter((interest) => interest !== interestToRemove));
  };

  const handleFinish = async () => {
    if (interests.length === 0) {
      toast.error("Please add at least one interest to continue.");
      return;
    }

    setIsFinishing(true);
    const loadingToast = toast.loading("Saving your preferences...");

    try {
      // Call the backend API to save the preferences to the database
      await api.updateUserPreferences({ preferences: interests });

      // --- THIS IS THE CRITICAL FIX ---
      // After saving to the backend, update the frontend state immediately
      // so the sidebar and homepage update without needing a refresh.
      updateUser({ feedPreferences: interests });

      toast.dismiss(loadingToast);
      toast.success("Preferences saved! Welcome.");
      navigate("/"); // Navigate to the personalized homepage
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Could not save your preferences. Please try again.");
      console.error("Failed to save interests:", error);
    } finally {
      setIsFinishing(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        <h1 className={styles.title}>What are your interests?</h1>
        <p className={styles.subtitle}>
          Select up to 5 topics to personalize your feed.
        </p>

        <div className={styles.inputWrapper}>
          <input
            type="text"
            placeholder="e.g., Gaming, AI, Vlogs..."
            value={currentInterest}
            onChange={(e) => setCurrentInterest(e.target.value)}
            className={styles.interestInput}
            // Allow adding with the "Enter" key for better UX
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddInterest();
            }}
          />
          <button
            onClick={handleAddInterest}
            className={styles.addButton}
            disabled={interests.length >= 5 || !currentInterest.trim()}
          >
            <FiPlus />
          </button>
        </div>

        <div className={styles.interestsList}>
          {interests.map((interest, index) => (
            <div key={index} className={styles.interestTag}>
              <span>{interest}</span>
              <FiX
                className={styles.removeTagIcon}
                onClick={() => handleRemoveInterest(interest)}
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleFinish}
          className={styles.finishButton}
          disabled={interests.length === 0 || isFinishing}
        >
          {isFinishing ? "Saving..." : "Finish & See My Feed"}
        </button>
      </div>
    </div>
  );
};

export default InterestsPage;
