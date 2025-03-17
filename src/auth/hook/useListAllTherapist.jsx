import { useState } from "react";
import { APIClient } from "@/lib/api-client";
import { ACTIONS } from "@/lib/api-client/constant";

export const useListAllTherapist = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);

  // Get all therapists
  const getAllTherapists = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Fetching all therapists...");
      
      const response = await APIClient.invoke({
        action: ACTIONS.GET_ALL_THERAPISTS,
        options: { 
          preventRedirect: true,
          requiresAuth: false // Specify that this endpoint doesn't require authentication
        }
      });
      
      console.log("Raw API Response for getAllTherapists:", JSON.stringify(response));
      
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
      console.error("Error fetching therapists:", error);
      
      // Handle authentication errors differently - don't show auth error for public endpoint
      if (error.status === 401 || error.message?.includes("Authentication required")) {
        console.log("Authentication error caught, but this is a public endpoint");
        setError("Failed to fetch therapists. Please try again later.");
      } else {
        setError(error.message || "Failed to fetch therapists");
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
    getAllTherapists
  };
};

export default useListAllTherapist; 