import { useMutation } from "@tanstack/react-query";
import { APIClient } from "@/lib/api-client";
import { toast } from "react-toastify";
import { ACTIONS } from "@/lib/api-client/constant";
import { useQueryClient } from "@tanstack/react-query";

export const useUpdateBooking = () => {
  const queryClient = useQueryClient(); // Lấy queryClient từ react-query

  const updateBooking = useMutation({
    mutationFn: async ({ bookingId, payload }) => {
      const response = await APIClient.invoke({
        action: ACTIONS.UPDATE_BOOKING,
        pathParams: { id: bookingId },
        data: payload,
      });

      if (!response.success) {
        throw new Error(response.message || "Cập nhật lịch hẹn thất bại!");
      }

      return response;
    },
    onSuccess: () => {
      toast.success("Cập nhật lịch hẹn thành công!");
      queryClient.invalidateQueries(["bookings"]); // Làm mới danh sách booking
    },
    onError: (error) => {
      toast.error(error.message || "Lỗi khi cập nhật lịch hẹn!");
    },
  });

  return updateBooking;
};

export default useUpdateBooking;
