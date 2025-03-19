import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "@/lib/api-client/constant";
import { getCookie } from "cookies-next";

export const useTherapistSchedule = (therapistId, month) => {
  const token = getCookie("token");

  return useQuery({
    queryKey: ["therapistSchedule", therapistId, month],
    queryFn: async () => {
      const response = await axios.get(
        `${API_URL}/schedule/therapist/month/${therapistId}/${month}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
    enabled: !!therapistId && !!month && !!token,
  });
};
