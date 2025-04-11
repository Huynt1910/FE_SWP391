import { useQuery, useMutation } from "@tanstack/react-query";
import { APIClient } from "@/lib/api-client";
import { ACTIONS } from "@/lib/api-client/constant";
import { toast } from "react-toastify";
import { getCookie } from "cookies-next";

export const useStaffActions = () => {
  const token = getCookie("token");
  const authHeaders = {
    Authorization: `Bearer ${token}`,
  };

  const {
    data: staffs,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["staffs"],
    queryFn: async () => {
      const response = await APIClient.invoke({
        action: ACTIONS.GET_ALL_STAFFS,
        headers: authHeaders,
      });
      return response.result || [];
    },
  });

  const createStaff = useMutation({
    mutationFn: async (staffData) => {
      const response = await APIClient.invoke({
        action: ACTIONS.CREATE_STAFF,
        data: staffData,
        headers: authHeaders,
      });
      return response;
    },
    onSuccess: () => {
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Có lỗi xảy ra khi thêm nhân viên!");
    },
  });

  const updateStaff = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await APIClient.invoke({
        action: ACTIONS.UPDATE_STAFF,
        pathParams: { id },
        data,
        headers: authHeaders,
      });
      return response;
    },
    onSuccess: () => {
      toast.success("Cập nhật thông tin thành công!");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Có lỗi xảy ra khi cập nhật!");
    },
  });

  const deactivateStaff = useMutation({
    mutationFn: async (id) => {
      const response = await APIClient.invoke({
        action: ACTIONS.DEACTIVATE_STAFF,
        pathParams: { id },
        headers: authHeaders,
      });
      return response;
    },
    onSuccess: () => {
      toast.success("Đã ngưng hoạt động tài khoản thành công!");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Có lỗi xảy ra!");
    },
  });

  const activateStaff = useMutation({
    mutationFn: async (id) => {
      const response = await APIClient.invoke({
        action: ACTIONS.ACTIVATE_STAFF,
        pathParams: { id },
        headers: authHeaders,
      });
      return response;
    },
    onSuccess: () => {
      toast.success("Đã kích hoạt tài khoản thành công!");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Có lỗi xảy ra!");
    },
  });

  const resetPassword = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await APIClient.invoke({
        action: ACTIONS.RESET_STAFF_PASSWORD,
        pathParams: { id },
        data,
        headers: authHeaders,
      });
      return response;
    },
    onSuccess: () => {
      toast.success("Đặt lại mật khẩu thành công!");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Có lỗi xảy ra khi đặt lại mật khẩu!");
    },
  });

  return {
    staffs,
    isLoading,
    createStaff: createStaff.mutate,
    updateStaff: updateStaff.mutate,
    deactivateStaff: deactivateStaff.mutate,
    activateStaff: activateStaff.mutate,
    resetPassword: resetPassword.mutate,
  };
};
