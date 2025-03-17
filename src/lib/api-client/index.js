import { getCookie } from "cookies-next";
import { API_URL, END_POINTS } from "./constant";

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
      
      // Handle non-2xx responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API Error:", { 
          status: response.status, 
          statusText: response.statusText,
          data: errorData 
        });
        
        throw new Error(
          errorData.message || 
          `Request failed with status ${response.status}: ${response.statusText}`
        );
      }
      
      const responseData = await response.json();
      console.log("API Response data:", responseData);
      return responseData;
    } catch (error) {
      console.error("API Request failed:", error);
      throw error;
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
      if (secure) {
        // Add access token to headers
        const token = getCookie("token");
        console.log("Token for secure request:", token ? "Found" : "Not found");
        
        if (!token) {
          // Instead of throwing an error, we'll redirect to login
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
            return { success: false, message: "Authentication required. Redirecting to login..." };
          } else {
            throw new Error("Unauthenticated: Authentication token is missing");
          }
        }
        
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
      if (error.message && error.message.includes("Unauthenticated") && typeof window !== 'undefined') {
        window.location.href = '/login';
        return { success: false, message: "Authentication required. Redirecting to login..." };
      }
      
      throw error;
    }
  }
}