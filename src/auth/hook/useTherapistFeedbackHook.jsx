import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "@/lib/api-client/constant";
import { getCookie } from "cookies-next";

export const useTherapistFeedback = (therapistId) => {
  const token = getCookie("token");

  return useQuery({
    queryKey: ["therapistFeedback", therapistId],
    queryFn: async () => {
      const response = await axios.get(
        `${API_URL}/feedback/therapist/${therapistId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
    enabled: !!therapistId && !!token,
  });
};
