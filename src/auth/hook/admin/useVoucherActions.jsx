import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "@/lib/api-client/constantAdmin";
import { toast } from "react-toastify";
import { getCookie } from "cookies-next";

export const useVoucherActions = () => {
  const token = getCookie("token");
  const queryClient = useQueryClient();

  const useGetAllVouchers = () => {
    return useQuery({
      queryKey: ["vouchers"],
      queryFn: async () => {
        const response = await axios.get(`${API_URL}/vouchers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
      },
    });
  };

  const useCreateVoucher = () => {
    return useMutation({
      mutationFn: async (data) => {
        const response = await axios.post(`${API_URL}/vouchers`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        return response.data;
      },
      onSuccess: () => {
        toast.success("Tạo voucher thành công!");
        queryClient.invalidateQueries(["vouchers"]);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Có lỗi xảy ra!");
      },
    });
  };

  const useActivateVoucher = () => {
    return useMutation({
      mutationFn: async (id) => {
        const response = await axios.put(
          `${API_URL}/vouchers/active/${id}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        return response.data;
      },
      onSuccess: () => {
        toast.success("Kích hoạt voucher thành công!");
        queryClient.invalidateQueries(["vouchers"]);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Có lỗi xảy ra!");
      },
    });
  };

  const useDeactivateVoucher = () => {
    return useMutation({
      mutationFn: async (id) => {
        const response = await axios.put(
          `${API_URL}/vouchers/deactive/${id}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        return response.data;
      },
      onSuccess: () => {
        toast.success("Ngưng kích hoạt voucher thành công!");
        queryClient.invalidateQueries(["vouchers"]);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Có lỗi xảy ra!");
      },
    });
  };

  const useUpdateVoucher = () => {
    return useMutation({
      mutationFn: async ({ id, data }) => {
        const response = await axios.put(
          `${API_URL}/vouchers/update/${id}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        return response.data;
      },
      onSuccess: () => {
        toast.success("Cập nhật voucher thành công!");
        queryClient.invalidateQueries(["vouchers"]);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Có lỗi xảy ra!");
      },
    });
  };

  return {
    useGetAllVouchers,
    useCreateVoucher,
    useUpdateVoucher, // Make sure to export the function
    useActivateVoucher,
    useDeactivateVoucher,
  };
};
