import React from "react";

const UpdateStaffModal = ({
  isOpen,
  onClose,
  onSubmit,
  updateData,
  setUpdateData,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2 className="modal-title">Cập nhật thông tin</h2>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label className="form-label">Họ và tên</label>
            <input
              type="text"
              className="form-input"
              value={updateData.fullName}
              onChange={(e) =>
                setUpdateData({ ...updateData, fullName: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              value={updateData.email}
              onChange={(e) =>
                setUpdateData({ ...updateData, email: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label className="form-label">Số điện thoại</label>
            <input
              type="text"
              className="form-input"
              value={updateData.phone}
              onChange={(e) =>
                setUpdateData({ ...updateData, phone: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label className="form-label">Địa chỉ</label>
            <input
              type="text"
              className="form-input"
              value={updateData.address}
              onChange={(e) =>
                setUpdateData({ ...updateData, address: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label className="form-label">Giới tính</label>
            <select
              className="form-select"
              value={updateData.gender}
              onChange={(e) =>
                setUpdateData({ ...updateData, gender: e.target.value })
              }
            >
              <option value="Male">Nam</option>
              <option value="Female">Nữ</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Ngày sinh</label>
            <input
              type="date"
              className="form-input"
              value={updateData.birthDate}
              onChange={(e) =>
                setUpdateData({ ...updateData, birthDate: e.target.value })
              }
            />
          </div>
          <div className="modal-actions">
            <button type="submit" className="btn btn-primary">
              Lưu
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateStaffModal;
