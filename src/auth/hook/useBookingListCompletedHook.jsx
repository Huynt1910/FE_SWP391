import { useState, useEffect } from "react";
import { APIClient } from "@/lib/api-client";
import { ACTIONS } from "@/lib/api-client/constant";
import { getMyInfo } from "@/utils/auth";
import { getCookie } from "cookies-next";

const useBookingListCompletedHook = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  // Fetch user ID on component mount
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const userInfo = await getMyInfo();
        if (userInfo && userInfo.id) {
          setUserId(userInfo.id);
        }
      } catch (err) {
        console.error("Error fetching user info:", err);
        setError("Failed to retrieve user information. Please login again.");
      }
    };

    fetchUserId();
  }, []);

  // Fetch completed bookings when userId is available
  useEffect(() => {
    if (userId) {
      fetchCompletedBookings(userId);
    }
  }, [userId]);

  const fetchCompletedBookings = async (id) => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching completed bookings for user:", id);

      // Get authentication token
      const token = getCookie("token");
      const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await APIClient.invoke({
        action: ACTIONS.GET_CUSTOMER_COMPLETED_BOOKINGS,
        pathParams: { userId: id },
        headers: authHeaders,
        options: { preventRedirect: true },
      });

      console.log("Completed bookings response:", response);

      if (response && response.success && response.result) {
        setData(response.result);
      } else {
        setData([]);

        if (response && !response.success) {
          setError(response.message || "Failed to fetch completed bookings");
        }
      }
    } catch (err) {
      console.error("Error fetching completed bookings:", err);
      setError("Failed to fetch completed bookings. Please try again later.");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshCompletedBookings = () => {
    if (userId) {
      fetchCompletedBookings(userId);
    }
  };

  const deleteBooking = async (bookingId) => {
    try {
      setIsDeleting(true);
      setDeleteError(null);
      
      console.log("Deleting booking:", bookingId);
      
      const response = await APIClient.invoke({
        action: ACTIONS.DELETE_BOOKING,
        pathParams: { bookingId },
        options: { 
          preventRedirect: true,
          secure: true
        }
      });
      
      console.log("Delete booking response:", response);
      
      if (response && response.success) {
        // Remove the deleted booking from state
        setData(prevData => prevData.filter(booking => booking.bookingId !== bookingId));
        return { success: true, message: "Booking deleted successfully" };
      } else {
        const errorMessage = response?.message || "Failed to delete booking";
        setDeleteError(errorMessage);
        return { success: false, message: errorMessage };
      }
    } catch (err) {
      console.error("Error deleting booking:", err);
      const errorMessage = "Failed to delete booking. Please try again later.";
      setDeleteError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    loading,
    error,
    data,
    refreshCompletedBookings,
    deleteBooking,
    isDeleting,
    deleteError
  };
};

export default useBookingListCompletedHook; 