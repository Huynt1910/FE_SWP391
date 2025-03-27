import React from "react";

const ChangePasswordModal = ({
  isOpen,
  onClose,
  onSubmit,
  passwordData,
  setPasswordData,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2 className="modal-title">Đổi mật khẩu</h2>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label className="form-label">Mật khẩu cũ</label>
            <input
              type="password"
              className="form-input"
              value={passwordData.oldPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  oldPassword: e.target.value,
                })
              }
            />
          </div>
          <div className="form-group">
            <label className="form-label">Mật khẩu mới</label>
            <input
              type="password"
              className="form-input"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  newPassword: e.target.value,
                })
              }
            />
          </div>
          <div className="form-group">
            <label className="form-label">Nhập lại mật khẩu mới</label>
            <input
              type="password"
              className="form-input"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  confirmPassword: e.target.value,
                })
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

export default ChangePasswordModal;
