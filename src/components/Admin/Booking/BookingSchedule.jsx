import React, { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaSearch,
  FaSpinner,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaClock,
  FaBan,
  FaEye,
  FaTimes,
  FaCheck,
  FaPlay,
} from "react-icons/fa";

const BookingSchedule = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState(""); // view, edit, add
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingsPerPage] = useState(10);

  // Form state for modal
  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    service: "",
    therapist: "",
    date: "",
    time: "",
    notes: "",
  });

  // Simulated booking data - replace with actual API call
  useEffect(() => {
    fetchBookings();
  }, [selectedDate, filterStatus]);

  const fetchBookings = () => {
    setIsLoading(true);
    // Simulate API call - replace with actual API call
    setTimeout(() => {
      const dummyBookings = [
        {
          id: 1,
          customerName: "Nguyen Van A",
          service: "Facial Treatment",
          therapist: "Dr. Tran",
          time: "09:00",
          status: "confirmed",
          phone: "0123456789",
        },
        {
          id: 2,
          customerName: "Tran Thi B",
          service: "Massage",
          therapist: "Dr. Nguyen",
          time: "10:30",
          status: "pending",
          phone: "0987654321",
        },
        // Add more dummy data as needed
      ];
      setBookings(dummyBookings);
      setIsLoading(false);
    }, 1000);
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.phone.includes(searchTerm);
    const matchesStatus =
      filterStatus === "all" || booking.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Calculate pagination
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
    if (booking && (mode === "edit" || mode === "view")) {
      setFormData({
        customerName: booking.customerName,
        phone: booking.phone,
        service: booking.service,
        therapist: booking.therapist,
        date: selectedDate,
        time: booking.time,
        notes: booking.notes || "",
      });
    } else {
      setFormData({
        customerName: "",
        phone: "",
        service: "",
        therapist: "",
        date: selectedDate,
        time: "",
        notes: "",
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalMode("");
    setSelectedBooking(null);
    setFormData({
      customerName: "",
      phone: "",
      service: "",
      therapist: "",
      date: "",
      time: "",
      notes: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission based on modalMode
    // Add API call here
    closeModal();
  };

  const handleStatusUpdate = (id, status) => {
    // Handle status update logic here
  };

  return (
    <div className="schedule">
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
            <option value="in_progress">Đang thực hiện</option>
            <option value="completed">Hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="loading">
          <FaSpinner />
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : (
        <>
          <div className="schedule__table">
            <table>
              <thead>
                <tr>
                  <th>Thời gian</th>
                  <th>Khách hàng</th>
                  <th>Số điện thoại</th>
                  <th>Dịch vụ</th>
                  <th>Bác sĩ/Chuyên viên</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {currentBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>{booking.time}</td>
                    <td>{booking.customerName}</td>
                    <td>{booking.phone}</td>
                    <td>{booking.service}</td>
                    <td>{booking.therapist}</td>
                    <td>
                      <span
                        className={`status-badge status-badge--${booking.status}`}
                      >
                        {booking.status === "pending" && (
                          <>
                            <FaClock /> Chờ xác nhận
                          </>
                        )}
                        {booking.status === "confirmed" && (
                          <>
                            <FaCheckCircle /> Đã xác nhận
                          </>
                        )}
                        {booking.status === "in_progress" && (
                          <>
                            <FaPlay /> Đang thực hiện
                          </>
                        )}
                        {booking.status === "completed" && (
                          <>
                            <FaCheck /> Hoàn thành
                          </>
                        )}
                        {booking.status === "cancelled" && (
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
                        <button
                          className="edit-btn"
                          title="Sửa"
                          onClick={() => openModal("edit", booking)}
                        >
                          <FaEdit />
                        </button>
                        <button className="delete-btn" title="Xóa">
                          <FaTrash />
                        </button>
                        {booking.status === "pending" && (
                          <button
                            className="status-btn confirm-btn"
                            title="Xác nhận lịch hẹn"
                            onClick={() =>
                              handleStatusUpdate(booking.id, "confirmed")
                            }
                          >
                            <FaCheckCircle />
                          </button>
                        )}
                        {booking.status === "confirmed" && (
                          <button
                            className="status-btn start-btn"
                            title="Bắt đầu thực hiện"
                            onClick={() =>
                              handleStatusUpdate(booking.id, "in_progress")
                            }
                          >
                            <FaPlay />
                          </button>
                        )}
                        {booking.status === "in_progress" && (
                          <button
                            className="status-btn complete-btn"
                            title="Hoàn thành"
                            onClick={() =>
                              handleStatusUpdate(booking.id, "completed")
                            }
                          >
                            <FaCheck />
                          </button>
                        )}
                        {["pending", "confirmed"].includes(booking.status) && (
                          <button
                            className="status-btn cancel-btn"
                            title="Hủy lịch hẹn"
                            onClick={() =>
                              handleStatusUpdate(booking.id, "cancelled")
                            }
                          >
                            <FaBan />
                          </button>
                        )}
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
                  : modalMode === "edit"
                  ? "Chỉnh sửa lịch hẹn"
                  : "Tạo lịch hẹn mới"}
              </h2>
              <button className="close-btn" onClick={closeModal}>
                <FaTimes />
              </button>
            </div>

            <div className="schedule__modal-body">
              {modalMode === "view" ? (
                <div className="booking-details">
                  <p>
                    <strong>Khách hàng:</strong> {selectedBooking.customerName}
                  </p>
                  <p>
                    <strong>Số điện thoại:</strong> {selectedBooking.phone}
                  </p>
                  <p>
                    <strong>Dịch vụ:</strong> {selectedBooking.service}
                  </p>
                  <p>
                    <strong>Bác sĩ/Chuyên viên:</strong>{" "}
                    {selectedBooking.therapist}
                  </p>
                  <p>
                    <strong>Thời gian:</strong> {selectedBooking.time}
                  </p>
                  <p>
                    <strong>Trạng thái:</strong> {selectedBooking.status}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Khách hàng</label>
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          customerName: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Số điện thoại</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Dịch vụ</label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={(e) =>
                        setFormData({ ...formData, service: e.target.value })
                      }
                      required
                    >
                      <option value="">Chọn dịch vụ</option>
                      {/* Add service options */}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Bác sĩ/Chuyên viên</label>
                    <select
                      name="therapist"
                      value={formData.therapist}
                      onChange={(e) =>
                        setFormData({ ...formData, therapist: e.target.value })
                      }
                      required
                    >
                      <option value="">Chọn bác sĩ/chuyên viên</option>
                      {/* Add therapist options */}
                    </select>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Ngày</label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={(e) =>
                          setFormData({ ...formData, date: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Giờ</label>
                      <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={(e) =>
                          setFormData({ ...formData, time: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Ghi chú</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      rows="3"
                    ></textarea>
                  </div>
                </form>
              )}
            </div>

            <div className="schedule__modal-footer">
              <button className="btn-secondary" onClick={closeModal}>
                Đóng
              </button>
              {modalMode !== "view" && (
                <button className="btn-primary" onClick={handleSubmit}>
                  {modalMode === "add" ? "Tạo lịch hẹn" : "Lưu thay đổi"}
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
