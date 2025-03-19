import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "@/lib/api-client/constant";
import { getCookie } from "cookies-next";
import { toast } from "react-toastify";

export const useBookingActions = (selectedDate) => {
  const token = getCookie("token");
  const queryClient = useQueryClient();

  // Get all bookings
  const getAllBookings = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/booking/getallBooking`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Bookings response:", response.data);
      return response.data;
    },
  });

  // Get all services
  const getAllServices = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/services`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Services response:", response.data);
      return response.data;
    },
  });

  // Get available therapists for selected date
  const getAvailableTherapists = useQuery({
    queryKey: ["available-therapists", selectedDate],
    queryFn: async () => {
      const response = await axios.get(
        `${API_URL}/schedule/therapist/${selectedDate}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Therapists response:", response.data);
      return response.data;
    },
    enabled: !!selectedDate,
  });

  // Get active vouchers
  const getActiveVouchers = useQuery({
    queryKey: ["active-vouchers"],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/vouchers/active`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Vouchers response:", response.data);
      return response.data;
    },
  });

  // Get all slots
  const getAllSlots = useQuery({
    queryKey: ["slots"],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/slots`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Slots response:", response.data);
      return response.data;
    },
  });

  // Create booking
  const createBooking = useMutation({
    mutationFn: async (bookingData) => {
      const formattedData = {
        userId: 2,
        slotId: parseInt(bookingData.slotId),
        bookingDate: bookingData.bookingDate,
        serviceId: bookingData.serviceId.map((id) => parseInt(id)),
        therapistId: parseInt(bookingData.therapistId),
        voucherId:
          bookingData.voucherId === ""
            ? "null"
            : parseInt(bookingData.voucherId),
      };

      console.log("Sending booking data:", formattedData);

      const response = await axios.post(
        `${API_URL}/staffs/booking`,
        formattedData,
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
      queryClient.invalidateQueries(["bookings"]);
      toast.success("Tạo lịch hẹn thành công!");
    },
    onError: (error) => {
      console.error("Booking error:", error);
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra khi tạo lịch hẹn!"
      );
    },
  });

  return {
    getAllBookings,
    getAllServices,
    getAvailableTherapists,
    getActiveVouchers,
    getAllSlots,
    createBooking,
  };
};
