import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getCookie } from "cookies-next";
import { API_URL } from "@/lib/api-client/constantAdmin";

export function useGetAllServices() {
  const token = getCookie("token");

  return useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      try {
        const response = await axios.get(`${API_URL}/services`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.data.success) {
          throw new Error("Failed to fetch services");
        }

        return response.data.result || [];
      } catch (error) {
        console.error("Error fetching services:", error);
        throw error;
      }
    },
  });
}
