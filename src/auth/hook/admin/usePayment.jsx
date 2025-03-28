import { useMutation } from "@tanstack/react-query";
import { APIClient } from "@/lib/api-client";
import { getCookie } from "cookies-next";
import { ACTIONS } from "@/lib/api-client/constant";

export const usePayment = () => {
  const token = getCookie("token");

  return useMutation({
    mutationFn: async (bookingId) => {
      const response = await APIClient.invoke({
        action: ACTIONS.GET_QR_VNPAY,
        pathParams: { id: bookingId },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response && response.success === true) {
        return response.result;
      }

      throw new Error(response.message || "Lỗi khi lấy QR VNPAY");
    },
  });
};
