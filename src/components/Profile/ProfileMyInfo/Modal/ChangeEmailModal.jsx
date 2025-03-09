// components/ChangeEmailModal.jsx
import React from "react";

const ChangeEmailModal = ({ newEmail, setNewEmail, onSubmit, onCancel }) => {
  return (
    <div className="profile-my-info-modal-overlay">
      <div className="profile-my-info-modal">
        <h3>Change Email</h3>
        <input
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          placeholder="Enter new email"
          className="profile-my-info-input"
        />
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

export default ChangeEmailModal;
