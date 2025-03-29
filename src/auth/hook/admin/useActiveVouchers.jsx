import { useQuery } from "@tanstack/react-query";
import { APIClient } from "@/lib/api-client";
import { ACTIONS } from "@/lib/api-client/constant";

export const useActiveVouchers = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["activeVouchers"],
    queryFn: async () => {
      const response = await APIClient.invoke({
        action: ACTIONS.GET_ACTIVE_VOUCHERS,
      });

      if (!response.success) {
        throw new Error(
          response.message || "Không thể lấy danh sách voucher active"
        );
      }

      return response.result || [];
    },
  });

  return {
    vouchers: data,
    isLoading,
    error,
  };
};
