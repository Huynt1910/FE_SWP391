import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getCookie } from "cookies-next";
import { API_URL } from "@/lib/api-client/constantAdmin";

export function useGetAllStaffs() {
  const token = getCookie("token");

  return useQuery({
    queryKey: ["staffs"],
    queryFn: async () => {
      try {
        const response = await axios.get(`${API_URL}/staffs`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.data.success) {
          throw new Error("Failed to fetch staffs");
        }

        return response.data.result || [];
      } catch (error) {
        console.error("Error fetching staffs:", error);
        throw error;
      }
    },
  });
}
