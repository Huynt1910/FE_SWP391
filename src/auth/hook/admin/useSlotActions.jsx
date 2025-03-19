import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "@/lib/api-client/constant";
import { getCookie } from "cookies-next";

export const useSlotActions = (selectedDate) => {
  const token = getCookie("token");

  const getAvailableSlots = useQuery({
    queryKey: ["slots", selectedDate],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/slot/${selectedDate}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    enabled: !!selectedDate,
  });

  return { getAvailableSlots };
};
