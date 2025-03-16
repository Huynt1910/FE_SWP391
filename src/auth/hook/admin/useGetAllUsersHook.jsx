import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getCookie } from "cookies-next";
import { API_URL } from "@/lib/api-client/constantAdmin";

export function useGetAllUsers() {
  const token = getCookie("token");

  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      try {
        const response = await axios.get(`${API_URL}/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.data.success) {
          throw new Error("Failed to fetch users");
        }

        return response.data.result || [];
      } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
      }
    },
  });
}
