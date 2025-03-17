import { getCookie, setCookie, deleteCookie } from "cookies-next";
import { showToast } from "./toast";
import { API_URL } from '@/lib/api-client/constant';
import Router from 'next/router';

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getToken();
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
    
    // Store the current URL to redirect back after login
    const currentPath = window.location.pathname + window.location.search;
    if (currentPath !== '/login') {
      sessionStorage.setItem('redirectAfterLogin', currentPath);
    }
    
    Router.push({
      pathname: '/login',
      query: message ? { message } : undefined
    });
  }
};

// Handle authentication errors
export const handleAuthError = (error) => {
  console.error("Authentication error:", error);
  
  // Check for various authentication error patterns
  const isAuthError = 
    error?.message?.includes("Unauthenticated") || 
    error?.message?.includes("Authentication required") ||
    error?.message?.includes("expired") ||
    error?.message?.includes("unauthorized") ||
    error?.response?.status === 401 ||
    error?.status === 401;
  
  if (isAuthError) {
    // Don't redirect immediately for API calls in components that handle session expiration
    if (error.preventRedirect) {
      return true;
    }
    
    redirectToLogin("Your session has expired. Please log in again.");
    return true;
  }
  
  return false;
};

// Set token in cookies
export const setToken = (token) => {
  setCookie('token', token);
};

// Remove token from cookies
export const removeToken = () => {
  deleteCookie('token');
};

// Parse JWT token to get payload
export const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

// Check if token is expired
export const isTokenExpired = (token) => {
  if (!token) return true;
  
  const decodedToken = parseJwt(token);
  if (!decodedToken) return true;
  
  // Check if exp exists and is in the past
  return decodedToken.exp && decodedToken.exp * 1000 < Date.now();
};

// Refresh token
export const refreshToken = async () => {
  try {
    const response = await fetch(`${API_URL}/authentication/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }
    
    const data = await response.json();
    
    if (data && data.token) {
      setToken(data.token);
      return data.token;
    } else {
      throw new Error('No token in refresh response');
    }
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
}; 