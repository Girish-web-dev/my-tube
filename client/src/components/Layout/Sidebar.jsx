import React, { useContext } from "react";
import { NavLink, useLocation } from "react-router-dom"; // Import useLocation
import { AuthContext } from "../../context/AuthContext";
import styles from "./Sidebar.module.css";
import {
  FiHome,
  FiTrendingUp,
  FiHeart,
  FiBookmark,
  FiPlusCircle,
} from "react-icons/fi";

const Logo = () => (
  <div className={styles.logoContainer}>
    <div className={styles.logoIcon}>
      <div className={styles.logoInnerCircle}></div>
    </div>
    <span>Vidara</span>
  </div>
);

const Sidebar = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation(); // Get the current URL location

  return (
    <aside className={styles.sidebar}>
      <Logo />
      <nav className={styles.nav}>
        <h3 className={styles.navHeader}>Menu</h3>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
          }
        >
          <FiHome />
          <span>Home</span>
        </NavLink>
        <NavLink
          to="/trending"
          className={({ isActive }) =>
            isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
          }
        >
          <FiTrendingUp />
          <span>Trending</span>
        </NavLink>
        <NavLink
          to="/saved"
          className={({ isActive }) =>
            isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
          }
        >
          <FiBookmark />
          <span>Saved Videos</span>
        </NavLink>

        {user && user.feedPreferences && user.feedPreferences.length > 0 && (
          <>
            <h3 className={styles.navHeader}>Your Interests</h3>
            {user.feedPreferences.map((interest) => {
              // --- THIS IS THE CRITICAL FIX for the active link style ---
              // We create the search URL for this interest
              const toUrl = `/results?search_query=${interest}`;
              // We check if the current browser URL matches this interest's URL
              const isActive = location.pathname + location.search === toUrl;

              return (
                <NavLink
                  key={interest}
                  to={toUrl}
                  className={
                    isActive
                      ? `${styles.navLink} ${styles.active}`
                      : styles.navLink
                  }
                >
                  <FiHeart />
                  <span className={styles.interestText}>{interest}</span>
                </NavLink>
              );
            })}
          </>
        )}

        <div className={styles.spacer}></div>

        <NavLink
          to="/interests"
          className={`${styles.navLink} ${styles.editInterests}`}
        >
          <FiPlusCircle />
          <span>Edit Interests</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
