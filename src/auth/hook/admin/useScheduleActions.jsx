import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { APIClient } from "@/lib/api-client";
import { ACTIONS } from "@/lib/api-client/constant";
import { format } from "date-fns";
import { getCookie } from "cookies-next";
import { toast } from "react-toastify";

export const useScheduleActions = () => {
  const token = getCookie("token");
  const queryClient = useQueryClient();
  const authHeaders = {
    Authorization: `Bearer ${token}`,
  };

  const useGetScheduleByDate = (date) => {
    return useQuery({
      queryKey: ["schedules", date],
      queryFn: async () => {
        const formattedDate = format(date, "yyyy-MM-dd");
        const response = await APIClient.invoke({
          action: ACTIONS.GET_THERAPIST_SCHEDULE_BY_DATE,
          pathParams: { date: formattedDate },
          headers: authHeaders,
        });
        return response.result;
      },
      enabled: !!date,
      refetchOnWindowFocus: false,
    });
  };

  const useGetScheduleByTherapistId = (therapistId) => {
    return useQuery({
      queryKey: ["therapistSchedule", therapistId],
      queryFn: async () => {
        const response = await APIClient.invoke({
          action: ACTIONS.GET_THERAPIST_SCHEDULE_BY_ID,
          pathParams: { id: therapistId },
          headers: authHeaders,
        });
        return response.result;
      },
      enabled: !!therapistId,
    });
  };

  const useCreateSchedule = () => {
    return useMutation({
      mutationFn: async (data) => {
        const response = await APIClient.invoke({
          action: ACTIONS.CREATE_THERAPIST_SCHEDULE,
          data,
          headers: authHeaders,
        });

        // Kiểm tra trường success trong response
        if (!response.success) {
          throw new Error(response.message);
        }
        return response.result;
      },
      onSuccess: () => {
        queryClient.invalidateQueries(["schedules"]);
        queryClient.invalidateQueries(["therapistSchedule"]);
      },
    });
  };

  const useUpdateSchedule = (id) => {
    return useMutation({
      mutationFn: async ({ id, data }) => {
        const response = await APIClient.invoke({
          action: ACTIONS.UPDATE_THERAPIST_SCHEDULE,
          pathParams: { id }, // This will replace :id in the path with actual id
          data: data, // Sending only the data without id
          headers: authHeaders,
        });
        if (!response.success) {
          throw new Error(response.message);
        }
        return response.result;
      },
      onSuccess: () => {
        queryClient.invalidateQueries(["schedules"]);
        queryClient.invalidateQueries(["therapistSchedule"]);
      },
    });
  };

  const useDeleteSchedule = () => {
    return useMutation({
      mutationFn: async (id) => {
        const response = await APIClient.invoke({
          action: ACTIONS.DELETE_THERAPIST_SCHEDULE,
          pathParams: { id },
          headers: authHeaders,
        });
        return response.result;
      },
      onSuccess: () => {
        toast.success("Xóa lịch làm việc thành công!");
        queryClient.invalidateQueries(["schedules"]);
        queryClient.invalidateQueries(["therapistSchedule"]);
      },
      onError: (error) => {
        toast.error(error.message || "Có lỗi xảy ra khi xóa lịch!");
        console.error("Delete schedule error:", error);
      },
    });
  };

  return {
    useGetScheduleByDate,
    useGetScheduleByTherapistId,
    useCreateSchedule,
    useUpdateSchedule,
    useDeleteSchedule,
  };
};
