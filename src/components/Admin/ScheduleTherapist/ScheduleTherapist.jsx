import React, { useState } from "react";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";
import vi from "date-fns/locale/vi";
import {
  FaCalendarAlt,
  FaSearch,
  FaFilter,
  FaUserClock,
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ScheduleTherapist = () => {
  // Add new states for view options
  const [viewMode, setViewMode] = useState("day"); // day, week, month
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    service: "all",
    availability: "all",
    specialization: "all",
  });

  const timeSlots = [
    { id: 1, time: "09:00 - 11:00" },
    { id: 2, time: "11:00 - 13:00" },
    { id: 3, time: "13:30 - 15:30" },
    { id: 4, time: "15:30 - 17:30" },
    { id: 5, time: "18:00 - 20:00" },
    { id: 6, time: "20:00 - 22:00" },
  ];

  const services = [
    { id: 1, name: "Massage Toàn Thân", duration: "120 phút" },
    { id: 2, name: "Massage Vai Gáy", duration: "60 phút" },
    { id: 3, name: "Facial Căng Bóng", duration: "90 phút" },
    { id: 4, name: "Facial Trẻ Hóa", duration: "120 phút" },
    { id: 5, name: "Tẩy Tế Bào Chết", duration: "45 phút" },
    { id: 6, name: "Spa Trọn Gói", duration: "180 phút" },
  ];

  const therapists = [
    {
      id: 1,
      name: "Nguyễn Thúy Nga",
      specialization: ["Massage", "Facial"],
      experience: "3 năm",
      rating: 4.8,
      avatar: "/assets/img/therapists/nga.jpg",
      expertise: ["Massage Thư Giãn", "Facial Căng Bóng"],
      languages: ["Tiếng Việt", "Tiếng Anh"],
      certifications: ["Chứng chỉ Spa Quốc tế"],
    },
    {
      id: 2,
      name: "Trần Thanh Hương",
      specialization: ["Massage", "Spa"],
      experience: "5 năm",
      rating: 4.9,
      avatar: "/assets/img/therapists/huong.jpg",
      expertise: ["Massage Trị Liệu", "Tẩy Tế Bào Chết"],
      languages: ["Tiếng Việt"],
      certifications: ["Chứng chỉ Massage Thái"],
    },
    {
      id: 3,
      name: "Lê Minh Tâm",
      specialization: ["Facial", "Skin Care"],
      experience: "2 năm",
      rating: 4.7,
      avatar: "/assets/img/therapists/tam.jpg",
      expertise: ["Facial Trẻ Hóa", "Chăm Sóc Da"],
      languages: ["Tiếng Việt", "Tiếng Hàn"],
      certifications: ["Chứng chỉ Thẩm Mỹ"],
    },
    {
      id: 4,
      name: "Phạm Thu Thảo",
      specialization: ["Massage", "Facial", "Spa"],
      experience: "4 năm",
      rating: 4.9,
      avatar: "/assets/img/therapists/thao.jpg",
      expertise: ["Massage Đá Nóng", "Facial Cao Cấp"],
      languages: ["Tiếng Việt", "Tiếng Anh", "Tiếng Nhật"],
      certifications: ["Chứng chỉ Spa Quốc tế", "Chứng chỉ Massage Nhật"],
    },
  ];

  const schedules = {
    // Lịch của Nga
    "1-1": {
      status: "booked",
      booking: {
        id: "BK001",
        customerName: "Chị Lan Anh",
        service: "Massage Toàn Thân",
        duration: "120 phút",
        note: "Khách yêu cầu massage nhẹ nhàng",
        phone: "0901234567",
        payment: "Đã đặt cọc",
        amount: "750.000đ",
      },
    },
    "1-2": {
      status: "available",
    },
    "1-3": {
      status: "break",
      note: "Nghỉ trưa",
    },
    "1-4": {
      status: "booked",
      booking: {
        id: "BK002",
        customerName: "Anh Quang",
        service: "Massage Vai Gáy",
        duration: "60 phút",
        phone: "0987654321",
        payment: "Chưa thanh toán",
        amount: "350.000đ",
      },
    },
    "1-5": {
      status: "booked",
      booking: {
        id: "BK003",
        customerName: "Chị Trang",
        service: "Facial Căng Bóng",
        duration: "90 phút",
        note: "Khách bị dị ứng với collagen",
        payment: "Đã thanh toán",
        amount: "890.000đ",
      },
    },

    // Lịch của Hương
    "2-1": {
      status: "booked",
      booking: {
        id: "BK004",
        customerName: "Chị Mai",
        service: "Facial Trẻ Hóa",
        duration: "120 phút",
        note: "Da nhạy cảm",
        payment: "Đã thanh toán",
        amount: "1.200.000đ",
      },
    },
    "2-2": {
      status: "break",
      note: "Đi đào tạo",
    },
    "2-3": {
      status: "available",
    },
    "2-4": {
      status: "booked",
      booking: {
        id: "BK005",
        customerName: "Anh Tuấn",
        service: "Massage Toàn Thân",
        duration: "120 phút",
        payment: "Đã đặt cọc",
        amount: "750.000đ",
      },
    },

    // Lịch của Tâm
    "3-1": {
      status: "off",
      note: "Nghỉ ốm",
    },
    "3-2": {
      status: "off",
      note: "Nghỉ ốm",
    },
    "3-3": {
      status: "off",
      note: "Nghỉ ốm",
    },

    // Lịch của Thảo
    "4-1": {
      status: "booked",
      booking: {
        id: "BK006",
        customerName: "Chị Hương",
        service: "Spa Trọn Gói",
        duration: "180 phút",
        note: "VIP member",
        payment: "Đã thanh toán",
        amount: "2.500.000đ",
      },
    },
    "4-2": {
      status: "booked",
      booking: {
        id: "BK007",
        customerName: "Chị Linh",
        service: "Facial Căng Bóng",
        duration: "90 phút",
        payment: "Chưa thanh toán",
        amount: "890.000đ",
      },
    },
    "4-3": {
      status: "available",
    },
  };

  const statusColors = {
    available: "#22c55e",
    booked: "#3b82f6",
    break: "#f59e0b",
    off: "#ef4444",
  };

  const handleSlotClick = (therapistId, slotId) => {
    const schedule = schedules[`${therapistId}-${slotId}`];
    if (schedule?.status === "booked") {
      // Show booking details in a modal
      console.log("Booking Details:", schedule.booking);
    } else if (schedule?.status === "available") {
      // Show booking form for new customers
      console.log("Create New Booking");
    }
  };

  const handleStatusChange = (therapistId, slotId, newStatus) => {
    // Update schedule status
  };

  const getAvailableTherapists = (slotId) => {
    return therapists.filter(
      (therapist) =>
        !schedules[`${therapist.id}-${slotId}`] ||
        schedules[`${therapist.id}-${slotId}`].status === "available"
    );
  };

  // Function to get dates for week view
  const getWeekDates = () => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  };

  // Function to filter schedules by date
  const getSchedulesByDate = (date) => {
    return Object.entries(schedules).reduce((acc, [key, value]) => {
      if (isSameDay(new Date(value.date), date)) {
        acc[key] = value;
      }
      return acc;
    }, {});
  };

  // Add ViewModeSelector component
  const ViewModeSelector = () => (
    <div className="view-mode-selector">
      <button
        className={`view-mode-btn ${viewMode === "day" ? "active" : ""}`}
        onClick={() => setViewMode("day")}
      >
        Ngày
      </button>
      <button
        className={`view-mode-btn ${viewMode === "week" ? "active" : ""}`}
        onClick={() => setViewMode("week")}
      >
        Tuần
      </button>
      <button
        className={`view-mode-btn ${viewMode === "therapist" ? "active" : ""}`}
        onClick={() => setViewMode("therapist")}
      >
        Theo Therapist
      </button>
    </div>
  );

  // Add DateNavigator component
  const DateNavigator = () => (
    <div className="date-navigator">
      <button onClick={() => setSelectedDate(addDays(selectedDate, -1))}>
        <FaChevronLeft />
      </button>
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        dateFormat="dd/MM/yyyy"
        locale={vi}
        className="date-picker"
      />
      <button onClick={() => setSelectedDate(addDays(selectedDate, 1))}>
        <FaChevronRight />
      </button>
    </div>
  );

  // Enhance the filter section
  const EnhancedFilters = () => (
    <div className="schedule-filters">
      <div className="search-box">
        <FaSearch />
        <input
          type="text"
          placeholder="Tìm kiếm therapist..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="filter-group">
        <select
          value={filters.specialization}
          onChange={(e) =>
            setFilters({ ...filters, specialization: e.target.value })
          }
        >
          <option value="all">Tất cả chuyên môn</option>
          <option value="massage">Massage</option>
          <option value="facial">Facial</option>
          <option value="spa">Spa</option>
        </select>
        <select
          value={filters.service}
          onChange={(e) => setFilters({ ...filters, service: e.target.value })}
        >
          <option value="all">Tất cả dịch vụ</option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name}
            </option>
          ))}
        </select>
        <select
          value={filters.availability}
          onChange={(e) =>
            setFilters({ ...filters, availability: e.target.value })
          }
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="available">Đang rảnh</option>
          <option value="booked">Đã đặt lịch</option>
          <option value="break">Đang nghỉ</option>
        </select>
      </div>
    </div>
  );

  // Enhanced booking info display
  const BookingInfo = ({ booking }) => (
    <div className="booking-info">
      <div className="booking-info__header">
        <span className="customer-name">{booking.customerName}</span>
        <span className={`payment-status ${booking.payment.toLowerCase()}`}>
          {booking.payment}
        </span>
      </div>
      <div className="booking-info__service">
        <span>{booking.service}</span>
        <span>{booking.duration}</span>
      </div>
      {booking.note && (
        <div className="booking-info__note" title={booking.note}>
          {booking.note}
        </div>
      )}
    </div>
  );

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div className="admin-page__header-title">
          <h1>Quản lý lịch làm việc</h1>
          <p>Quản lý và phân công therapist cho các lịch hẹn</p>
        </div>
      </div>

      <div className="schedule-controls">
        <ViewModeSelector />
        <DateNavigator />
        <EnhancedFilters />
      </div>

      {viewMode === "day" && (
        <div className="schedule-grid">
          <div className="time-slots">
            <div className="slot-header">Thời gian</div>
            {timeSlots.map((slot) => (
              <div key={slot.id} className="time-slot">
                {slot.time}
              </div>
            ))}
          </div>

          {therapists.map((therapist) => (
            <div key={therapist.id} className="therapist-schedule">
              <div className="therapist-info">
                <h3>{therapist.name}</h3>
                <p>{therapist.specialization}</p>
                <span className="experience">{therapist.experience}</span>
                <span className="rating">{therapist.rating} ⭐</span>
              </div>
              {timeSlots.map((slot) => {
                const schedule = schedules[`${therapist.id}-${slot.id}`];
                return (
                  <div
                    key={slot.id}
                    className={`schedule-slot ${
                      schedule?.status || "available"
                    }`}
                    onClick={() => handleSlotClick(therapist.id, slot.id)}
                  >
                    {schedule?.status === "booked" ? (
                      <BookingInfo booking={schedule.booking} />
                    ) : (
                      <FaCheckCircle className="available-icon" />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {viewMode === "week" && (
        <div className="schedule-grid-week">
          {getWeekDates().map((date) => (
            <div key={format(date, "yyyy-MM-dd")} className="day-column">
              <h3>{format(date, "EEEE, dd/MM", { locale: vi })}</h3>
              {/* Day schedule content */}
            </div>
          ))}
        </div>
      )}

      {viewMode === "therapist" && selectedTherapist && (
        <div className="therapist-timeline">
          {/* Therapist timeline view */}
        </div>
      )}
    </div>
  );
};

export default ScheduleTherapist;
