import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "@/lib/api-client/constant";
import { getCookie } from "cookies-next";
import { decodeToken } from "@/utils/jwtDecode";

export const useTherapistProfile = () => {
  const token = getCookie("token");
  const decodedToken = token ? decodeToken(token) : null;
  const therapistId = decodedToken?.therapistId;

  return useQuery({
    queryKey: ["therapistProfile", therapistId],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/therapists/${therapistId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    enabled: !!therapistId && !!token,
  });
};
