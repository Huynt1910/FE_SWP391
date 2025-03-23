import { useState, useEffect } from "react";
import { APIClient } from "@/lib/api-client";
import { ACTIONS } from "@/lib/api-client/constant";
import { getMyInfo } from "@/utils/auth";
import { getCookie } from "cookies-next";

const useBookingListPendingHook = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [userId, setUserId] = useState(null);

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

  // Fetch pending bookings when userId is available
  useEffect(() => {
    if (userId) {
      fetchPendingBookings(userId);
    }
  }, [userId]);

  const fetchPendingBookings = async (id) => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching pending bookings for user:", id);

      // Get authentication token
      const token = getCookie("token");
      const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await APIClient.invoke({
        action: ACTIONS.GET_CUSTOMER_PENDING_BOOKINGS,
        pathParams: { userId: id },
        headers: authHeaders,
        options: { preventRedirect: true },
      });

      console.log("Pending bookings response:", response);

      if (response && response.success && response.result) {
        setData(response.result);
      } else {
        setData([]);

        if (response && !response.success) {
          setError(response.message || "Failed to fetch pending bookings");
        }
      }
    } catch (err) {
      console.error("Error fetching pending bookings:", err);
      setError("Failed to fetch pending bookings. Please try again later.");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshPendingBookings = () => {
    if (userId) {
      fetchPendingBookings(userId);
    }
  };

  return {
    loading,
    error,
    data,
    refreshPendingBookings,
  };
};

export default useBookingListPendingHook;
