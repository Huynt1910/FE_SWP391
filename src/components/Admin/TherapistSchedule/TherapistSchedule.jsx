import React, { useState } from "react";
import { useTherapistSchedule } from "@/auth/hook/useTherapistScheduleHook";
import { FaSpinner, FaCalendarAlt, FaSun, FaMoon } from "react-icons/fa";
import { getCookie } from "cookies-next";

const SHIFTS = {
  1: {
    label: "Ca sáng",
    icon: <FaSun className="shift-icon morning" />,
    time: "8:00 - 12:00",
  },
  2: {
    label: "Ca chiều",
    icon: <FaMoon className="shift-icon afternoon" />,
    time: "13:00 - 17:00",
  },
};

export const TherapistSchedule = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const therapistId = getCookie("therapistId");
  const { data: schedules, isLoading } = useTherapistSchedule(
    therapistId,
    selectedMonth
  );

  if (isLoading) {
    return (
      <div className="admin-page">
        <div className="admin-page__loading">
          <FaSpinner className="spinner" />
          <p>Đang tải lịch làm việc...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <h1>Lịch làm việc của tôi</h1>
        <div className="admin-page__actions">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="admin-page__select"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                Tháng {i + 1}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="admin-page__content">
        <div className="schedule-container">
          {schedules?.result?.length > 0 ? (
            schedules.result.map((schedule) => (
              <div key={schedule.id} className="schedule-item">
                <div className="schedule-item__header">
                  <FaCalendarAlt className="calendar-icon" />
                  <span className="schedule-item__date">
                    {new Date(schedule.workingDate).toLocaleDateString(
                      "vi-VN",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </span>
                </div>
                <div className="schedule-item__shifts">
                  {schedule.shiftId.map((shiftId) => (
                    <div key={shiftId} className="schedule-item__shift">
                      {SHIFTS[shiftId].icon}
                      <div className="shift-details">
                        <span className="shift-label">
                          {SHIFTS[shiftId].label}
                        </span>
                        <span className="shift-time">
                          {SHIFTS[shiftId].time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="schedule-empty">
              <p>Không có lịch làm việc trong tháng này</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
