import React from "react";
import { format } from "date-fns";
import { FaTrash, FaEdit } from "react-icons/fa";

const ScheduleTable = ({ schedules, onDelete, onEdit }) => {
  // Check for valid schedules data structure
  if (!schedules?.result || schedules.result.length === 0) {
    return (
      <div className="admin-page__table-empty">
        Không có lịch làm việc cho ngày này
      </div>
    );
  }

  return (
    <div className="admin-page__table">
      <table>
        <thead>
          <tr>
            <th>Therapist</th>
            <th>Ngày làm việc</th>
            <th>Ca làm việc</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {schedules.result.map((schedule) => (
            <tr key={schedule.id}>
              <td>{schedule.therapistName}</td>
              <td>{format(new Date(schedule.workingDate), "dd/MM/yyyy")}</td>
              <td>
                <span
                  className={`status-badge status-badge--${
                    schedule.shiftId[0] === 1 ? "morning" : "evening"
                  }`}
                >
                  {schedule.shiftId[0] === 1 ? "Ca sáng" : "Ca chiều"}
                </span>
              </td>
              <td>
                <div className="action-buttons">
                  <button
                    className="edit-btn"
                    title="Chỉnh sửa"
                    onClick={() => onEdit(schedule)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="delete-btn"
                    title="Xóa lịch"
                    onClick={() => onDelete(schedule.id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScheduleTable;
