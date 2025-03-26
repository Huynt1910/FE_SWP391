import React, { useState } from "react";
import { toast } from "react-toastify";

const AddCustomerModal = ({ onClose, onConfirm, isLoading }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    gender: "Male",
    birthDate: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Kiểm tra dữ liệu trước khi gửi
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.phone ||
      !formData.birthDate
    ) {
      toast.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    onConfirm(formData); // Gọi hàm xác nhận từ component cha
  };

  return (
    <div className="admin-page__modal">
      <div className="admin-page__modal-content">
        <div className="admin-page__modal-content-header">
          <h2>Thêm khách hàng mới</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          className="admin-page__modal-content-body"
        >
          <div className="form-group">
            <label>Họ</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              required
              placeholder="Nhập họ"
            />
          </div>
          <div className="form-group">
            <label>Tên</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              required
              placeholder="Nhập tên"
            />
          </div>
          <div className="form-group">
            <label>Số điện thoại</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              required
              placeholder="Nhập số điện thoại"
            />
          </div>
          <div className="form-group">
            <label>Giới tính</label>
            <select
              value={formData.gender}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
              required
            >
              <option value="Male">Nam</option>
              <option value="Female">Nữ</option>
            </select>
          </div>
          <div className="form-group">
            <label>Ngày sinh</label>
            <input
              type="date"
              value={formData.birthDate}
              onChange={(e) =>
                setFormData({ ...formData, birthDate: e.target.value })
              }
              required
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
              {isLoading ? "Đang xử lý..." : "Xác nhận"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCustomerModal;
