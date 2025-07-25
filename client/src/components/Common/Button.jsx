import React from "react";

const buttonStyle = {
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "5px",
  padding: "10px 20px",
  fontSize: "1rem",
  cursor: "pointer",
  margin: "5px",
  transition: "background-color 0.2s",
};

const Button = ({ children, onClick, type = "button", style }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      style={{ ...buttonStyle, ...style }}
      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#0056b3")}
      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#007bff")}
    >
      {children}
    </button>
  );
};

export default Button;
