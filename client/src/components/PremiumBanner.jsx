import React, { useState } from "react";
import styles from "./PremiumBanner.module.css";
import { FiStar, FiX } from "react-icons/fi";

const PremiumBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null; // Don't render anything if dismissed
  }

  return (
    <div className={styles.banner}>
      <div className={styles.iconWrapper}>
        <FiStar />
      </div>
      <div className={styles.content}>
        <h3>Premium Content Available</h3>
        <p>Unlock exclusive videos and features.</p>
      </div>
      <button
        className={styles.dismissButton}
        onClick={() => setIsVisible(false)}
      >
        <FiX />
        <span>Dismiss</span>
      </button>
    </div>
  );
};

export default PremiumBanner;
