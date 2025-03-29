import React, { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import { useTherapistActions } from "@/auth/hook/admin/useTherapistActions";

const AddScheduleModal = ({ onClose, onConfirm, isLoading }) => {
  const [formData, setFormData] = useState({
    therapistId: "",
    workingDate: new Date(),
    shiftId: "",
  });

  const { therapists } = useTherapistActions();

  const shifts = [
    { id: 1, name: "Ca sáng" },
    { id: 2, name: "Ca chiều" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      therapistId: Number(formData.therapistId),
      workingDate: format(formData.workingDate, "yyyy-MM-dd"),
      shiftId: [Number(formData.shiftId)],
    };
    console.log("Data to send to server:", data);
    onConfirm(data);
  };

  return (
    <div className="admin-page__modal">
      <div className="admin-page__modal-content">
        <div className="admin-page__modal-content-header">
          <h2>Tạo lịch làm việc mới</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="admin-page__modal-content-body"
        >
          <div className="form-group">
            <label>Chọn Therapist:</label>
            <select
              value={formData.therapistId}
              onChange={(e) =>
                setFormData({ ...formData, therapistId: e.target.value })
              }
              required
            >
              <option value="">-- Chọn Therapist --</option>
              {therapists?.map((therapist) => (
                <option key={therapist.id} value={therapist.id}>
                  {therapist.fullName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Chọn ca làm:</label>
            <select
              value={formData.shiftId}
              onChange={(e) =>
                setFormData({ ...formData, shiftId: e.target.value })
              }
              required
            >
              <option value="">-- Chọn ca làm --</option>
              {shifts.map((shift) => (
                <option key={shift.id} value={shift.id}>
                  {shift.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Ngày làm việc:</label>
            <DatePicker
              selected={formData.workingDate}
              onChange={(date) =>
                setFormData({ ...formData, workingDate: date })
              }
              dateFormat="dd/MM/yyyy"
              minDate={new Date()}
              className="form-control"
            />
          </div>

          <div className="admin-page__modal-content-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <FaSpinner className="spinner" /> Đang xử lý...
                </>
              ) : (
                "Xác nhận"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddScheduleModal;
