import React from "react";

const footerStyle = {
  backgroundColor: "#333",
  color: "white",
  textAlign: "center",
  padding: "20px",
  marginTop: "auto", // Pushes footer to the bottom
};

const Footer = () => {
  return (
    <footer style={footerStyle}>
      <p>
        © {new Date().getFullYear()} Your Video Platform. All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
