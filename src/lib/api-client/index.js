import { getCookie } from "cookies-next";
import { API_URL, END_POINTS, ACTIONS } from "./constant";
import { getToken, handleAuthError, redirectToLogin } from "@/utils/auth";
import axios from "axios";

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
          console.log(
            "Public access endpoint returning empty data for network error"
          );
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
            console.log(
              "Non-authenticated endpoint received 401, returning empty data"
            );
            return {
              success: false,
              message: "Authentication required",
              result: [],
            };
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
            status: response.status,
          };
        }

        if (response.status === 403) {
          console.error("Authorization error (403):", response.statusText);
          return {
            success: false,
            message: "You don't have permission to access this resource.",
            status: response.status,
          };
        }

        if (response.status === 404) {
          console.error("Not found error (404):", response.statusText);
          return {
            success: false,
            // message: "The requested resource was not found.",
            status: response.status,
          };
        }

        if (response.status === 500) {
          console.error("Server error (500):", response.statusText);
          return {
            success: false,
            message:
              "An internal server error occurred. Please try again later.",
            status: response.status,
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
            ...errorData,
          };
        } catch (error) {
          console.error(`Error (${response.status}):`, response.statusText);
          return {
            success: false,
            message: `Error: ${response.statusText}`,
            status: response.status,
          };
        }
      };

      return await handleResponse(response, options);
    } catch (error) {
      console.error("API Request failed:", error);

      // Special handling for "not found" errors
      if (
        error.message === "Service not found" ||
        error.message?.includes("not found") ||
        error.status === 404
      ) {
        console.log("Not found error in catch - handling gracefully");
        return { success: false, result: null, message: error.message };
      }

      // For public access endpoints, return empty data on error
      if (options.publicAccess) {
        console.log(
          "Public access endpoint returning empty data for caught error"
        );
        return { success: true, result: [] };
      }

      // For non-secure endpoints, return empty data on error
      if (options.isNonSecure) {
        console.log(
          "Non-secure endpoint returning empty data for caught error"
        );
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

  static _buildUrl(endpoint, params = {}) {
    let url = `${API_URL}${endpoint.path}`;

    // Replace path parameters for both :id and {id} formats
    if (params) {
      Object.keys(params).forEach((key) => {
        const placeholder = `:${key}`;
        if (url.includes(placeholder)) {
          url = url.replace(placeholder, encodeURIComponent(params[key]));
          console.log(`Replaced ${placeholder} with ${params[key]}`);
        }

        const bracketPlaceholder = `{${key}}`;
        if (url.includes(bracketPlaceholder)) {
          url = url.replace(
            bracketPlaceholder,
            encodeURIComponent(params[key])
          );
          console.log(`Replaced ${bracketPlaceholder} with ${params[key]}`);
        }
      });
    }

    console.log("Built URL:", url); // Debug log
    return url;
  }

  static async invoke({
    action,
    data = null,
    pathParams = {},
    urlParams = {},
    headers = {},
    options = {},
  }) {
    try {
      const endpoint = END_POINTS[action];
      if (!endpoint) {
        throw new Error(`Invalid action: ${action}`);
      }

      console.log("Making request with params:", {
        action,
        endpoint: `${endpoint.method} ${endpoint.path}`,
        pathParams,
        urlParams,
        secure: endpoint.secure,
        publicAccess: endpoint.publicAccess
      });

      // Don't set Content-Type if FormData is being sent
      const isFormData = data instanceof FormData;
      const contentTypeHeader = isFormData
        ? {}
        : { "Content-Type": "application/json" };

      // Add authorization header if the endpoint requires authentication
      let authHeaders = {};
      if (endpoint.secure) {
        const token = getToken();
        if (token) {
          authHeaders = { Authorization: `Bearer ${token}` };
          console.log(
            `Added auth token for secure endpoint: ${action} (token length: ${token.length})`
          );
        } else {
          console.warn(
            `Attempting to access secure endpoint ${action} without authentication token`
          );
        }
      } else {
        console.log(`Endpoint ${action} doesn't require authentication`);
      }
      
      // Combine all headers
      const combinedHeaders = {
        ...contentTypeHeader,
        ...authHeaders,
        ...headers,
      };
      
      console.log(`Request headers for ${action}:`, combinedHeaders);

      const url = this._buildUrl(endpoint, pathParams);
      const requestOptions = {
        publicAccess: endpoint.publicAccess,
        preventRedirect: options.preventRedirect || endpoint.publicAccess,
        ...options,
      };

      // Log full request details for easier debugging
      console.log(`Full request details for ${action}:`, {
        url,
        method: endpoint.method,
        headers: combinedHeaders,
        data: isFormData ? "[FormData]" : data,
        options: requestOptions
      });

      return await this.request(
        url,
        endpoint.method,
        isFormData ? data : data,
        combinedHeaders,
        urlParams,
        requestOptions
      );
    } catch (error) {
      console.error(`Error in invoke for action ${action}:`, error);
      
      // Enhanced error logging for debugging
      if (error.response) {
        console.error("Response error details:", {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          headers: error.response.headers
        });
        
        // Special handling for login-related 404 errors
        if (error.response.status === 404 && action === ACTIONS.SIGN_IN) {
          console.error("Login endpoint not found. Check API URL and endpoint path configuration.");
          return {
            success: false,
            errorType: "not_found",
            message: "Login service unavailable. Please try again later.",
            status: 404
          };
        }
      }
      
      throw error;
    }
  }
}
