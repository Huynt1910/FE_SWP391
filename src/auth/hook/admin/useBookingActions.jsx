import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { APIClient } from "@/lib/api-client";
import { ACTIONS } from "@/lib/api-client/constant";
import { getCookie } from "cookies-next";
import { toast } from "react-toastify";

export const useBookingActions = ({ setInvoiceData, setShowInvoiceModal }) => {
  const token = getCookie("token");
  const queryClient = useQueryClient();

  const authHeaders = {
    Authorization: `Bearer ${token}`,
  };

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
      toast.success("Thêm lịch hẹn thành công!");
      queryClient.invalidateQueries(["bookings"]);
    },
    onError: (error) => {
      toast.error(error.message || "Có lỗi khi thêm lịch hẹn!");
    },
  });

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
      toast.success("Cập nhật thành công!");
      queryClient.invalidateQueries(["bookings"]);
    },
    onError: (error) => {
      toast.error(error.message || "Có lỗi khi cập nhật!");
    },
  });

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
      toast.success("Check-in thành công!");
      queryClient.invalidateQueries(["bookings"]);
    },
    onError: (error) => {
      toast.error(error.message || "Có lỗi khi check-in!");
    },
  });

  const completeBooking = (bookingId) => {
    const { data, isLoading, error } = useQuery(
      ["completeBooking", bookingId],
      async () => {
        const response = await APIClient.invoke({
          action: ACTIONS.COMPLETE_BOOKING,
          pathParams: { id: bookingId },
          headers: authHeaders,
        });
        return response.result;
      },
      {
        enabled: !!bookingId, // Only fetch if bookingId is provided
        onSuccess: (response) => {
          toast.success("Hoàn thành dịch vụ thành công!");
          setInvoiceData(response); // Set invoice data
          setShowInvoiceModal?.(true); // Show the invoice modal
        },
        onError: (error) => {
          toast.error(error.message || "Có lỗi khi hoàn thành dịch vụ!");
        },
      }
    );

    return { data, isLoading, error };
  };

  const checkoutBooking = async (bookingId, method) => {
    try {
      if (method === "cash") {
        // Tiền mặt: gọi API checkout luôn
        await APIClient.invoke.put("/booking/checkout", null, {
          params: { bookingId },
          headers: authHeaders,
        });
        toast.success("Thanh toán tiền mặt thành công!");
        queryClient.invalidateQueries(["bookings"]);
      } else if (method === "banking") {
        // Chuyển khoản: lấy QR VNPay trước
        const res = await APIClient.invoke.get(`/payment/${bookingId}`, {
          headers: authHeaders,
        });

        const vnpayUrl = res?.data?.url;
        if (!vnpayUrl) {
          toast.error("Không lấy được link thanh toán!");
          return;
        }

        // Mở tab thanh toán
        window.open(vnpayUrl, "_blank");
        toast.info("Vui lòng hoàn tất thanh toán qua VNPay.");

        // Yêu cầu người dùng nhập mã giao dịch sau khi thanh toán
        const transactionId = prompt(
          "Nhập mã giao dịch (transactionId) sau khi thanh toán:"
        );

        if (!transactionId) {
          toast.warning("Bạn chưa nhập mã giao dịch!");
          return;
        }

        // Gọi checkout kèm transactionId
        await APIClient.invoke.put("/booking/checkout", null, {
          params: { bookingId, transactionId },
          headers: authHeaders,
        });

        toast.success("Thanh toán chuyển khoản thành công!");
        queryClient.invalidateQueries(["bookings"]);
      }
    } catch (error) {
      toast.error(error.message || "Thanh toán thất bại!");
    }
  };

  return {
    createBookingStaff: createBookingStaff.mutateAsync,
    updateBooking: updateBooking.mutateAsync,
    checkInBooking: checkInBooking.mutateAsync,
    completeBooking,
    checkoutBooking,
  };
};
