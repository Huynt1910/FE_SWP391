import React, { useState, useMemo } from "react";
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
import { useVoucherActions } from "@/auth/hook/admin/useVoucherActions";

import BookingTable from "./components/BookingTable";
import BookingAddModal from "./components/BookingAddModal";
import InvoiceModal from "./components/InvoiceModal";

const Bookings = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const formattedDate = useMemo(
    () => selectedDate.toISOString().split("T")[0],
    [selectedDate]
  );

  const [modalState, setModalState] = useState({ add: false });
  const [invoiceData, setInvoiceData] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);

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
  const { vouchers } = useVoucherActions();

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleCheckIn = async (bookingId) => {
    try {
      await checkInBooking(bookingId);
      toast.success("Check-in thành công!");
    } catch {
      toast.error("Lỗi khi check-in!");
    }
  };

  const handleComplete = async (bookingId) => {
    try {
      const invoice = await completeBooking(bookingId);
      if (invoice) {
        setInvoiceData(invoice); // Hiển thị modal hóa đơn
        setShowInvoice(true);
        queryClient.invalidateQueries(["bookings"]);
      }
    } catch {
      toast.error("Lỗi khi hoàn thành dịch vụ!");
    }
  };

  const handleCreateBooking = async (data) => {
    try {
      await createBookingStaff(data);
      closeModal("add");
    } catch {
      toast.error("Lỗi khi thêm lịch hẹn!");
    }
  };

  const handleCheckout = async (bookingId) => {
    try {
      await checkoutBooking(bookingId); // Gọi API checkout
      toast.success("Thanh toán thành công!");
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error("Lỗi khi thực hiện thanh toán!");
    }
  };

  const openModal = (type) => {
    setModalState((prev) => ({ ...prev, [type]: true }));
  };

  const closeModal = (type) => {
    setModalState((prev) => ({ ...prev, [type]: false }));
  };

  const handleCloseInvoice = () => {
    setInvoiceData(null);
    setShowInvoice(false);
  };

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
            dateFormat="yyyy-MM-dd"
            className="date-picker"
          />
          <button className="btn-primary" onClick={() => openModal("add")}>
            <FaCalendarPlus className="btn-icon" />
            <span>Thêm Lịch hẹn</span>
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

      {modalState.add && (
        <BookingAddModal
          services={services}
          therapists={therapists}
          vouchers={vouchers}
          onClose={() => closeModal("add")}
          onConfirm={handleCreateBooking}
        />
      )}

      {showInvoice && invoiceData && (
        <InvoiceModal
          data={invoiceData} // Dữ liệu hóa đơn từ API
          onCheckout={handleCheckout} // Truyền hàm xử lý thanh toán
          onClose={handleCloseInvoice}
        />
      )}
    </div>
  );
};

export default Bookings;
