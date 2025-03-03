import { useMyInfo } from "@/auth/hook/useMyInfo";
import React, { useState, useEffect } from "react";

const ProfileMyInfo = () => {
  const [formData, setFormData] = useState({
    username: "",
    fullname: "",
    email: "",
    phone: "",
    gender: "",
    dob: {
      day: "",
      month: "",
      year: "",
    },
    image: null,
  });
  const { profileData, isPending, isError, isSuccess, error } = useMyInfo();

  // Update form data when profileData is available
  useEffect(() => {
    if (profileData) {
      setFormData(profileData);
    }
  }, [profileData]);

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () =>
        setFormData((prev) => ({ ...prev, image: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  // Delete image
  const handleDeleteImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
  };

  // Handle changes to form fields
  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDobChange = (field) => (event) => {
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      dob: {
        ...prev.dob,
        [field]: value,
      },
    }));
  };

  const handleSave = () => {
    // Implement save logic here
    console.log("Saved form data:", formData);
  };

  return (
    <div className="profile-my-info-container">
      <div className="profile-my-info-title-container">
        <div className="profile-my-info-title">Hồ Sơ Của Tôi</div>
      </div>

      <div className="profile-my-info-content">
        {/* Personal info and image sections */}
        <div className="profile-my-info-info-container">
          <div className="profile-my-info-personal-section">
            <div className="profile-my-info-info-title">Thông tin cá nhân</div>
            <div className="profile-my-info-form-group">
              <label className="profile-my-info-label">Username</label>
              <input
                type="text"
                value={formData.username}
                disabled
                className="profile-my-info-input profile-my-info-input-disabled"
              />
            </div>
            <div className="profile-my-info-form-group">
              <label className="profile-my-info-label">Full name</label>
              <input
                type="text"
                value={formData.fullname}
                onChange={handleInputChange("fullname")}
                className="profile-my-info-input"
              />
            </div>
            <div className="profile-my-info-form-group">
              <label className="profile-my-info-label">Gender</label>
              <select
                value={formData.gender}
                onChange={handleInputChange("gender")}
                className="profile-my-info-input"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="profile-my-info-form-group">
              <label className="profile-my-info-label">Birthday</label>
              <div className="profile-my-info-dob-group">
                <select
                  value={formData.dob.day}
                  onChange={handleDobChange("day")}
                  className="profile-my-info-select"
                >
                  <option value="">Day</option>
                  {[...Array(31).keys()].map((day) => (
                    <option key={day + 1} value={day + 1}>
                      {day + 1}
                    </option>
                  ))}
                </select>
                <select
                  value={formData.dob.month}
                  onChange={handleDobChange("month")}
                  className="profile-my-info-select"
                >
                  <option value="">Month</option>
                  {[...Array(12).keys()].map((month) => (
                    <option key={month + 1} value={month + 1}>
                      {month + 1}
                    </option>
                  ))}
                </select>
                <select
                  value={formData.dob.year}
                  onChange={handleDobChange("year")}
                  className="profile-my-info-select"
                >
                  <option value="">Year</option>
                  {[...Array(100).keys()].map((year) => (
                    <option key={year + 1925} value={year + 1925}>
                      {year + 1925}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleSave}
              className="profile-my-info-save-button"
            >
              Save
            </button>
          </div>

          <div className="profile-my-info-image-section">
            <div className="profile-my-info-image-container">
              {formData.image ? (
                <img
                  src={formData.image}
                  alt="Avatar"
                  className="profile-my-info-image"
                />
              ) : (
                <div className="profile-my-info-image-placeholder">Ảnh</div>
              )}
            </div>
            <div className="profile-my-info-buttons">
              <label className="profile-my-info-file-label">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="profile-my-info-file-input"
                />
                Chọn ảnh
              </label>
              <button
                onClick={handleDeleteImage}
                className="profile-my-info-delete-button"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>

        {/* Security section */}
        <div className="profile-my-info-security-section">
          <div className="profile-my-info-security-title">
            Bảo mật thông tin
          </div>
          <div className="profile-my-info-form-group">
            <label className="profile-my-info-label">Email</label>
            <div className="profile-my-info-input-group">
              <input
                type="text"
                value={formData.email}
                disabled
                className="profile-my-info-input profile-my-info-input-disabled"
              />
              <button
                onClick={() => setShowEmailModal(true)}
                className="profile-my-info-change-button"
              >
                Change
              </button>
            </div>
          </div>

          <div className="profile-my-info-form-group">
            <label className="profile-my-info-label">Phone</label>
            <div className="profile-my-info-input-group">
              <input
                type="text"
                value={formData.phone}
                disabled
                className="profile-my-info-input profile-my-info-input-disabled"
              />
              <button
                onClick={() => setShowPhoneModal(true)}
                className="profile-my-info-change-button"
              >
                Change
              </button>
            </div>
          </div>
          <div className="profile-my-info-form-group">
            <div className="profile-my-info-input-group">
              <button
                onClick={() => setShowPasswordModal(true)}
                className="profile-my-info-change-button"
              >
                Change password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ProfileMyInfo };
