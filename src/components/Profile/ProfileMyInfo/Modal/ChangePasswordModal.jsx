import React from "react";

const ChangePasswordModal = ({
  passwordData,
  setPasswordData,
  onSubmit,
  onCancel,
}) => {
  return (
    <div className="profile-my-info-modal-overlay">
      <div className="profile-my-info-modal">
        <h3>Change Password</h3>
        <div className="profile-my-info-form-group">
          <label>Current Password</label>
          <input
            type="password"
            value={passwordData.oldPassword}
            onChange={(e) =>
              setPasswordData((prev) => ({
                ...prev,
                oldPassword: e.target.value,
              }))
            }
            className="profile-my-info-input"
            placeholder="Enter current password"
          />
        </div>
        <div className="profile-my-info-form-group">
          <label>New Password</label>
          <input
            type="password"
            value={passwordData.newPassword}
            onChange={(e) =>
              setPasswordData((prev) => ({
                ...prev,
                newPassword: e.target.value,
              }))
            }
            className="profile-my-info-input"
            placeholder="Enter new password"
          />
        </div>
        <div className="profile-my-info-form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            value={passwordData.confirmPassword}
            onChange={(e) =>
              setPasswordData((prev) => ({
                ...prev,
                confirmPassword: e.target.value,
              }))
            }
            className="profile-my-info-input"
            placeholder="Confirm new password"
          />
        </div>
        <div className="profile-my-info-modal-buttons">
          <button onClick={onSubmit} className="profile-my-info-submit-button">
            Submit
          </button>
          <button onClick={onCancel} className="profile-my-info-cancel-button">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
