import { useQuery } from "@tanstack/react-query";
import { APIClient } from "@/lib/api-client";
import { useTherapistProfile } from "@/auth/hook/admin/useTherapistProfile";
import { ACTIONS } from "@/lib/api-client/constant";
import { getCookie } from "cookies-next"; // Thêm dòng này

export const useTherapistFeedback = () => {
  const { data: therapistProfile } = useTherapistProfile();
  const therapistId = therapistProfile?.id;
  const token = getCookie("token"); // Lấy token từ cookie

  return useQuery({
    queryKey: ["therapistFeedback", therapistId],
    queryFn: async () => {
      if (!therapistId) {
        throw new Error("Therapist ID is not available");
      }

      const response = await APIClient.invoke({
        action: ACTIONS.GET_THERAPIST_FEEDBACK,
        headers: { Authorization: `Bearer ${token}` },
        pathParams: { id: therapistId },
      });

      if (response && response.success === true) {
        return response.result;
      }

      throw new Error(response.message || "Lỗi khi tải đánh giá");
    },
    enabled: !!therapistId,
  });
};
