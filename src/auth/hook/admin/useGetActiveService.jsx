import { useQuery } from "@tanstack/react-query";
import { APIClient } from "@/lib/api-client";
import { ACTIONS } from "@/lib/api-client/constant";

export const useGetActiveService = () => {
  return useQuery({
    queryKey: ["activeServices"],
    queryFn: async () => {
      console.log("🔄 Gọi API lấy danh sách dịch vụ...");
      const response = await APIClient.invoke({
        action: ACTIONS.GET_ACTIVE_SERVICES,
      });

      console.log("📢 API Response:", response);

      if (response.success && Array.isArray(response.result)) {
        console.log("✅ Dữ liệu hợp lệ:", response.result);
        console.log("📝 Danh sách dịch vụ trong modal:", response.result);
        return response.result; // Trả về mảng dịch vụ
      }
      throw new Error(response.message || "❌ Failed to fetch active services");
    },
    staleTime: 0,
    cacheTime: 0,
  });
};
