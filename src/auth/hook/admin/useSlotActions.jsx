import { useQuery } from "@tanstack/react-query";
import { APIClient } from "@/lib/api-client";
import { ACTIONS } from "@/lib/api-client/constant";
import { API_URL } from "@/lib/api-client/constant";
import { getCookie } from "cookies-next";

export const useSlotActions = () => {
  const token = getCookie("token");

  const authHeaders = {
    Authorization: `Bearer ${token}`,
  };

  const {
    data: slots,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["slots"],
    queryFn: async () => {
      const response = await APIClient.invoke({
        action: ACTIONS.GET_ALL_SLOTS,
        headers: authHeaders,
      });
      return response.result || [];
    },
  });

  return {
    slots,
  };
};
