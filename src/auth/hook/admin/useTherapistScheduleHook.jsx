import { useQuery } from "@tanstack/react-query";
import { APIClient } from "@/lib/api-client";
import { ACTIONS } from "@/lib/api-client/constant";
import { useTherapistProfile } from "@/auth/hook/admin/useTherapistProfile";

export const useTherapistSchedule = (month) => {
  // Lấy thông tin therapist từ hook useTherapistProfile
  const {
    data: therapistProfile,
    isLoading: isProfileLoading,
    error: profileError,
  } = useTherapistProfile();
  const therapistId = therapistProfile?.id;

  // Sử dụng useQuery để lấy lịch làm việc
  return useQuery({
    queryKey: ["therapistSchedule", therapistId, month],
    queryFn: async () => {
      if (!therapistId || !month) {
        throw new Error("Therapist ID or month is not provided");
      }

      const response = await APIClient.invoke({
        action: ACTIONS.GET_THERAPIST_SCHEDULE_BY_MONTH,
        pathParams: { id: therapistId, month },
      });

      if (response && response.success === true) {
        return response.result;
      }

      throw new Error(response.message || "Lỗi khi tải lịch làm việc");
    },
    enabled: !!therapistId && !!month, // Chỉ chạy query nếu therapistId và month tồn tại
    isLoading: isProfileLoading, // Kế thừa trạng thái loading từ useTherapistProfile
    error: profileError, // Kế thừa lỗi từ useTherapistProfile
  });
};
