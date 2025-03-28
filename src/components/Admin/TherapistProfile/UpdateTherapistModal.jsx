import React from "react";

const UpdateTherapistModal = ({
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
        <div className="modal-header">
          <h2>Cập nhật thông tin</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Họ và tên</label>
            <input
              type="text"
              value={updateData.fullName}
              onChange={(e) =>
                setUpdateData({ ...updateData, fullName: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={updateData.email}
              onChange={(e) =>
                setUpdateData({ ...updateData, email: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>Số điện thoại</label>
            <input
              type="text"
              value={updateData.phone}
              onChange={(e) =>
                setUpdateData({ ...updateData, phone: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>Địa chỉ</label>
            <input
              type="text"
              value={updateData.address}
              onChange={(e) =>
                setUpdateData({ ...updateData, address: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>Giới tính</label>
            <input
              type="text"
              value={updateData.gender}
              onChange={(e) =>
                setUpdateData({ ...updateData, gender: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>Ngày sinh</label>
            <input
              type="date"
              value={updateData.birthDate}
              onChange={(e) =>
                setUpdateData({ ...updateData, birthDate: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>Kinh nghiệm (năm)</label>
            <input
              type="number"
              value={updateData.yearExperience}
              onChange={(e) =>
                setUpdateData({ ...updateData, yearExperience: e.target.value })
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

export default UpdateTherapistModal;
