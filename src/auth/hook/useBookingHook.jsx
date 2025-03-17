import { useState } from "react";
import { APIClient } from "@/lib/api-client";
import { ACTIONS } from "@/lib/api-client/constant";
import { isAuthenticated } from "@/utils/auth";

export const useBookingHook = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [authRequired, setAuthRequired] = useState(false);

  // Check if user is authenticated
  const checkAuthentication = () => {
    const authenticated = isAuthenticated();
    setAuthRequired(!authenticated);
    return authenticated;
  };

  // Get all active therapists
  const getActiveTherapists = async () => {
    try {
      setLoading(true);
      setError(null);
      setAuthRequired(false);
      
      // Check authentication first
      if (!checkAuthentication()) {
        console.log("Authentication required for booking");
        setAuthRequired(true);
        setError("Authentication required to book appointments. Please log in.");
        return [];
      }
      
      console.log("Fetching active therapists...");
      
      const response = await APIClient.invoke({
        action: ACTIONS.GET_ACTIVE_THERAPISTS,
        options: { preventRedirect: true }
      });
      
      console.log("API Response for getActiveTherapists:", response);
      
      // If we got a success: false response with auth error, set authRequired
      if (response && response.success === false && 
          response.message?.includes("Authentication required")) {
        console.log("Authentication required response");
        setAuthRequired(true);
        setError("Authentication required to book appointments. Please log in.");
        return [];
      }
      
      // Process the response data
      if (response && response.success === true && response.result) {
        console.log("Response has result array with length:", response.result.length);
        setData(response.result);
        return response.result;
      } else if (Array.isArray(response)) {
        console.log("Response is an array with length:", response.length);
        setData(response);
        return response;
      } else if (response && response.data && Array.isArray(response.data)) {
        console.log("Response has data array with length:", response.data.length);
        setData(response.data);
        return response.data;
      } else if (response && typeof response === 'object') {
        console.log("Response is an object with keys:", Object.keys(response));
        
        // Try to find any array in the response
        for (const key in response) {
          if (Array.isArray(response[key])) {
            console.log(`Found array at key '${key}' with length:`, response[key].length);
            setData(response[key]);
            return response[key];
          }
        }
        
        console.error("Unexpected API response format:", response);
        setError("Invalid response format from API");
        return [];
      } else {
        console.error("Unexpected API response format:", response);
        setError("Invalid response format from API");
        return [];
      }
    } catch (error) {
      console.error("Error fetching active therapists:", error);
      
      // Handle authentication errors specifically
      if (error.status === 401 || error.message?.includes("Authentication required")) {
        console.log("Authentication error caught");
        setAuthRequired(true);
        setError("Authentication required to book appointments. Please log in.");
      } else {
        setError(error.message || "Failed to fetch active therapists");
      }
      
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    data,
    authRequired,
    getActiveTherapists
  };
};

export default useBookingHook; 