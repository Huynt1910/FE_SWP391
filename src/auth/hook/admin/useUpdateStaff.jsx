import { useMutation, useQueryClient } from "@tanstack/react-query";
import { APIClient } from "@/lib/api-client";
import { ACTIONS } from "@/lib/api-client/constant";
import { getCookie } from "cookies-next";

export const useUpdateStaff = () => {
  const token = getCookie("token");
  const queryClient = useQueryClient(); // Khởi tạo queryClient

  return useMutation({
    mutationFn: async ({ staffId, data }) => {
      const response = await APIClient.invoke({
        action: ACTIONS.UPDATE_STAFF,
        pathParams: { staffId },
        headers: { Authorization: `Bearer ${token}` },
        data,
      });

      if (response && response.success === true) {
        return response.result;
      }

      console.log("Response:", response);
      throw new Error(response.message || "Lỗi khi cập nhật thông tin staff");
    },
    onSuccess: () => {
      // Làm mới query liên quan sau khi mutation thành công
      queryClient.invalidateQueries(["staffInfo"]); // Thay "staffInfo" bằng key của query cần làm mới
    },
    onError: (error) => {
      console.error("Lỗi khi cập nhật thông tin staff:", error);
    },
  });
};
