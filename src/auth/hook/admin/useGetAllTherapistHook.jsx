import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getCookie } from "cookies-next";
import { API_URL } from "@/lib/api-client/constantAdmin";

export function useGetAllTherapists() {
  const token = getCookie("token");

  return useQuery({
    queryKey: ["therapists"],
    queryFn: async () => {
      try {
        const response = await axios.get(`${API_URL}/therapists`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.data.success) {
          throw new Error("Failed to fetch therapists");
        }

        return response.data.result || [];
      } catch (error) {
        console.error("Error fetching therapists:", error);
        throw error;
      }
    },
  });
}
