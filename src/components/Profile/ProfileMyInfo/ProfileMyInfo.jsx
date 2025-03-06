import React, { useState, useEffect } from "react";
import { useMyInfo } from "@auth/hook/useMyInfo";

const ProfileMyInfo = () => {
  // Sử dụng hook useMyInfo để lấy thông tin người dùng từ server
  const { profile, isLoading, error } = useMyInfo();

  // State để lưu thông tin form
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
    birthDate: "",
  });
  // State riêng quản lý day, month, year của birthday
  const [dob, setDob] = useState({
    day: "",
    month: "",
    year: "",
  });

  // Khi user data từ useMyInfo có giá trị, cập nhật formData
  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  // Khi formData.birthDate thay đổi, parse thành day, month, year
  useEffect(() => {
    if (formData.birthDate) {
      const parts = formData.birthDate.split("-");
      if (parts.length === 3) {
        setDob({
          year: parts[0],
          month: parts[1],
          day: parts[2],
        });
      }
    }
  }, [formData.birthDate]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching user information.</div>;

  // Các hàm xử lý khác (handleChange, handleSave, etc) vẫn tương tự
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    // Call API cập nhật thông tin, ví dụ updateUserInfo(token, formData)
    try {
      const updatedUser = await updateUserInfo(formData);
      setFormData(updatedUser);
      alert("Cập nhật thành công!");
    } catch (error) {
      alert("Cập nhật thất bại!");
    }
  };
  const handleNameChange = (e) => {
    const [first, ...last] = e.target.value.split(" ");
    setFormData((prev) => ({
      ...prev,
      firstName: first,
      lastName: last.join(" "),
    }));
  };
  const handleDobChange = (e) => {
    const { name, value } = e.target;
    const newDob = { ...dob, [name]: value };
    setDob(newDob);

    // Cập nhật lại birthDate trong formData
    if (newDob.year && newDob.month && newDob.day) {
      setFormData((prev) => ({
        ...prev,
        birthDate: `${newDob.year}-${newDob.month}-${newDob.day}`,
      }));
    }
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
                value={`${formData.firstName} ${formData.lastName}`}
                onChange={handleNameChange}
                className="profile-my-info-input"
              />
            </div>
            <div className="profile-my-info-form-group">
              <label className="profile-my-info-label">Gender</label>
              <div className="profile-my-info-radio-group">
                {["Male", "Female", "Other"].map((option) => (
                  <label key={option} className="profile-my-info-radio-label">
                    <input
                      type="radio"
                      name="gender"
                      value={option}
                      checked={formData.gender === option}
                      onChange={handleChange}
                      className="profile-my-info-radio-input"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
            <div className="profile-my-info-form-group">
              <label className="profile-my-info-label">Birthday</label>
              <div className="profile-my-info-dob-group">
                <select name="day" value={dob.day} onChange={handleDobChange}>
                  ...
                </select>
                <select
                  name="month"
                  value={dob.month}
                  onChange={handleDobChange}
                >
                  ...
                </select>
                <select name="year" value={dob.year} onChange={handleDobChange}>
                  ...
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
              {image ? (
                <img
                  src={image}
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
