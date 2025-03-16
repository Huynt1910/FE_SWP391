import { getCookie, setCookie, deleteCookie } from "cookies-next";
import { showToast } from "./toast";

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = getCookie("token");
  return !!token;
};

// Get the authentication token
export const getToken = () => {
  return getCookie("token");
};

// Get the user role
export const getUserRole = () => {
  return getCookie("userRole") || "customer";
};

// Set authentication data
export const setAuthData = (token, userRole = "customer") => {
  // Set cookies with a reasonable expiration (e.g., 7 days)
  const options = { maxAge: 60 * 60 * 24 * 7 }; // 7 days
  setCookie("token", token, options);
  setCookie("userRole", userRole, options);
};

// Clear authentication data
export const clearAuthData = () => {
  deleteCookie("token");
  deleteCookie("userRole");
};

// Handle login redirect
export const redirectToLogin = (message = "Please log in to continue") => {
  clearAuthData();
  if (typeof window !== "undefined") {
    showToast.error(message);
    window.location.href = "/login";
  }
};

// Handle authentication errors
export const handleAuthError = (error) => {
  console.error("Authentication error:", error);
  
  if (error?.message?.includes("Unauthenticated") || 
      error?.message?.includes("Authentication required") ||
      error?.response?.status === 401) {
    redirectToLogin("Your session has expired. Please log in again.");
    return true;
  }
  
  return false;
}; 