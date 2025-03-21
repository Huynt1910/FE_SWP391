import { getCookie } from "cookies-next";
import { API_URL, END_POINTS, ACTIONS } from "./constant";
import { getToken, handleAuthError, redirectToLogin } from "@/utils/auth";

export class APIClient {
  static async request(url, method, data, headers, query, options = {}) {
    try {
      const queryParams = new URLSearchParams(query || {}).toString();
      const requestOptions = {
        method,
        headers: Object.assign(
          {
            "Content-Type": "application/json",
          },
          headers
        ),
        body: data ? JSON.stringify(data) : undefined,
      };

      const fullUrl = `${url}${queryParams ? `?${queryParams}` : ""}`;
      console.log("API Request:", { url: fullUrl, method, data });

      let response;
      try {
        response = await fetch(fullUrl, requestOptions);
      } catch (networkError) {
        console.error("Network error:", networkError);
        
        // For public access endpoints, return empty data on network error
        if (options.publicAccess) {
          console.log("Public access endpoint returning empty data for network error");
          return { success: true, result: [] };
        }
        
        throw new Error("Network error: Please check your internet connection");
      }
      
      // Log response status
      console.log("API Response status:", response.status, response.statusText);
      
      // Handle API response
      const handleResponse = async (response, options = {}) => {
        // Check if response is OK (status in the range 200-299)
        if (response.ok) {
          try {
            const data = await response.json();
            return data;
          } catch (error) {
            console.error("Error parsing JSON response:", error);
            return { success: false, message: "Invalid response format" };
          }
        }

        // Handle specific error status codes
        if (response.status === 401) {
          console.error("Authentication error (401):", response.statusText);
          
          // If this endpoint doesn't require authentication, return empty data instead of error
          if (options.requiresAuth === false) {
            console.log("Non-authenticated endpoint received 401, returning empty data");
            return { success: false, message: "Authentication required", result: [] };
          }
          
          // For endpoints that do require auth, handle normally
          if (!options.preventRedirect) {
            // Redirect to login page if not prevented
            if (typeof window !== "undefined") {
              window.location.href = "/login";
            }
          }
          
          return { 
            success: false, 
            message: "Authentication required. Please log in.", 
            status: response.status 
          };
        }

        if (response.status === 403) {
          console.error("Authorization error (403):", response.statusText);
          return { 
            success: false, 
            message: "You don't have permission to access this resource.", 
            status: response.status 
          };
        }

        if (response.status === 404) {
          console.error("Not found error (404):", response.statusText);
          return { 
            success: false, 
            message: "The requested resource was not found.", 
            status: response.status 
          };
        }

        if (response.status === 500) {
          console.error("Server error (500):", response.statusText);
          return { 
            success: false, 
            message: "An internal server error occurred. Please try again later.", 
            status: response.status 
          };
        }

        // For other error status codes
        try {
          const errorData = await response.json();
          console.error(`Error (${response.status}):`, errorData);
          return { 
            success: false, 
            message: errorData.message || `Error: ${response.statusText}`, 
            status: response.status,
            ...errorData 
          };
        } catch (error) {
          console.error(`Error (${response.status}):`, response.statusText);
          return { 
            success: false, 
            message: `Error: ${response.statusText}`, 
            status: response.status 
          };
        }
      };

      return await handleResponse(response, options);
    } catch (error) {
      console.error("API Request failed:", error);
      
      // Special handling for "not found" errors
      if (error.message === "Service not found" || 
          error.message?.includes("not found") || 
          error.status === 404) {
        console.log("Not found error in catch - handling gracefully");
        return { success: false, result: null, message: error.message };
      }
      
      // For public access endpoints, return empty data on error
      if (options.publicAccess) {
        console.log("Public access endpoint returning empty data for caught error");
        return { success: true, result: [] };
      }
      
      // For non-secure endpoints, return empty data on error
      if (options.isNonSecure) {
        console.log("Non-secure endpoint returning empty data for caught error");
        return { success: true, result: [] };
      }
      
      // Handle authentication errors
      if (!options.preventRedirect && handleAuthError(error)) {
        return { success: false, message: "Authentication required" };
      }

      // Ensure we have a proper error message
      const errorMessage = error.message || "An unexpected error occurred";
      const enhancedError = new Error(errorMessage);
      enhancedError.originalError = error;
      enhancedError.status = error.status || 500;
      throw enhancedError;
    }
  }

  static async invoke(params) {
    try {
      const { action, data, query, options = {} } = params;

      if (!action) {
        throw new Error("Action is required");
      }

      if (!END_POINTS[action]) {
        throw new Error(`Invalid action: ${action}`);
      }

      console.log("Invoking API action:", action);

      const { path, method, secure, parameterized } = END_POINTS[action];

      const headers = {};
      const token = getToken();
      
      // Add token if available
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      
      // Handle secure endpoints without token
      if (secure && !token) {
        if (options.preventRedirect) {
          throw new Error("Authentication required");
        }
        redirectToLogin("Authentication required");
        return { success: false, message: "Authentication required" };
      }

      // Handle parameterized paths
      let finalPath = path;
      let requestData = { ...data };
      
      if (parameterized && data) {
        Object.keys(data).forEach(key => {
          const placeholder = `:${key}`;
          if (finalPath.includes(placeholder)) {
            finalPath = finalPath.replace(placeholder, data[key]);
            delete requestData[key];
          }
        });
      }

      const url = `${API_URL}${finalPath}`;

      try {
        const response = await this.request(
          url, 
          method, 
          Object.keys(requestData || {}).length > 0 ? requestData : null, 
          headers, 
          query,
          { ...options, isNonSecure: !secure }
        );
        
        // Handle "not found" errors gracefully
        if (response && response.success === false && 
            (response.message === "Service not found" || 
             response.message?.includes("not found"))) {
          console.log("Not found error in response - handling gracefully");
          
          // For GET_SERVICE_BY_ID action, return null
          if (action === "getServiceById") {
            return { success: false, result: null, message: response.message };
          }
          
          // For GET/LIST actions, return empty array
          if (action.includes("get") || action.includes("list")) {
            return { success: true, result: [] };
          }
        }
        
        return response;
      } catch (requestError) {
        // Special handling for "not found" errors
        if (requestError.message === "Service not found" || 
            requestError.message?.includes("not found") || 
            requestError.status === 404) {
          console.log("Not found error caught - handling gracefully");
          
          // For GET_SERVICE_BY_ID action, return null
          if (action === "getServiceById") {
            return { success: false, result: null, message: requestError.message };
          }
          
          // For GET/LIST actions, return empty array
          if (action.includes("get") || action.includes("list")) {
            return { success: true, result: [] };
          }
        }
        
        // Add context to the error
        const contextError = new Error(`${action} failed: ${requestError.message}`);
        contextError.originalError = requestError;
        contextError.status = requestError.status;
        throw contextError;
      }
    } catch (error) {
      console.error("API Invoke failed:", error);
      
      // Get the action from params to use in this scope
      const { action, options = {} } = params || {};
      
      // Special handling for "not found" errors
      if (options.publicAccess || options.requiresAuth === false) {
        console.log("Public access endpoint returning empty data for caught error");
        return { success: true, result: [] };
      }
      
      // Handle authentication errors
      if (!params?.options?.preventRedirect && handleAuthError(error)) {
        return { success: false, message: "Authentication required" };
      }
      
      throw error;
    }
  }
} 