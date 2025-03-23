import React, { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import { format } from "date-fns";
import { useTherapistActions } from "@/auth/hook/admin/useTherapistActions";

const EditScheduleModal = ({ schedule, onClose, onConfirm, isLoading }) => {
  const [formData, setFormData] = useState({
    therapistId: "",
    shiftId: "",
  });

  const { activeTherapists, isLoading: loadingTherapists } =
    useTherapistActions();

  const shifts = [
    { id: 1, name: "Ca sáng" },
    { id: 2, name: "Ca chiều" },
  ];

  useEffect(() => {
    if (schedule) {
      setFormData({
        therapistId: schedule.therapistId,
        shiftId: schedule.shiftId[0],
      });
    }
  }, [schedule]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      therapistId: Number(formData.therapistId),
      workingDate: format(new Date(schedule.workingDate), "yyyy-MM-dd"),
      shiftId: [Number(formData.shiftId)],
    };
    // Pass the schedule.id directly from the schedule object
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
            <label>Therapist:</label>
            {loadingTherapists ? (
              <div className="loading-text">
                <FaSpinner className="spinner" /> Đang tải danh sách
                therapist...
              </div>
            ) : (
              <select
                value={formData.therapistId}
                onChange={(e) =>
                  setFormData({ ...formData, therapistId: e.target.value })
                }
                required
                className="form-control"
              >
                <option value="">-- Chọn Therapist --</option>
                {activeTherapists?.map((therapist) => (
                  <option key={therapist.id} value={therapist.id}>
                    {therapist.fullName}
                  </option>
                ))}
              </select>
            )}
          </div>

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
              {shifts.map((shift) => (
                <option key={shift.id} value={shift.id}>
                  {shift.name}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-page__modal-content-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isLoading || loadingTherapists}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading || loadingTherapists}
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
