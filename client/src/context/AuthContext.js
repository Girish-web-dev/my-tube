import React, { createContext, useState } from "react";
import * as api from "../api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  // --- THIS IS THE NEW, SECURE LOGIN FUNCTION ---
  const login = async (formData) => {
    try {
      // 1. Attempt to log in via the API.
      // If credentials are bad, this 'await' will throw an error and execution will jump to the 'catch' block.
      const { data } = await api.login(formData);

      // 2. This code ONLY runs if the API call was successful.
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      setUser(data.user);
      setToken(data.token);

      // 3. Return success. This is important for the AuthPage logic.
      return Promise.resolve();
    } catch (error) {
      // 4. If any error occurs (e.g., 401 Unauthorized), we explicitly clear any old state and re-throw the error.
      logout(); // Ensure user state is cleared on failed login
      return Promise.reject(error); // Pass the error back to the component that called it.
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  const updateUser = (updatedUserData) => {
    const newUser = { ...user, ...updatedUserData };
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
