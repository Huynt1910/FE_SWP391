import { useMutation, useQueryClient } from "@tanstack/react-query";
import { APIClient } from "@/lib/api-client";
import { getCookie } from "cookies-next";
import { ACTIONS } from "@/lib/api-client/constant";

export const useCheckoutBooking = () => {
  const token = getCookie("token");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bookingId }) => {
      const response = await APIClient.invoke({
        action: ACTIONS.CHECKOUT_BOOKING,
        pathParams: { id: bookingId },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response && response.success === true) {
        return response.result;
      }

      throw new Error(response.message || "Lỗi khi thanh toán booking");
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["bookings"]);
    },
    onError: (error) => {
      console.error("Lỗi khi thanh toán booking:", error);
    },
  });
};
