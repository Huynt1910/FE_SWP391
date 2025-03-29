import React, { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";

const StaffEditModal = ({ staff, onClose, onConfirm }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    gender: "Male",
    birthDate: "",
  });

  useEffect(() => {
    if (staff) {
      setFormData({
        fullName: staff.fullName || "",
        email: staff.email || "",
        phone: staff.phone || "",
        address: staff.address || "",
        gender: staff.gender || "Male",
        birthDate: staff.birthDate?.split("T")[0] || "",
      });
    }
  }, [staff]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onConfirm(formData);
    } catch (error) {
      console.error("Error updating staff:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-page__modal">
      <div className="admin-page__modal-content">
        <div className="admin-page__modal-content-header">
          <h2>Chỉnh sửa thông tin Nhân viên</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          className="admin-page__modal-content-body"
        >
          <div className="form-group">
            <label>Họ và tên</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Số điện thoại</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Địa chỉ</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Giới tính</label>
            <select value={formData.gender} onChange={handleChange}>
              <option value="Male">Nam</option>
              <option value="Female">Nữ</option>
            </select>
          </div>

          <div className="form-group">
            <label>Ngày sinh</label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="admin-page__modal-content-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
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

export default StaffEditModal;
