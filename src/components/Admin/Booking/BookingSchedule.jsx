import React, { useState } from "react";
import { useBookingActions } from "@/auth/hook/admin/useBookingActions";
import {
  FaSpinner,
  FaCalendarAlt,
  FaSearch,
  FaClock,
  FaCheckCircle,
  FaCheck,
  FaEye,
  FaBan,
  FaTimes,
} from "react-icons/fa";
import { format } from "date-fns";
import { toast } from "react-toastify";

const BookingSchedule = () => {
  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [formData, setFormData] = useState({
    slotId: "",
    bookingDate: new Date().toISOString().split("T")[0],
    serviceId: [],
    therapistId: "",
    voucherId: "",
    phone: "",
  });

  // Get data from custom hook
  const {
    getAllBookings,
    getAllServices,
    getAvailableTherapists,
    getActiveVouchers,
    getAllSlots,
    createBooking,
  } = useBookingActions(formData.bookingDate);

  // Safe data access
  const bookings = getAllBookings.data?.data || [];
  const services = getAllServices.data?.data || [];
  const therapists = getAvailableTherapists.data?.data || [];
  const vouchers = getActiveVouchers.data?.data || [];
  const slots = getAllSlots.data?.data || [];

  // Filter bookings
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.userPhone?.includes(searchTerm);
    const matchesStatus =
      filterStatus === "all" || booking.status?.toLowerCase() === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const bookingsPerPage = 10;
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = filteredBookings.slice(
    indexOfFirstBooking,
    indexOfLastBooking
  );
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);

  // Modal handlers
  const openModal = (mode, booking = null) => {
    setModalMode(mode);
    setSelectedBooking(booking);
    if (mode === "add") {
      setFormData({
        ...formData,
        bookingDate: selectedDate,
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalMode("");
    setSelectedBooking(null);
    setFormData({
      slotId: "",
      bookingDate: selectedDate,
      serviceId: [],
      therapistId: "",
      voucherId: "",
      phone: "",
    });
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createBooking.mutateAsync({
        phoneNumber: formData.phone,
        slotId: parseInt(formData.slotId),
        bookingDate: formData.bookingDate,
        serviceId: formData.serviceId.map((id) => parseInt(id)),
        therapistId: parseInt(formData.therapistId),
        voucherId: formData.voucherId ? parseInt(formData.voucherId) : null,
      });
      closeModal();
    } catch (error) {
      console.error("Booking error:", error);
    }
  };

  // Service selection component
  const ServiceSelection = () => {
    const handleServiceChange = (e) => {
      const selectedOptions = Array.from(e.target.selectedOptions);
      const selectedIds = selectedOptions.map((option) =>
        parseInt(option.value)
      );
      setFormData((prev) => ({
        ...prev,
        serviceId: selectedIds,
      }));
    };

    return (
      <div className="form-group">
        <label>Dịch vụ:</label>
        <select
          multiple
          name="serviceId"
          value={formData.serviceId}
          onChange={handleServiceChange}
          required
          className="form-control"
        >
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name}
            </option>
          ))}
        </select>
        {getAllServices.isLoading && (
          <div className="loading-text">Đang tải dịch vụ...</div>
        )}
        <small className="help-text">Giữ Ctrl để chọn nhiều dịch vụ</small>
      </div>
    );
  };

  // Render booking form
  const renderForm = () => (
    <form onSubmit={handleSubmit} className="booking-form">
      <div className="form-group">
        <label>Số điện thoại</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
          pattern="[0-9]{10}"
          placeholder="Nhập số điện thoại khách hàng"
        />
      </div>

      <div className="form-group">
        <label>Ngày</label>
        <input
          type="date"
          name="bookingDate"
          value={formData.bookingDate}
          onChange={(e) =>
            setFormData({
              ...formData,
              bookingDate: e.target.value,
              therapistId: "",
              slotId: "",
            })
          }
          min={new Date().toISOString().split("T")[0]}
          required
        />
      </div>

      <div className="form-group">
        <label>Chuyên viên</label>
        <select
          name="therapistId"
          value={formData.therapistId}
          onChange={(e) =>
            setFormData({
              ...formData,
              therapistId: e.target.value,
            })
          }
          required
          disabled={!formData.bookingDate}
        >
          <option value="">
            {!formData.bookingDate
              ? "Vui lòng chọn ngày trước"
              : "Chọn chuyên viên"}
          </option>
          {therapists.map((therapist) => (
            <option key={therapist.id} value={therapist.id}>
              {therapist.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Khung giờ</label>
        <select
          name="slotId"
          value={formData.slotId}
          onChange={(e) =>
            setFormData({
              ...formData,
              slotId: e.target.value,
            })
          }
          required
          disabled={!formData.therapistId}
        >
          <option value="">Chọn khung giờ</option>
          {slots.map((slot) => (
            <option key={slot.id} value={slot.id}>
              {slot.startTime} - {slot.endTime}
            </option>
          ))}
        </select>
        {getAllSlots.isLoading && (
          <div className="loading-text">Đang tải khung giờ...</div>
        )}
      </div>

      <ServiceSelection />

      <div className="form-group">
        <label>Voucher (không bắt buộc)</label>
        <select
          name="voucherId"
          value={formData.voucherId}
          onChange={(e) =>
            setFormData({
              ...formData,
              voucherId: e.target.value,
            })
          }
        >
          <option value="">Không sử dụng voucher</option>
          {vouchers.map((voucher) => (
            <option key={voucher.id} value={voucher.id}>
              {voucher.code} - Giảm {voucher.discountAmount}%
            </option>
          ))}
        </select>
      </div>

      <div className="form-actions">
        <button className="btn-primary" onClick={handleSubmit}>
          Tạo lịch hẹn
        </button>
      </div>
    </form>
  );

  // Render booking details
  const renderBookingDetails = () => (
    <div className="booking-details">
      <p>
        <strong>Khách hàng:</strong> {selectedBooking.userName}
      </p>
      <p>
        <strong>Số điện thoại:</strong> {selectedBooking.userPhone}
      </p>
      <p>
        <strong>Chuyên viên:</strong> {selectedBooking.therapistName}
      </p>
      <p>
        <strong>Thời gian:</strong>{" "}
        {format(new Date(selectedBooking.date), "dd/MM/yyyy")}{" "}
        {selectedBooking.time}
      </p>
      <p>
        <strong>Trạng thái:</strong> {selectedBooking.status}
      </p>
    </div>
  );

  // Main render
  return (
    <div className="schedule-container">
      {/* Header */}
      <div className="schedule__header">
        <div className="schedule__header-title">
          <h1>Quản lý lịch hẹn</h1>
          <p>Quản lý và theo dõi lịch hẹn của khách hàng</p>
        </div>
        <div className="schedule__header-actions">
          <button className="btn-create" onClick={() => openModal("add")}>
            <FaCalendarAlt />
            Tạo lịch hẹn mới
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="schedule__toolbar">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc số điện thoại"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <input
            type="date"
            className="date-picker"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ xác nhận</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="completed">Hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {getAllBookings.isLoading ? (
        <div className="loading-container">
          <FaSpinner className="spinner" />
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="schedule__table">
            <table>
              <thead>
                <tr>
                  <th>Thời gian</th>
                  <th>Khách hàng</th>
                  <th>Số điện thoại</th>
                  <th>Chuyên viên</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {currentBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>{booking.time}</td>
                    <td>{booking.userName}</td>
                    <td>{booking.userPhone}</td>
                    <td>{booking.therapistName}</td>
                    <td>
                      <span
                        className={`status-badge ${booking.status.toLowerCase()}`}
                      >
                        {booking.status === "PENDING" && (
                          <>
                            <FaClock /> Chờ xác nhận
                          </>
                        )}
                        {booking.status === "CONFIRMED" && (
                          <>
                            <FaCheckCircle /> Đã xác nhận
                          </>
                        )}
                        {booking.status === "COMPLETED" && (
                          <>
                            <FaCheck /> Hoàn thành
                          </>
                        )}
                        {booking.status === "CANCELLED" && (
                          <>
                            <FaBan /> Đã hủy
                          </>
                        )}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="view-btn"
                          title="Xem chi tiết"
                          onClick={() => openModal("view", booking)}
                        >
                          <FaEye />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="schedule__pagination">
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              &laquo; Trước
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                className={`pagination-btn ${
                  currentPage === index + 1 ? "active" : ""
                }`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}

            <button
              className="pagination-btn"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Sau &raquo;
            </button>
          </div>
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className="schedule__modal">
          <div className="schedule__modal-content">
            <div className="schedule__modal-header">
              <h2>
                {modalMode === "view"
                  ? "Chi tiết lịch hẹn"
                  : "Tạo lịch hẹn mới"}
              </h2>
              <button className="close-btn" onClick={closeModal}>
                <FaTimes />
              </button>
            </div>

            <div className="schedule__modal-body">
              {modalMode === "view" ? renderBookingDetails() : renderForm()}
            </div>

            <div className="schedule__modal-footer">
              <button className="btn-secondary" onClick={closeModal}>
                Đóng
              </button>
              {modalMode !== "view" && (
                <button
                  className="btn-primary"
                  onClick={handleSubmit}
                  disabled={createBooking.isLoading}
                >
                  {createBooking.isLoading ? (
                    <>
                      <FaSpinner className="spinner" /> Đang xử lý...
                    </>
                  ) : (
                    "Tạo lịch hẹn"
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingSchedule;
