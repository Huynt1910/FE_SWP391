import { useMutation } from "@tanstack/react-query";
import { APIClient } from "@/lib/api-client";
import { getCookie } from "cookies-next";
import { ACTIONS } from "@/lib/api-client/constant";

export const useCheckoutTransaction = () => {
  const token = getCookie("token");

  return useMutation({
    mutationFn: async ({ transactionId }) => {
      const response = await APIClient.invoke({
        action: ACTIONS.CHECKOUT_BOOKING_TRANSACTION,
        pathParams: { id: transactionId },
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token trong header
        },
      });

      if (response && response.success === true) {
        return response.result;
      }

      throw new Error(response.message || "Lỗi khi thanh toán booking");
    },
    onError: (error) => {
      console.error("Lỗi khi thanh toán booking:", error);
    },
  });
};
