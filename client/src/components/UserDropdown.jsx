import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import styles from "./UserDropdown.module.css";
import { FiUser, FiLogOut, FiUpload } from "react-icons/fi";

const UserDropdown = ({ closeDropdown }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    closeDropdown(); // Close the dropdown first
    logout();
    navigate("/auth"); // Redirect to login page
  };

  if (!user) {
    return null; // Don't render if there's no user
  }

  return (
    <div className={styles.dropdown}>
      <div className={styles.userInfo}>
        <div className={styles.avatar}>
          <span>{user.username.charAt(0).toUpperCase()}</span>
        </div>
        <div className={styles.userDetails}>
          <span className={styles.username}>{user.username}</span>
          <span className={styles.email}>{user.email}</span>
        </div>
      </div>

      <ul className={styles.menu}>
        <li>
          <Link
            to="/profile"
            className={styles.menuItem}
            onClick={closeDropdown}
          >
            <FiUser />
            <span>My Profile</span>
          </Link>
        </li>
        <li>
          <Link
            to="/upload"
            className={styles.menuItem}
            onClick={closeDropdown}
          >
            <FiUpload />
            <span>Upload Video</span>
          </Link>
        </li>
        <li className={styles.separator}></li>
        <li>
          <button
            onClick={handleLogout}
            className={`${styles.menuItem} ${styles.logoutButton}`}
          >
            <FiLogOut />
            <span>Logout</span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default UserDropdown;
