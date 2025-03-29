import React, { useState, useMemo, useCallback } from "react";
import { FaSpinner, FaCalendarPlus } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

import { useCustomerActions } from "@/auth/hook/admin/useCustomerActions";
import { useBookingsByDate } from "@/auth/hook/admin/useGetBookingByDateHook";
import { useBookingActions } from "@/auth/hook/admin/useBookingActions";
import { useServiceActions } from "@/auth/hook/admin/useServiceActionsHook";
import { useTherapistActions } from "@/auth/hook/admin/useTherapistActions";
import { useActiveVouchers } from "@/auth/hook/admin/useActiveVouchers";

import BookingTable from "./components/BookingTable";
import BookingAddModal from "./components/BookingAddModal";
import InvoiceModal from "./components/InvoiceModal";

const BookingSchedule = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const formattedDate = selectedDate.toISOString().split("T")[0];

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data: bookings = [], isLoading: isLoadingBookings } =
    useBookingsByDate(formattedDate);

  const {
    createBookingStaff,
    checkInBooking,
    completeBooking,
    checkoutBooking,
  } = useBookingActions({
    setInvoiceData,
  });

  const { customers } = useCustomerActions();
  const { services, isLoading: isLoadingServices } = useServiceActions();
  const { therapists } = useTherapistActions();
  const { vouchers } = useActiveVouchers();

  const handleDateChange = (date) => {
    setSelectedDate(date); // Cập nhật ngày được chọn
  };

  const handleCheckIn = useCallback(
    async (bookingId) => {
      try {
        await checkInBooking(bookingId);
        toast.success("Check-in thành công!");
      } catch (error) {
        toast.error("Lỗi khi check-in: " + error.message);
      }
    },
    [checkInBooking]
  );

  const handleComplete = useCallback(
    async (bookingId) => {
      try {
        const invoice = await completeBooking(bookingId);
        if (invoice) {
          setInvoiceData(invoice);
          setIsInvoiceOpen(true);
          queryClient.invalidateQueries(["bookings"]);
        }
      } catch (error) {
        toast.error("Lỗi khi hoàn thành dịch vụ: " + error.message);
      }
    },
    [completeBooking, queryClient]
  );

  const handleCreateBooking = useCallback(
    async (bookingData) => {
      try {
        await createBookingStaff(bookingData);
        setIsAddModalOpen(false);
        queryClient.invalidateQueries(["bookings"]);
      } catch (error) {
        toast.error("Lỗi khi thêm lịch hẹn: " + error.message);
      }
    },
    [createBookingStaff, queryClient]
  );

  const handleCheckout = useCallback(
    async (bookingId) => {
      try {
        await checkoutBooking(bookingId);
        toast.success("Thanh toán thành công!");
      } catch (error) {
        toast.error("Lỗi khi thanh toán: " + error.message);
      }
    },
    [checkoutBooking]
  );

  if (isLoadingServices || isLoadingBookings) {
    return (
      <div className="loading-container">
        <FaSpinner className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div className="admin-page__header-title">
          <h1>Quản lý Lịch hẹn</h1>
          <p>Quản lý và theo dõi lịch hẹn của khách hàng</p>
        </div>
        <div className="admin-page__header-actions">
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="dd/MM/yyyy"
            // minDate={new Date()}
            className="form-control"
            placeholderText="Chọn ngày"
          />
          <button
            className="btn btn-primary"
            onClick={() => setIsAddModalOpen(true)}
          >
            <FaCalendarPlus className="btn-icon" />
            Thêm Lịch hẹn
          </button>
        </div>
      </div>

      <BookingTable
        bookings={bookings}
        customers={customers}
        services={services}
        therapists={therapists}
        vouchers={vouchers}
        onCheckIn={handleCheckIn}
        onComplete={handleComplete}
      />

      {isAddModalOpen && (
        <BookingAddModal
          services={services || []}
          therapists={therapists}
          // vouchers={vouchers}
          onClose={() => setIsAddModalOpen(false)}
          onConfirm={handleCreateBooking}
        />
      )}

      {isInvoiceOpen && invoiceData && (
        <InvoiceModal
          data={invoiceData}
          onCheckout={handleCheckout}
          onClose={() => {
            setInvoiceData(null);
            setIsInvoiceOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default BookingSchedule;
