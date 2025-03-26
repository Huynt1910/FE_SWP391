import { APIClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import { ACTIONS } from "@/lib/api-client/constant";
import { getCookie } from "cookies-next";

export function useTherapistProfile() {
  const token = getCookie("token");

  return useQuery({
    queryKey: ["therapistProfile", token],
    queryFn: async () => {
      const response = await APIClient.invoke({
        action: ACTIONS.THERAPIST_PROFILE, // Sử dụng action phù hợp
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response && response.success === true) {
        return response.result; // Trả về dữ liệu profile
      }

      throw new Error(response.message || "Lỗi khi lấy thông tin therapist");
    },
    enabled: !!token, // Chỉ chạy query nếu token tồn tại
  });
}
