import { useState } from "react";
import { APIClient } from "@/lib/api-client";
import { ACTIONS } from "@/lib/api-client/constant";
import { isAuthenticated } from "@/utils/auth";
import { getCookie } from "cookies-next";


export const useBookingHook = () => {
  // State management
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookingResult, setBookingResult] = useState(null);
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
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when field is changed
    if (formErrors[field]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    let isValid = true;

    // If no therapist is selected but we have data (therapists), auto-select the first one
    if (!formState.selectedTherapistId && data && data.length > 0) {
      console.log("Auto-selecting a therapist...");
      // Choose a random therapist from the available ones
      const randomIndex = Math.floor(Math.random() * data.length);
      const randomTherapist = data[randomIndex];
      
      // Update the form state with the selected therapist
      setFormState(prev => ({
        ...prev,
        selectedTherapistId: randomTherapist.id
      }));
      
      console.log(`Auto-selected therapist: ${randomTherapist.fullName || randomTherapist.name} (ID: ${randomTherapist.id})`);
    } else if (!formState.selectedTherapistId && (!data || data.length === 0)) {
      errors.therapist = "Please select a therapist";
      isValid = false;
    }

    if (!formState.selectedDate) {
      errors.date = "Please select a date";
      isValid = false;
    }

    if (!formState.selectedTime) {
      errors.time = "Please select a time";
      isValid = false;
    }

    if (!formState.selectedServiceIds.length) {
      errors.services = "Please select at least one service";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  // Check if user is authenticated
  const checkAuthentication = () => {
    const authenticated = isAuthenticated();
    console.log("Checking authentication status:", authenticated);
    setAuthRequired(!authenticated);

    // // If not authenticated, reset all loading and data states
    // if (!authenticated) {
    //   setLoading(false);
    //   setError(null);
    //   setData([]);
    //   setAvailableSlots([]);
    //   setBookingResult(null);
    // }

    return authenticated;
  };

  // Get all active therapists
  const getActiveTherapists = async (serviceIds = [1, 2, 3]) => {
    try {
      setLoading(true);
      setError(null);
      setAuthRequired(false);

      console.log("Fetching active therapists...");

      // Get authentication token
      const token = getCookie("token");
      const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

      // Since it's a GET request, we need to pass serviceIds as URL parameters instead of body
      const response = await APIClient.invoke({
        action: ACTIONS.GET_ACTIVE_THERAPISTS,
        urlParams: { serviceId: serviceIds.join(',') }, // Use comma-separated list for the serviceId parameter
        headers: authHeaders,
        options: { preventRedirect: true },
      });

      console.log("API Response for getActiveTherapists:", response);

      // Process the response
      if (response && response.success === true && response.result) {
        console.log(
          "Response has result array with length:",
          response.result.length
        );
        setData(response.result);
        return response.result;
      } else {
        console.error("Unexpected API response format:", response);
        setError("Invalid response format from API");
        return [];
      }
    } catch (error) {
      console.error("Error fetching active therapists:", error);

      // Check if the error is related to authentication
      if (
        error.message &&
        (error.message.includes("Unauthenticated") ||
          error.message.includes("Authentication required") ||
          error.message.includes("401"))
      ) {
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

  // Get available slots for a therapist on a specific date
  const getAvailableSlots = async (therapistId, serviceIds, date) => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching available slots...");

      // Get the authentication token
      const token = getCookie("token");

      // Add token to headers even though the endpoint is marked as non-secure
      const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await APIClient.invoke({
        action: ACTIONS.GET_AVAILABLE_SLOTS,
        data: {
          therapistId: therapistId,
          serviceId: serviceIds,
          date: date,
        },
        headers: authHeaders,
        options: { preventRedirect: true },
      });

      console.log("API Response for getAvailableSlots:", response);

      // Process the response
      if (response && response.success === true && response.result) {
        console.log("Available slots:", response.result);
        setAvailableSlots(response.result);
        return response.result;
      } else {
        console.error("Unexpected API response format:", response);
        setError("Invalid response format from API");
        return [];
      }
    } catch (error) {
      console.error("Error fetching available slots:", error);
      setError(error.message || "Failed to fetch available slots");
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Get therapist schedule for a month
  const getTherapistScheduleForMonth = async (therapistId, month, year) => {
    try {
      setLoading(true);
      setError(null);

      console.log(
        `Fetching schedule for therapist ${therapistId} for ${month}/${year}...`
      );

      const response = await APIClient.invoke({
        action: ACTIONS.GET_THERAPIST_SCHEDULE,
        urlParams: {
          month: month,
          year: year,
        },
        options: { preventRedirect: true },
      });

      console.log("API Response for getTherapistSchedule:", response);

      if (
        response &&
        response.success === true &&
        Array.isArray(response.result)
      ) {
        return response.result;
      } else if (Array.isArray(response)) {
        return response;
      } else {
        console.error("Unexpected API response format:", response);
        setError("Invalid response format from API");
        return [];
      }
    } catch (error) {
      console.error("Error fetching therapist schedule:", error);
      setError(error.message || "Failed to fetch therapist schedule");
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Get therapist schedule by ID
  const getTherapistScheduleById = async (therapistId) => {
    try {
      setLoading(true);
      setError(null);

      console.log(`Fetching schedule for therapist ID: ${therapistId}`);

      const response = await APIClient.invoke({
        action: ACTIONS.GET_THERAPIST_SCHEDULE_BY_ID,
        urlParams: {
          id: therapistId,
        },
        options: { preventRedirect: true },
      });

      console.log("API Response for getTherapistScheduleById:", response);

      if (
        response &&
        response.success === true &&
        Array.isArray(response.result)
      ) {
        return response.result;
      } else if (Array.isArray(response)) {
        return response;
      } else {
        console.error("Unexpected API response format:", response);
        setError("Invalid response format from API");
        return [];
      }
    } catch (error) {
      console.error("Error fetching therapist schedule by ID:", error);
      setError(error.message || "Failed to fetch therapist schedule");
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Get available vouchers
  const getAvailableVouchers = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching available vouchers...");

      const response = await APIClient.invoke({
        action: ACTIONS.GET_ACTIVE_VOUCHERS,
        options: { preventRedirect: true },
      });

      console.log("API Response for getAvailableVouchers:", response);

      if (
        response &&
        response.success === true &&
        Array.isArray(response.result)
      ) {
        // Filter for active vouchers only
        const activeVouchers = response.result.filter(
          (voucher) =>
            voucher.isActive &&
            new Date(voucher.expiryDate) > new Date() &&
            voucher.quantity > 0
        );

        console.log("Active vouchers:", activeVouchers);
        return activeVouchers;
      } else {
        console.error("Unexpected API response format:", response);
        setError("Invalid response format from API");
        return [];
      }
    } catch (error) {
      console.error("Error fetching vouchers:", error);
      setError(error.message || "Failed to fetch vouchers");
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Submit booking
  const submitBooking = async (bookingData) => {
    try {
      setLoading(true);
      setError(null);

      // CRITICAL: Ensure userId is valid and correctly formatted
      if (!bookingData.userId || bookingData.userId === 0) {
        console.warn(
          "CRITICAL: Invalid or missing userId in booking data, using default (1)"
        );
        bookingData = {
          ...bookingData,
          userId: 1, // Explicitly set to 1 if missing or invalid
        };
      }

      // Convert userId to number just to be safe
      bookingData.userId = Number(bookingData.userId);

      // Process voucher ID correctly
      if (bookingData.voucherId) {
        console.log(
          "Voucher ID before processing:",
          bookingData.voucherId,
          typeof bookingData.voucherId
        );
        // Ensure voucherId is sent as a number
        bookingData.voucherId = Number(bookingData.voucherId);
        console.log(
          "Voucher ID after processing:",
          bookingData.voucherId,
          typeof bookingData.voucherId
        );
      } else {
        // If voucher ID is null, undefined, or 0, ensure it's not included or set to null
        console.log("No voucher selected, setting voucherId to null");
        bookingData.voucherId = null;
      }

      // Add email to booking data - the API might need this to store the booking
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && user.email) {
          bookingData.email = user.email;
          console.log("Added user email to booking data:", user.email);
        } else {
          // Try to find email in other storage locations
          const storedEmail = localStorage.getItem("userEmail");
          if (storedEmail) {
            bookingData.email = storedEmail;
            console.log("Added email from direct localStorage:", storedEmail);
          }
        }
      } catch (err) {
        console.warn("Error adding email to booking data:", err);
      }

      console.log(
        "Creating booking with FINAL data:",
        JSON.stringify(bookingData)
      );
      console.log(
        "User ID type and value:",
        typeof bookingData.userId,
        bookingData.userId
      );

      console.log(
        "Creating booking with FINAL data:",
        JSON.stringify(bookingData)
      );
      console.log(
        "User ID type and value:",
        typeof bookingData.userId,
        bookingData.userId
      );
      console.log(
        "Voucher ID type and value:",
        typeof bookingData.voucherId,
        bookingData.voucherId
      );

      // Get authentication token
      const token = getCookie("token");
      const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await APIClient.invoke({
        action: ACTIONS.CREATE_BOOKING,
        data: bookingData,
        headers: authHeaders,
        options: { preventRedirect: true },
      });

      console.log("API Response for createBooking:", response);

      // Process the response
      if (response && response.success === true) {
        console.log("Booking created successfully:", response.result);
        setBookingResult(response.result);
        return response.result;
      } else {
        console.error("Failed to create booking:", response);
        setError(response.message || "Failed to create booking");
        return null;
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      setError(error.message || "Failed to create booking");
      return null;
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
    availableSlots,
    bookingResult,
    authRequired,
    formState,
    formErrors,

    // Methods
    getActiveTherapists,
    getAvailableSlots,
    getTherapistScheduleForMonth,
    getTherapistScheduleById,
    getAvailableVouchers,
    submitBooking,
    handleInputChange,
    resetForm,
    validateForm,
  };
};

export default useBookingHook;
