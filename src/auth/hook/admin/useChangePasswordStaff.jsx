import { useMutation } from "@tanstack/react-query";
import { APIClient } from "@/lib/api-client";
import { ACTIONS } from "@/lib/api-client/constant";
import { getCookie } from "cookies-next";

export const useChangePassword = () => {
  const token = getCookie("token");

  return useMutation({
    mutationFn: async (data) => {
      const response = await APIClient.invoke({
        action: ACTIONS.CHANGE_PASSWORD_STAFF,
        headers: { Authorization: `Bearer ${token}` },
        data,
      });

      if (response && response.success === true) {
        return response.result;
      }

      throw new Error(response.message || "Lỗi khi đổi mật khẩu");
    },
  });
};
