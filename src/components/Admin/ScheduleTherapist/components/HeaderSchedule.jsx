import React from "react";
import DatePicker from "react-datepicker";
import { FaUserClock, FaCalendarAlt } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";

const ScheduleHeader = ({ selectedDate, onDateChange, onAddClick }) => {
  return (
    <div className="admin-page__header">
      <div className="admin-page__header-title">
        <h1>Quản lý lịch làm việc</h1>
        <p>Quản lý và sắp xếp lịch làm việc cho therapist</p>
      </div>

      <div className="admin-page__header-actions">
        <div className="date-picker-wrapper">
          <FaCalendarAlt className="calendar-icon" />
          <DatePicker
            selected={selectedDate}
            onChange={onDateChange}
            dateFormat="dd/MM/yyyy"
            // minDate={new Date()}
            className="form-control"
            placeholderText="Chọn ngày"
          />
        </div>

        <button className="btn btn-primary" onClick={onAddClick}>
          <FaUserClock /> Tạo lịch mới
        </button>
      </div>
    </div>
  );
};

export default ScheduleHeader;
