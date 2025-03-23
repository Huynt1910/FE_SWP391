import React, { useState, useMemo } from "react";
import { FaSpinner, FaCalendarPlus } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";

import { useCustomerActions } from "@/auth/hook/admin/useCustomerActions";
import { useBookingsByDate } from "@/auth/hook/admin/useGetBookingByDateHook";
import { useBookingActions } from "@/auth/hook/admin/useBookingActions";
import { useServiceActions } from "@/auth/hook/admin/useServiceActionsHook";
import { useTherapistActions } from "@/auth/hook/admin/useTherapistActions";
import { useVoucherActions } from "@/auth/hook/admin/useVoucherActions";

import BookingTable from "./components/BookingTable";
import BookingAddModal from "./components/BookingAddModal";
// import BookingEditModal from "./components/BookingEditModal";
import InvoiceModal from "./components/InvoiceModal";

const Bookings = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const formattedDate = useMemo(
    () => selectedDate.toISOString().split("T")[0],
    [selectedDate]
  );

  const [modalState, setModalState] = useState({ add: false, edit: false });
  const [selectedBooking, setSelectedBooking] = useState(null);

  const [showInvoice, setShowInvoice] = useState(false);
  const [invoiceData, setInvoiceData] = useState(response);

  const { data: bookings = [], isLoading: isLoadingBookings } =
    useBookingsByDate(formattedDate);
  const { createBookingStaff, updateBooking, checkInBooking, completeBooking } =
    useBookingActions({
      setInvoiceData,
      setShowInvoiceModal: setShowInvoice,
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
    } catch (err) {
      toast.error("Lỗi khi check-in!");
    }
  };

  const handleComplete = async (bookingId) => {
    try {
      await completeBooking(bookingId);
    } catch (err) {
      toast.error("Lỗi khi hoàn thành dịch vụ!");
    }
  };

  const handleCreateBooking = async (data) => {
    try {
      await createBookingStaff(data);
      closeModal("add");
    } catch (err) {
      toast.error("Lỗi khi thêm lịch hẹn!");
    }
  };

  const openModal = (type, booking = null) => {
    setModalState((prev) => ({ ...prev, [type]: true }));
    if (type === "edit") setSelectedBooking(booking);
  };

  const closeModal = (type) => {
    setModalState((prev) => ({ ...prev, [type]: false }));
    if (type === "edit") setSelectedBooking(null);
  };

  const handleCloseInvoice = () => {
    setShowInvoice(false);
    setInvoiceData(null);
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
        customers={customers}
        bookings={bookings}
        services={services}
        therapists={therapists}
        vouchers={vouchers}
        onEdit={(booking) => openModal("edit", booking)}
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

      {/* {modalState.edit && selectedBooking && (
        <BookingEditModal
          booking={selectedBooking}
          services={services}
          therapists={therapists}
          vouchers={vouchers}
          onClose={() => closeModal("edit")}
          onConfirm={updateBooking}
        />
      )} */}

      {showInvoice && invoiceData && (
        <InvoiceModal data={invoiceData} onClose={handleCloseInvoice} />
      )}
    </div>
  );
};

export default Bookings;
