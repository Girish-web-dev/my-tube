import React, { useState, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import styles from "./Header.module.css";
import { FiSearch, FiSun, FiUser } from "react-icons/fi";
import UserDropdown from "../UserDropdown"; // Import the new dropdown component

const Header = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // NEW: State to control dropdown visibility
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // NEW: Ref for detecting clicks outside the dropdown
  const dropdownRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/results?search_query=${searchQuery}`);
      setSearchQuery("");
    }
  };

  // NEW: Function to close the dropdown if a click is detected outside of it
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
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
        <button className={styles.actionButton}>
          <FiSun />
        </button>

        {/* THE FIX: The user icon is now a button that opens the dropdown */}
        {user ? (
          <div className={styles.profileContainer} ref={dropdownRef}>
            <button
              className={styles.actionButton}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <FiUser />
            </button>
            {isDropdownOpen && (
              <UserDropdown closeDropdown={() => setIsDropdownOpen(false)} />
            )}
          </div>
        ) : (
          // Optionally, show a login button if no user is found
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
