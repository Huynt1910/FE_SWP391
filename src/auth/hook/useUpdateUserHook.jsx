import { APIClient } from "@/lib/api-client";
import { ACTIONS } from "@/lib/api-client/constant";
import { useMutation } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

export function useUpdateUser() {
  const token = getCookie("token");

  return useMutation({
    mutationFn: async (userData) => {
      console.log("User update request:", userData);

      const response = await APIClient.invoke({
        action: ACTIONS.UPDATE_INFO,
        data: userData,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.success) {
        throw new Error(response.message || "Lỗi khi cập nhật thông tin");
      }

      return response.result;
    },
  });
}
