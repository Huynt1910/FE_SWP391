import { useState } from "react";
import { APIClient } from "@/lib/api-client";
import { ACTIONS } from "@/lib/api-client/constant";

export const useBookingHook = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  // Get all active therapists
  const getActiveTherapists = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await APIClient.invoke({
        action: ACTIONS.GET_ACTIVE_THERAPISTS
      });
      
      // Check if response has data property and it's an array
      if (response && response.data && Array.isArray(response.data)) {
        setData(response.data);
        return response.data;
      } else if (response && Array.isArray(response)) {
        // Some APIs might return the array directly
        setData(response);
        return response;
      } else {
        console.error("Unexpected API response format:", response);
        setError("Invalid response format from API");
        return [];
      }
    } catch (error) {
      console.error("Error fetching active therapists:", error);
      setError(error.message || "Failed to fetch active therapists");
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
      console.error("Error fetching all therapists:", error);
      setError(error.message || "Failed to fetch therapists");
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
      const response = await APIClient.invoke({
        action: ACTIONS.GET_AVAILABLE_SLOTS,
        data: { date }
      });
      setData(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching available slots:", error);
      setError(error.message || "Failed to fetch available slots");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get therapist schedule by date
  const getTherapistSchedule = async (date) => {
    try {
      setLoading(true);
      setError(null);
      const response = await APIClient.invoke({
        action: ACTIONS.GET_THERAPIST_SCHEDULE,
        data: { date }
      });
      setData(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching therapist schedule:", error);
      setError(error.message || "Failed to fetch therapist schedule");
      throw error;
    } finally {
      setLoading(false);
    }
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
    getActiveTherapists,
    getAllTherapists,
    getTherapistById,
    getAvailableSlots,
    getTherapistSchedule,
    getTherapistMonthlySchedule,
    getAllSlots
  };
};

export default useBookingHook; 