import { useState } from "react";
import { APIClient } from "@/lib/api-client";
import { ACTIONS } from "@/lib/api-client/constant";
import { isAuthenticated } from "@/utils/auth";

export const useBookingHook = () => {
  // State management
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [authRequired, setAuthRequired] = useState(false);
  const [formState, setFormState] = useState({
    selectedTherapistId: null,
    selectedDate: null,
    selectedTime: null,
    selectedServiceIds: [],
    customerNote: "",
  });

  // Form validation state
  const [formErrors, setFormErrors] = useState({
    therapist: "",
    date: "",
    time: "",
    services: "",
  });

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormState(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when field is changed
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formState.selectedTherapistId) {
      errors.therapist = "Please select a therapist";
    }
    
    if (!formState.selectedDate) {
      errors.date = "Please select a date";
    }
    
    if (!formState.selectedTime) {
      errors.time = "Please select a time";
    }
    
    if (!formState.selectedServiceIds.length) {
      errors.services = "Please select at least one service";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Check if user is authenticated
  const checkAuthentication = () => {
    const authenticated = isAuthenticated();
    setAuthRequired(!authenticated);
    return authenticated;
  };

  // Get all active therapists
  const getActiveTherapists = async (serviceIds = [1, 2, 3]) => {
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
        action: ACTIONS.GET_THERAPISTS_BY_SERVICE,
        data: { serviceId: serviceIds },
        options: { preventRedirect: true }
      });
      
      console.log("API Response for getActiveTherapists:", response);
      
      // Process the response
      if (response && response.success === true && response.result) {
        console.log("Response has result array with length:", response.result.length);
        setData(response.result);
        return response.result;
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

  // Submit booking
  const submitBooking = async () => {
    try {
      // Validate form first
      if (!validateForm()) {
        return false;
      }
      
      setLoading(true);
      setError(null);
      
      // Check authentication first
      if (!checkAuthentication()) {
        setAuthRequired(true);
        setError("Authentication required to book appointments. Please log in.");
        return false;
      }
      
      // Implementation for booking submission will go here
      // This is a placeholder for the actual API call
      
      return true;
    } catch (error) {
      console.error("Error submitting booking:", error);
      setError(error.message || "Failed to submit booking");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormState({
      selectedTherapistId: null,
      selectedDate: null,
      selectedTime: null,
      selectedServiceIds: [],
      customerNote: "",
    });
    setFormErrors({
      therapist: "",
      date: "",
      time: "",
      services: "",
    });
  };

  return {
    // State
    loading,
    error,
    data,
    authRequired,
    formState,
    formErrors,
    
    // Methods
    getActiveTherapists,
    handleInputChange,
    submitBooking,
    resetForm,
    validateForm
  };
};

export default useBookingHook; 