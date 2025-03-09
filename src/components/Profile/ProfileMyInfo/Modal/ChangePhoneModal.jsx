// components/ChangePhoneModal.jsx
import React from "react";

const ChangePhoneModal = ({ newPhone, setNewPhone, onSubmit, onCancel }) => {
  return (
    <div className="profile-my-info-modal-overlay">
      <div className="profile-my-info-modal">
        <h3>Change Phone Number</h3>
        <input
          type="tel"
          value={newPhone}
          onChange={(e) => setNewPhone(e.target.value)}
          placeholder="Enter new phone number"
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

export default ChangePhoneModal;
