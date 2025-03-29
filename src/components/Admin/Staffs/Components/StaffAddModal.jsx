import React, { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";

const StaffAddModal = ({ onClose, onConfirm }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    fullName: "",
    email: "",
    phone: "",
    address: "",
    gender: "Female",
    birthDate: "",
  });

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
      // Gửi dữ liệu dưới dạng JSON
      await onConfirm(formData);
      toast.success("Thêm nhân viên thành công!");
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error.response?.data?.message || "Lỗi thêm nhân viên");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-page__modal">
      <div className="admin-page__modal-content">
        <div className="admin-page__modal-content-header">
          <h2>Thêm Nhân viên mới</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          className="admin-page__modal-content-body"
        >
          <div className="form-group">
            <label htmlFor="username">Tên đăng nhập</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="fullName">Họ và tên</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Số điện thoại</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              pattern="[0-9]{10}"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Địa chỉ</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="gender">Giới tính</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="Male">Nam</option>
              <option value="Female">Nữ</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="birthDate">Ngày sinh</label>
            <input
              type="date"
              id="birthDate"
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
                "Thêm"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffAddModal;
