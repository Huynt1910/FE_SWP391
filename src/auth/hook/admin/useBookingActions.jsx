import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { APIClient } from "@/lib/api-client";
import { ACTIONS } from "@/lib/api-client/constant";
import { getCookie } from "cookies-next";
import { toast } from "react-toastify";

export const useBookingActions = () => {
  const token = getCookie("token");
  const queryClient = useQueryClient(); // Lấy queryClient từ react-query

  const authHeaders = {
    Authorization: `Bearer ${token}`,
  };

  // Tạo booking
  const createBookingStaff = useMutation({
    mutationFn: async (bookingData) => {
      const response = await APIClient.invoke({
        action: ACTIONS.CREATE_BOOKING_STAFF,
        data: bookingData,
        headers: authHeaders,
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["bookings"]); // Làm mới danh sách booking
    },
    onError: (error) => {
      toast.error(error.message || "Có lỗi khi thêm lịch hẹn!");
    },
  });

  // Cập nhật booking
  const updateBooking = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await APIClient.invoke({
        action: ACTIONS.UPDATE_BOOKING,
        pathParams: { id },
        data,
        headers: authHeaders,
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["bookings"]); // Làm mới danh sách booking
    },
    onError: (error) => {
      toast.error(error.message || "Có lỗi khi cập nhật!");
    },
  });

  // Check-in booking
  const checkInBooking = useMutation({
    mutationFn: async (bookingId) => {
      const response = await APIClient.invoke({
        action: ACTIONS.CHECK_IN_BOOKING,
        pathParams: { id: bookingId },
        headers: authHeaders,
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["bookings"]); // Làm mới danh sách booking
    },
    onError: (error) => {
      toast.error(error.message || "Có lỗi khi check-in!");
    },
  });

  // Hoàn tất booking
  const completeBooking = async (bookingId) => {
    try {
      const response = await APIClient.invoke({
        action: ACTIONS.FINISH_BOOKING,
        pathParams: { id: bookingId },
        headers: authHeaders,
      });
      queryClient.invalidateQueries(["bookings"]); // Làm mới danh sách booking
      return response.result;
    } catch (error) {
      toast.error("Có lỗi khi hoàn thành dịch vụ!");
    }
  };

  // // Thanh toán booking
  // const checkoutBooking = async (bookingId) => {
  //   try {
  //     const response = await APIClient.invoke({
  //       action: ACTIONS.CHECKOUT_BOOKING,
  //       pathParams: { id: bookingId },
  //       headers: authHeaders,
  //     });

  //     if (response.success) {
  //       queryClient.invalidateQueries(["bookings"]); // Làm mới danh sách booking
  //       return response;
  //     } else {
  //       throw new Error(response.message || "Có lỗi khi thanh toán!");
  //     }
  //   } catch (error) {
  //     console.error("Error during checkout:", error);
  //     throw error;
  //   }
  // };

  return {
    createBookingStaff: createBookingStaff.mutateAsync,
    updateBooking: updateBooking.mutateAsync,
    checkInBooking: checkInBooking.mutateAsync,
    completeBooking,
    // checkoutBooking,
  };
};
