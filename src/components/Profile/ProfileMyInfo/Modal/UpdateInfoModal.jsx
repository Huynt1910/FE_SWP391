// components/UpdateInfoModal.jsx
import React from "react";

const UpdateInfoModal = ({
  updateFormData,
  setUpdateFormData,
  onSubmit,
  onCancel,
}) => {
  return (
    <div className="profile-my-info-modal-overlay">
      <div className="profile-my-info-modal">
        <h3>Update Information</h3>
        <div className="profile-my-info-form-group">
          <label>First Name</label>
          <input
            type="text"
            value={updateFormData.firstName}
            onChange={(e) =>
              setUpdateFormData((prev) => ({
                ...prev,
                firstName: e.target.value,
              }))
            }
            className="profile-my-info-input"
            placeholder="Enter first name"
          />
        </div>
        <div className="profile-my-info-form-group">
          <label>Last Name</label>
          <input
            type="text"
            value={updateFormData.lastName}
            onChange={(e) =>
              setUpdateFormData((prev) => ({
                ...prev,
                lastName: e.target.value,
              }))
            }
            className="profile-my-info-input"
            placeholder="Enter last name"
          />
        </div>
        <div className="profile-my-info-form-group">
          <label>Birth Date</label>
          <input
            type="date"
            value={updateFormData.birthDate}
            onChange={(e) =>
              setUpdateFormData((prev) => ({
                ...prev,
                birthDate: e.target.value,
              }))
            }
            className="profile-my-info-input"
          />
        </div>
        <div className="profile-my-info-form-group">
          <label>Gender</label>
          <select
            value={updateFormData.gender}
            onChange={(e) =>
              setUpdateFormData((prev) => ({
                ...prev,
                gender: e.target.value,
              }))
            }
            className="profile-my-info-input"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="profile-my-info-form-group">
          <label>Address</label>
          <textarea
            value={updateFormData.address}
            onChange={(e) =>
              setUpdateFormData((prev) => ({
                ...prev,
                address: e.target.value,
              }))
            }
            className="profile-my-info-input"
            rows={3}
            placeholder="Enter address"
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

export default UpdateInfoModal;
