import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "@/lib/api-client/constantAdmin";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { getCookie } from "cookies-next";

export const useScheduleActions = () => {
  const token = getCookie("token");
  const queryClient = useQueryClient();

  const useGetScheduleByDate = (date) => {
    return useQuery({
      queryKey: ["schedules", date],
      queryFn: async () => {
        const formattedDate = format(date, "yyyy-MM-dd");
        try {
          const response = await axios.get(
            `${API_URL}/schedule/therapist/${formattedDate}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          console.log("API Response:", response.data); // Log the response
          return response.data;
        } catch (error) {
          console.error("API Error:", error);
          throw error;
        }
      },
      enabled: !!date,
      refetchOnWindowFocus: false,
    });
  };

  const useGetScheduleByTherapistId = (therapistId) => {
    return useQuery({
      queryKey: ["therapistSchedule", therapistId],
      queryFn: async () => {
        const response = await axios.get(
          `${API_URL}/schedule/therapist/getById/${therapistId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        return response.data;
      },
      enabled: !!therapistId,
    });
  };

  const useCreateSchedule = () => {
    return useMutation({
      mutationFn: async (data) => {
        const response = await axios.post(
          `${API_URL}/schedule/therapist`,
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
        toast.success("Tạo lịch làm việc thành công!");
        queryClient.invalidateQueries(["schedules"]);
        queryClient.invalidateQueries(["therapistSchedule"]);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Có lỗi xảy ra!");
      },
    });
  };

  const useUpdateSchedule = () => {
    return useMutation({
      mutationFn: async ({ id, data }) => {
        const response = await axios.put(
          `${API_URL}/schedule/therapist/update/${id}`,
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
        toast.success("Cập nhật lịch làm việc thành công!");
        queryClient.invalidateQueries(["schedules"]);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Có lỗi xảy ra!");
      },
    });
  };

  const useDeleteSchedule = () => {
    return useMutation({
      mutationFn: async (id) => {
        const response = await axios.delete(
          `${API_URL}/schedule/therapist/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        return response.data;
      },
      onSuccess: () => {
        toast.success("Xóa lịch làm việc thành công!");
        queryClient.invalidateQueries(["schedules"]);
        queryClient.invalidateQueries(["therapistSchedule"]);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Có lỗi xảy ra!");
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
