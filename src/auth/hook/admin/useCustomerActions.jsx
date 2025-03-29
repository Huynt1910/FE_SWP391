import { useQuery, useMutation } from "@tanstack/react-query";
import { APIClient } from "@/lib/api-client";
import { ACTIONS } from "@/lib/api-client/constant";
import { toast } from "react-toastify";
import { getCookie } from "cookies-next";

export const useCustomerActions = () => {
  const token = getCookie("token");
  const authHeaders = {
    Authorization: `Bearer ${token}`,
  };

  const {
    data: customers,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const response = await APIClient.invoke({
        action: ACTIONS.GET_ALL_USERS,
        headers: authHeaders,
      });
      return response.result || [];
    },
  });

  // Add reset password mutation
  const resetPassword = useMutation({
    mutationFn: async ({ userId, passwordData }) => {
      console.log("Resetting password for user:", userId);
      const response = await APIClient.invoke({
        action: ACTIONS.RESET_USER_PASSWORD,
        pathParams: { id: userId },
        data: passwordData,
        headers: authHeaders,
      });
      return response;
    },
    // onSuccess: () => {
    //   toast.success("Đặt lại mật khẩu thành công!");
    // },
    onError: (error) => {
      toast.error("Có lỗi xảy ra khi đặt lại mật khẩu!");
      console.error(error);
    },
  });

  const activateCustomer = useMutation({
    mutationFn: async (userId) => {
      console.log("Activating user with ID:", userId);
      const response = await APIClient.invoke({
        action: ACTIONS.ACTIVATE_USER,
        pathParams: { id: userId },
        headers: authHeaders,
      });
      return response;
    },
    onSuccess: () => {
      toast.success("Đã kích hoạt tài khoản thành công!");
      refetch();
    },
    onError: (error) => {
      toast.error("Có lỗi xảy ra khi kích hoạt tài khoản!");
      console.error(error);
    },
  });

  const deactivateCustomer = useMutation({
    mutationFn: async (userId) => {
      console.log("Deactivating user with ID:", userId);
      const response = await APIClient.invoke({
        action: ACTIONS.DEACTIVATE_USER,
        pathParams: { id: userId },
        headers: authHeaders,
      });
      return response;
    },
    onSuccess: () => {
      toast.success("Đã ngưng hoạt động tài khoản thành công!");
      refetch();
    },
    onError: (error) => {
      toast.error("Có lỗi xảy ra khi ngưng hoạt động tài khoản!");
      console.error(error);
    },
  });

  return {
    customers,
    isLoading,
    activateCustomer: activateCustomer.mutate,
    deactivateCustomer: deactivateCustomer.mutate,
    resetPassword: resetPassword.mutate,
  };
};
