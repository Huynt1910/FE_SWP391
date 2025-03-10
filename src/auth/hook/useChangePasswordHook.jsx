import { APIClient } from "@/lib/api-client";
import { ACTIONS } from "@/lib/api-client/constant";
import { useMutation } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

export function useChangePassword() {
  const token = getCookie("token");

  return useMutation({
    mutationFn: async (passwordData) => {
      // Validate password data
      const response = await APIClient.invoke({
        action: ACTIONS.CHANGE_PASSWORD,
        data: {
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
          confirmPassword: passwordData.confirmPassword, // Include confirmPassword as required by server
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.success) {
        throw new Error(response.message || "Lỗi khi đổi mật khẩu");
      }

      return response.result;
    },
  });
}
