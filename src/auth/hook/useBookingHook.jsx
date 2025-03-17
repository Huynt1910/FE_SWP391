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
      
      console.log("Calling getActiveTherapists from hook");
      
      // Check if token exists
      const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
      console.log("Token available:", !!token);
      
      const response = await APIClient.invoke({
        action: ACTIONS.GET_ACTIVE_THERAPISTS,
        options: { preventRedirect: true }
      });
      
      console.log("API response for active therapists:", response);
      
      // Check if response has data property and it's an array
      if (response && response.data && Array.isArray(response.data)) {
        console.log("Found data array in response.data");
        setData(response.data);
        return response.data;
      } else if (response && Array.isArray(response)) {
        // Some APIs might return the array directly
        console.log("Response is directly an array");
        setData(response);
        return response;
      } else if (response && typeof response === 'object') {
        // Try to find any array in the response
        console.log("Searching for array in response object");
        for (const key in response) {
          if (Array.isArray(response[key])) {
            console.log(`Found array in response.${key}`);
            setData(response[key]);
            return response[key];
          }
        }
        
        console.error("No array found in response:", response);
        setError("Invalid response format from API");
        return [];
      } else {
        console.error("Unexpected API response format:", response);
        setError("Invalid response format from API");
        return [];
      }
    } catch (error) {
      console.error("Error fetching active therapists:", error);
      
      // Check if the error is related to authentication
      if (error.message && (
        error.message.includes("Unauthenticated") || 
        error.message.includes("Authentication required") ||
        error.message.includes("401")
      )) {
        console.log("Authentication error detected");
        setError("Authentication required. Please log in.");
      } else {
        setError(error.message || "Failed to fetch active therapists");
      }
      
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Get all therapists (active and inactive)
  const getAllTherapists = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await APIClient.invoke({
        action: ACTIONS.GET_ALL_THERAPISTS
      });
      
      // Check if response has data property and it's an array
      if (response && Array.isArray(response)) {
        setData(response);
        return response;
      } else if (response && response.data && Array.isArray(response.data)) {
        // Some APIs might return the data in a data property
        setData(response.data);
        return response.data;
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

  // Get therapist details by ID
  const getTherapistById = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await APIClient.invoke({
        action: ACTIONS.GET_THERAPIST_BY_ID,
        data: { id }
      });
      
      if (response && response.data) {
        setData(response.data);
        return response.data;
      } else if (response) {
        setData(response);
        return response;
      } else {
        console.error("Unexpected API response format:", response);
        setError("Invalid response format from API");
        return null;
      }
    } catch (error) {
      console.error("Error fetching therapist details:", error);
      setError(error.message || "Failed to fetch therapist details");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get available slots for a specific date
  const getAvailableSlots = async (date) => {
    try {
      setLoading(true);
      setError(null);
      console.log(`Calling getAvailableSlots for date: ${date}`);
      
      // Check if token exists
      const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
      console.log("Token available for slots request:", !!token);
      
      const response = await APIClient.invoke({
        action: ACTIONS.GET_AVAILABLE_SLOTS,
        data: { date }
      });
      
      console.log("API response for available slots:", response);
      
      // Check response format and provide fallback
      if (response && response.data && Array.isArray(response.data)) {
        setData(response.data);
        return response.data;
      } else if (response && Array.isArray(response)) {
        setData(response);
        return response;
      } else {
        console.log("Invalid response format, returning sample slots");
        // Return sample slots as fallback
        return generateSampleSlots();
      }
    } catch (error) {
      console.error("Error fetching available slots:", error);
      setError(error.message || "Failed to fetch available slots");
      
      // Return sample slots as fallback
      return generateSampleSlots();
    } finally {
      setLoading(false);
    }
  };

  // Generate sample time slots for testing
  const generateSampleSlots = () => {
    const slots = [];
    // Generate slots from 9 AM to 5 PM
    for (let i = 9; i <= 17; i++) {
      slots.push({
        id: `slot-${i}`,
        startTime: `${i}:00:00`,
        endTime: `${i+1}:00:00`,
        available: true
      });
    }
    return slots;
  };

  // Get therapist schedule by date
  const getTherapistSchedule = async (date) => {
    try {
      setLoading(true);
      setError(null);
      console.log(`Calling getTherapistSchedule for date: ${date}`);
      
      // Check if token exists
      const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
      console.log("Token available for schedule request:", !!token);
      
      const response = await APIClient.invoke({
        action: ACTIONS.GET_THERAPIST_SCHEDULE,
        data: { date }
      });
      
      console.log("API response for therapist schedule:", response);
      
      // Check response format and provide fallback
      if (response && response.data && Array.isArray(response.data)) {
        setData(response.data);
        return response.data;
      } else if (response && Array.isArray(response)) {
        setData(response);
        return response;
      } else {
        console.log("Invalid response format, returning sample schedule");
        // Return sample schedule as fallback
        return generateSampleSchedule();
      }
    } catch (error) {
      console.error("Error fetching therapist schedule:", error);
      setError(error.message || "Failed to fetch therapist schedule");
      
      // Return sample schedule as fallback
      return generateSampleSchedule();
    } finally {
      setLoading(false);
    }
  };

  // Generate sample schedule for testing
  const generateSampleSchedule = () => {
    const schedule = [];
    // Generate schedule entries matching the sample slots
    for (let i = 9; i <= 17; i++) {
      schedule.push({
        id: `schedule-${i}`,
        slotId: `slot-${i}`,
        therapistId: 1,
        date: new Date().toISOString().split('T')[0],
        available: true
      });
    }
    return schedule;
  };

  // Get therapist monthly schedule
  const getTherapistMonthlySchedule = async (therapistId, month) => {
    try {
      setLoading(true);
      setError(null);
      const response = await APIClient.invoke({
        action: ACTIONS.GET_THERAPIST_MONTHLY_SCHEDULE,
        data: { therapistId, month }
      });
      setData(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching therapist monthly schedule:", error);
      setError(error.message || "Failed to fetch therapist monthly schedule");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get all slots
  const getAllSlots = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await APIClient.invoke({
        action: ACTIONS.GET_ALL_SLOTS
      });
      setData(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching all slots:", error);
      setError(error.message || "Failed to fetch all slots");
      throw error;
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