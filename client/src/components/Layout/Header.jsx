import React, { useState, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ThemeContext } from "../../context/ThemeContext"; // Import the new ThemeContext
import styles from "./Header.module.css";
import { FiSearch, FiSun, FiMoon, FiUser } from "react-icons/fi"; // Import the FiMoon icon
import UserDropdown from "../UserDropdown";

const Header = () => {
  const { user } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext); // Use the new context
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/results?search_query=${searchQuery}`);
      setSearchQuery("");
    }
  };

  // Effect to close the dropdown if a click is detected outside of it
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <header className={styles.header}>
      <form onSubmit={handleSearch} className={styles.searchContainer}>
        <FiSearch className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search videos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
      </form>

      <div className={styles.userActions}>
        {/* --- THIS IS THE FUNCTIONAL THEME TOGGLE BUTTON --- */}
        <button
          className={styles.actionButton}
          onClick={toggleTheme}
          title="Toggle Theme"
        >
          {/* It conditionally renders the correct icon based on the current theme */}
          {theme === "light" ? <FiMoon /> : <FiSun />}
        </button>
        {/* --- END OF THEME TOGGLE --- */}

        {/* This is the user profile dropdown logic */}
        {user ? (
          <div className={styles.profileContainer} ref={dropdownRef}>
            <button
              className={styles.actionButton}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              title="Profile"
            >
              <FiUser />
            </button>
            {isDropdownOpen && (
              <UserDropdown closeDropdown={() => setIsDropdownOpen(false)} />
            )}
          </div>
        ) : (
          <button
            className={styles.loginButton}
            onClick={() => navigate("/auth")}
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
