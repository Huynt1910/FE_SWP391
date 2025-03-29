import React, { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";

const EditScheduleModal = ({
  schedule,
  onClose,
  onConfirm,
  isLoading,
  therapists,
}) => {
  const [formData, setFormData] = useState({
    shiftId: "",
  });

  useEffect(() => {
    if (schedule) {
      setFormData({
        shiftId: schedule.shiftId[0], // Lấy ca làm việc hiện tại
      });
    }
  }, [schedule]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Tìm therapistId từ therapistName (so khớp với fullName)
    const therapist = therapists.find(
      (t) => t.fullName === schedule.therapistName
    );
    const therapistId = therapist ? therapist.id : null;

    if (!therapistId) {
      console.error("Therapist not found for the given therapistName.");
      return;
    }

    const data = {
      therapistId: therapistId, // Sử dụng therapistId được ánh xạ
      workingDate: schedule.workingDate,
      shiftId: [Number(formData.shiftId)],
    };

    console.log("Data to send to server (EditScheduleModal):", data);

    onConfirm(schedule.id, data);
  };

  return (
    <div className="admin-page__modal">
      <div className="admin-page__modal-content">
        <div className="admin-page__modal-content-header">
          <h2>Chỉnh sửa ca làm việc</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="admin-page__modal-content-body"
        >
          <div className="form-group">
            <label>Ca làm việc:</label>
            <select
              value={formData.shiftId}
              onChange={(e) =>
                setFormData({ ...formData, shiftId: e.target.value })
              }
              required
              className="form-control"
            >
              <option value="">-- Chọn ca làm --</option>
              <option value="1">Ca sáng</option>
              <option value="2">Ca chiều</option>
            </select>
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
                "Cập nhật"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditScheduleModal;
