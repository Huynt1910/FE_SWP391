import { useMutation, useQueryClient } from "@tanstack/react-query";
import { APIClient } from "@/lib/api-client";
import { ACTIONS } from "@/lib/api-client/constant";
import { toast } from "react-toastify";

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  const createCustomer = useMutation({
    mutationFn: async (payload) => {
      const response = await APIClient.invoke({
        action: ACTIONS.CREATE_USER_BY_STAFF, // Sử dụng endpoint tạo khách hàng
        data: payload,
      });

      if (!response.success) {
        throw new Error(response.message || "Tạo khách hàng thất bại!");
      }

      return response;
    },
    onSuccess: () => {
      toast.success("Tạo khách hàng thành công!");
      queryClient.invalidateQueries(["customers"]); // Làm mới danh sách khách hàng
    },
    onError: (error) => {
      toast.error(error.message || "Lỗi khi tạo khách hàng!");
    },
  });

  return createCustomer;
};

export default useCreateCustomer;
