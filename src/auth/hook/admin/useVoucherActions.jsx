import { useQuery, useMutation } from "@tanstack/react-query";
import { APIClient } from "@/lib/api-client";
import { ACTIONS } from "@/lib/api-client/constant";
import { toast } from "react-toastify";
import { getCookie } from "cookies-next";

export const useVoucherActions = () => {
  const token = getCookie("token");
  const authHeaders = {
    Authorization: `Bearer ${token}`,
  };

  const {
    data: vouchers,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["vouchers"],
    queryFn: async () => {
      const response = await APIClient.invoke({
        action: ACTIONS.GET_ALL_VOUCHERS,
        headers: authHeaders,
      });
      return response.result || [];
    },
  });

  const createVoucher = useMutation({
    mutationFn: async (voucherData) => {
      const response = await APIClient.invoke({
        action: ACTIONS.CREATE_VOUCHER,
        data: voucherData,
        headers: authHeaders,
      });
      return response;
    },
    onSuccess: () => {
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Có lỗi xảy ra khi tạo voucher!");
    },
  });

  const updateVoucher = useMutation({
    mutationFn: async ({ voucherId, data }) => {
      const response = await APIClient.invoke({
        action: ACTIONS.UPDATE_VOUCHER,
        pathParams: { id: voucherId },
        data,
        headers: authHeaders,
      });
      return response;
    },
    onSuccess: () => {
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Có lỗi xảy ra khi cập nhật!");
    },
  });

  const deactivateVoucher = useMutation({
    mutationFn: async (voucherId) => {
      const response = await APIClient.invoke({
        action: ACTIONS.DEACTIVATE_VOUCHER,
        pathParams: { id: voucherId },
        headers: authHeaders,
      });
      return response;
    },
    onSuccess: () => {
      toast.success("Đã ngưng hoạt động voucher thành công!");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Có lỗi xảy ra!");
    },
  });

  const activateVoucher = useMutation({
    mutationFn: async (voucherId) => {
      const response = await APIClient.invoke({
        action: ACTIONS.ACTIVATE_VOUCHER,
        pathParams: { id: voucherId },
        headers: authHeaders,
      });
      return response;
    },
    onSuccess: () => {
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Có lỗi xảy ra!");
    },
  });

  return {
    vouchers,
    isLoading,
    createVoucher: createVoucher.mutate,
    updateVoucher: updateVoucher.mutate,
    deactivateVoucher: deactivateVoucher.mutate,
    activateVoucher: activateVoucher.mutate,
  };
};
