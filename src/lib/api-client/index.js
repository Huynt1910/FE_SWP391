import { getCookie } from "cookies-next";
import { API_URL, END_POINTS } from "./constant";
import { getToken, handleAuthError, redirectToLogin } from "@/utils/auth";

export class APIClient {
  static async request(url, method, data, headers, query) {
    try {
      const queryParams = new URLSearchParams(query || {}).toString();
      const options = {
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

      const response = await fetch(fullUrl, options);
      
      // Log response status
      console.log("API Response status:", response.status, response.statusText);
      
      // Handle 401 Unauthorized responses
      if (response.status === 401) {
        console.error("Unauthorized API response");
        redirectToLogin("Your session has expired. Please log in again.");
        return { success: false, message: "Authentication required" };
      }
      
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
      
      // Handle authentication errors
      if (handleAuthError(error)) {
        return { success: false, message: "Authentication required" };
      }
      
      throw error;
    }
  }

  static async invoke(params) {
    try {
      const { action, data, query } = params;

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
        const token = getToken();
        console.log("Token for secure request:", token ? "Found" : "Not found");
        
        if (!token) {
          redirectToLogin("Authentication required for this action");
          return { success: false, message: "Authentication required" };
        }
        
        headers["Authorization"] = `Bearer ${token}`;
      }

      // Handle parameterized paths
      let finalPath = path;
      let requestData = { ...data };
      
      if (parameterized && data) {
        Object.keys(data).forEach(key => {
          const placeholder = `:${key}`;
          if (finalPath.includes(placeholder)) {
            finalPath = finalPath.replace(placeholder, data[key]);
            // Remove the parameter from data to avoid duplication
            delete requestData[key];
          }
        });
      }

      const url = `${API_URL}${finalPath}`;

      return this.request(
        url, 
        method, 
        Object.keys(requestData || {}).length > 0 ? requestData : null, 
        headers, 
        query
      );
    } catch (error) {
      console.error("API Invoke failed:", error);
      
      // Handle authentication errors
      if (handleAuthError(error)) {
        return { success: false, message: "Authentication required" };
      }
      
      throw error;
    }
  }
}