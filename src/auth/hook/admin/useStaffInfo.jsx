import { useQuery } from "@tanstack/react-query";
import { APIClient } from "@/lib/api-client";
import { ACTIONS } from "@/lib/api-client/constant";
import { getCookie } from "cookies-next";

export const useStaffInfo = () => {
  const token = getCookie("token");
  const authHeaders = {
    Authorization: `Bearer ${token}`,
  };

  const { data: staffInfo, isLoading } = useQuery({
    queryKey: ["staffInfo"],
    queryFn: async () => {
      const response = await APIClient.invoke({
        action: ACTIONS.GET_STAFF_INFO,
        headers: authHeaders,
      });
      return response.result;
    },
  });

  return { staffInfo, isLoading };
};
