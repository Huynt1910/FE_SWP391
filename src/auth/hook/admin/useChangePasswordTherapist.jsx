import { useMutation } from "@tanstack/react-query";
import { APIClient } from "@/lib/api-client";
import { ACTIONS } from "@/lib/api-client/constant";
import { getCookie } from "cookies-next";

export const useChangePasswordTherapist = () => {
  const token = getCookie("token");

  return useMutation({
    mutationFn: async (data) => {
      const response = await APIClient.invoke({
        action: ACTIONS.CHANGE_PASSWORD_THERAPIST,
        headers: { Authorization: `Bearer ${token}` },
        data,
      });

      if (response && response.success === true) {
        return response.result;
      }

      throw new Error(response.message || "Lỗi khi đổi mật khẩu therapist");
    },
    onError: (error) => {
      console.error("Lỗi khi đổi mật khẩu therapist:", error);
    },
  });
};
