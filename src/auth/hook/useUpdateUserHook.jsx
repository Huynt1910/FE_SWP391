import { APIClient } from "@/lib/api-client";
import { ACTIONS } from "@/lib/api-client/constant";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

export function useUpdateUser() {
  const token = getCookie("token");
  const queryClient = useQueryClient(); // Khai báo queryClient

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
    onSuccess: () => {
      // Làm mới dữ liệu sau khi cập nhật thành công
      queryClient.invalidateQueries(["myInfo"]);
    },
  });
}
