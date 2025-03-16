import { useState } from "react";
import { API_URL } from "@/lib/api-client/constant";
import { getCookie } from "cookies-next";

export const useListAllTherapist = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  // Get all therapists
  const getAllTherapists = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Fetching all therapists...");
      
      // Get token from cookies
      const token = getCookie("token");
      
      // Use direct fetch with token if available
      const response = await fetch(`${API_URL}/therapists`, {
        headers: token ? {
          'Authorization': `Bearer ${token}`
        } : {}
      });
      
      console.log("API Response Status:", response.status);
      
      // Handle 401 Unauthorized specifically
      if (response.status === 401) {
        console.log("Authentication required to access therapists");
        setError("Authentication required to view therapists. Please log in.");
        setData([]);
        return [];
      }
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const responseData = await response.json();
      console.log("API Response Data:", responseData);
      
      // Process the response data
      if (Array.isArray(responseData)) {
        console.log("Response is an array with length:", responseData.length);
        setData(responseData);
        return responseData;
      } else if (responseData && responseData.data && Array.isArray(responseData.data)) {
        console.log("Response has data array with length:", responseData.data.length);
        setData(responseData.data);
        return responseData.data;
      } else if (responseData && typeof responseData === 'object') {
        console.log("Response is an object with keys:", Object.keys(responseData));
        
        // Try to find any array in the response
        for (const key in responseData) {
          if (Array.isArray(responseData[key])) {
            console.log(`Found array at key '${key}' with length:`, responseData[key].length);
            setData(responseData[key]);
            return responseData[key];
          }
        }
        
        // If no array found but response looks like a single therapist
        if (responseData.id) {
          console.log("Response appears to be a single therapist object");
          const therapistArray = [responseData];
          setData(therapistArray);
          return therapistArray;
        }
        
        console.error("Unexpected API response format:", responseData);
        setError("Invalid response format from API");
        return [];
      } else {
        console.error("Unexpected API response format:", responseData);
        setError("Invalid response format from API");
        return [];
      }
    } catch (error) {
      console.error("Error fetching all therapists:", error);
      setError(error.message || "Failed to fetch therapists");
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