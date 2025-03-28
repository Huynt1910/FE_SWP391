import { getCookie } from "cookies-next";
import { API_URL, END_POINTS, ACTIONS } from "./constant";
import { getToken, handleAuthError, redirectToLogin } from "@/utils/auth";
import axios from "axios";
import { isOnline } from "@/utils/network";
import { showToast } from "@/utils/toast";

export class APIClient {
  static async request(url, method, data, headers, query, options = {}) {
    try {
      // Check for internet connectivity first
      if (!isOnline() && !options.skipConnectivityCheck) {
        console.warn("No internet connection detected before making request");

        // Show toast to user
        if (!options.suppressToast) {
          showToast(
            "Không có kết nối mạng. Vui lòng kiểm tra lại kết nối Internet của bạn.",
            "error"
          );
        }

        // Return empty data for public access endpoints
        if (options.publicAccess) {
          return { success: true, result: [], isOffline: true };
        }

        // Return a consistent offline error for other endpoints
        return {
          success: false,
          isOffline: true,
          message:
            "Không có kết nối mạng. Vui lòng kiểm tra lại kết nối Internet của bạn.",
        };
      }

      const queryParams = new URLSearchParams(query || {}).toString();
      const requestOptions = {
        method,
        headers: Object.assign(
          {
            // Không đặt Content-Type nếu là FormData
            ...(data instanceof FormData
              ? {}
              : { "Content-Type": "application/json" }),
          },
          headers
        ),
        body:
          data instanceof FormData
            ? data
            : data
            ? JSON.stringify(data)
            : undefined,
      };

      const fullUrl = `${url}${queryParams ? `?${queryParams}` : ""}`;
      console.log("API Request:", { url: fullUrl, method, data });

      let response;
      try {
        response = await fetch(fullUrl, requestOptions);
      } catch (networkError) {
        console.error("Network error:", networkError);

        // Show toast notification for network errors
        if (!options.suppressToast) {
          showToast(
            "Không có kết nối mạng. Vui lòng kiểm tra lại kết nối Internet của bạn.",
            "error"
          );
        }

        // For public access endpoints, return empty data on network error
        if (options.publicAccess) {
          console.log(
            "Public access endpoint returning empty data for network error"
          );
          return { success: true, result: [], isOffline: true };
        }

        return {
          success: false,
          isOffline: true,
          message:
            "Không có kết nối mạng. Vui lòng kiểm tra lại kết nối Internet của bạn.",
        };
      }

      // Log response status
      console.log("API Response status:", response.status, response.statusText);

      // Handle API response
      const handleResponse = async (response, options = {}) => {
        // Check if response is OK (status in the range 200-299)
        if (response.ok) {
          // Get response as text first
          const responseText = await response.text();

          // If the response is empty, return success
          if (!responseText) {
            return {
              success: true,
              message: "Operation successful",
              result: null,
            };
          }

          // Check if it starts with specific text patterns
          if (
            responseText.startsWith("Staff") ||
            responseText.includes("successfully") ||
            !responseText.trim().startsWith("{")
          ) {
            return {
              success: true,
              message: responseText,
              result: responseText,
            };
          }

          // Try parsing as JSON if it looks like JSON
          try {
            const jsonData = JSON.parse(responseText);
            return {
              success: true,
              message: jsonData.message || "Operation successful",
              result: jsonData.result || jsonData,
            };
          } catch (error) {
            // If JSON parsing fails, return the text response
            console.log(
              "Response is not JSON, treating as text:",
              responseText
            );
            return {
              success: true,
              message: responseText,
              result: responseText,
            };
          }
        }

        // For error responses, try to get the response as text first
        try {
          const errorText = await response.text();

          // If it's a plain text error
          if (!errorText.startsWith("{")) {
            return {
              success: false,
              message: errorText,
              status: response.status,
            };
          }

          // Try parsing as JSON
          try {
            const errorJson = JSON.parse(errorText);
            return {
              success: false,
              message: errorJson.message || errorText,
              status: response.status,
              ...errorJson,
            };
          } catch {
            // If JSON parsing fails, return the text
            return {
              success: false,
              message: errorText,
              status: response.status,
            };
          }
        } catch (error) {
          // If we can't even get the text, return a generic error
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

      // Check for network connectivity errors
      if (
        error.message?.includes("network") ||
        error.message?.includes("internet") ||
        error.message?.includes("connection") ||
        error.message?.includes("offline") ||
        (error.name === "TypeError" &&
          error.message?.includes("Failed to fetch"))
      ) {
        console.warn("Network connectivity error detected:", error.message);

        // Show toast notification for network errors
        if (!options.suppressToast) {
          showToast(
            "Không có kết nối mạng. Vui lòng kiểm tra lại kết nối Internet của bạn.",
            "error"
          );
        }

        // For public access endpoints, return empty data on network error
        if (options.publicAccess) {
          return { success: true, result: [], isOffline: true };
        }

        return {
          success: false,
          isOffline: true,
          message:
            "Không có kết nối mạng. Vui lòng kiểm tra lại kết nối Internet của bạn.",
        };
      }

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
        options: requestOptions,
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
          headers: error.response.headers,
        });

        // Special handling for login-related 404 errors
        if (error.response.status === 404 && action === ACTIONS.SIGN_IN) {
          console.error(
            "Login endpoint not found. Check API URL and endpoint path configuration."
          );
          return {
            success: false,
            errorType: "not_found",
            message: "Login service unavailable. Please try again later.",
            status: 404,
          };
        }
      }

      throw error;
    }
  }
}
