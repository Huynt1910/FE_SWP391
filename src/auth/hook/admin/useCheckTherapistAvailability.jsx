import { useState } from "react";
import { APIClient } from "@/lib/api-client";
import { ACTIONS } from "@/lib/api-client/constant";

export const useCheckTherapistAvailability = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [therapists, setTherapists] = useState([]);

  const checkTherapistAvailability = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await APIClient.invoke({
        action: ACTIONS.CHECK_THERAPIST_AVAILABILITY, // Đảm bảo action này đúng
        data: payload,
      });

      if (response.success && Array.isArray(response.result)) {
        setTherapists(response.result);
      } else {
        setTherapists([]);
        throw new Error(response.message || "Không có chuyên viên khả dụng");
      }
    } catch (err) {
      setError(err.message || "Lỗi khi kiểm tra chuyên viên");
      setTherapists([]);
    } finally {
      setLoading(false);
    }
  };

  return { therapists, loading, error, checkTherapistAvailability };
};

export default useCheckTherapistAvailability;
