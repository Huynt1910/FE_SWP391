import { APIClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import { ACTIONS } from "@lib/api-client/constant";
export function useMyInfo() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await APIClient.invoke({ action: ACTIONS.GET_SELF });

      if (response.status_code === 200) {
        return { profile: response.data }; // ✅ Trả về object chứa `profile`
      }

      throw new Error(response.data.message || "Lỗi khi lấy thông tin cá nhân");
    },
  });
}
