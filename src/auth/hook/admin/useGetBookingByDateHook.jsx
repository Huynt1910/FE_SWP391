import { useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import { APIClient } from "@/lib/api-client";
import { ACTIONS } from "@/lib/api-client/constant";

export const useBookingsByDate = (date) => {
  const token = getCookie("token");

  const authHeaders = {
    Authorization: `Bearer ${token}`,
  };

  return useQuery({
    queryKey: ["bookings", { date }],
    queryFn: async () => {
      const response = await APIClient.invoke({
        action: ACTIONS.GET_BOOKING_BY_DATE,
        pathParams: { date },
        headers: authHeaders,
      });
      return response.result || [];
    },
    enabled: !!date, // Chỉ fetch khi có ngày
  });
};
