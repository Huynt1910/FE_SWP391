import React, { useState, useEffect } from "react";
import { useMyInfo } from "@auth/hook/useMyInfo";

export const ProfileMyInfo = () => {
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
    birthDate: "",
  });

  const [dob, setDob] = useState({ day: "", month: "", year: "" });
  const [editMode, setEditMode] = useState(false);

  const { data, isLoading, error } = useMyInfo();

  useEffect(() => {
    if (data && data.profile) {
      console.log("Profile received:", data.profile);
      setFormData(data.profile);
    }
  }, [data]);

  // Parse birthDate to dob if cần thiết
  useEffect(() => {
    if (formData.birthDate) {
      const parts = formData.birthDate.split("-");
      if (parts.length === 3) {
        setDob({ year: parts[0], month: parts[1], day: parts[2] });
      }
    }
  }, [formData.birthDate]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Example submit handler - gọi API updateUserInfo
  const handleSubmit = async () => {
    try {
      const updatedData = await updateUserInfo(formData);
      // Cập nhật lại state nếu cần
      setFormData(updatedData);
      setEditMode(false);
      alert("Cập nhật thành công!");
    } catch (err) {
      console.error(err);
      alert("Cập nhật thất bại!");
    }
  };

  return (
    <div className="profile-my-info-container">
      <div className="profile-my-info-title-container">
        <div className="profile-my-info-title">Hồ Sơ Của Tôi</div>
        {/* Nút chuyển sang chế độ edit */}
        {!editMode && (
          <button
            onClick={() => setEditMode(true)}
            className="profile-my-info-update-button"
          >
            Update Info
          </button>
        )}
      </div>

      <div className="profile-my-info-content">
        {/* Personal info section */}
        <div className="profile-my-info-info-container">
          <div className="profile-my-info-personal-section">
            <div className="profile-my-info-info-title">Thông tin cá nhân</div>
            <div className="profile-my-info-form-group">
              <label className="profile-my-info-label">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username || ""}
                disabled // Username không cho chỉnh sửa
                className="profile-my-info-input profile-my-info-input-disabled"
              />
            </div>
            <div className="profile-my-info-form-group">
              <label className="profile-my-info-label">Full name</label>
              <input
                type="text"
                placeholder="Full name"
                value={`${formData.firstName} ${formData.lastName}`}
                disabled={!editMode}
                onChange={(e) => {
                  const names = e.target.value.split(" ");
                  setFormData((prev) => ({
                    ...prev,
                    firstName: names[0] || "",
                    lastName: names.slice(1).join(" ") || "",
                  }));
                }}
                className={`profile-my-info-input ${
                  editMode ? "" : "profile-my-info-input-disabled"
                }`}
              />
            </div>
            <div className="profile-my-info-form-group">
              <label className="profile-my-info-label">Email</label>
              <input
                type="text"
                name="email"
                placeholder="Email"
                value={formData.email || ""}
                disabled={!editMode}
                onChange={handleInputChange}
                className={`profile-my-info-input ${
                  editMode ? "" : "profile-my-info-input-disabled"
                }`}
              />
            </div>
            <div className="profile-my-info-form-group">
              <label className="profile-my-info-label">Phone</label>
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={formData.phone || ""}
                disabled={!editMode}
                onChange={handleInputChange}
                className={`profile-my-info-input ${
                  editMode ? "" : "profile-my-info-input-disabled"
                }`}
              />
            </div>
            <div className="profile-my-info-form-group">
              <label className="profile-my-info-label">Gender</label>
              <input
                type="text"
                name="gender"
                placeholder="Gender"
                value={formData.gender || ""}
                disabled={!editMode}
                onChange={handleInputChange}
                className={`profile-my-info-input ${
                  editMode ? "" : "profile-my-info-input-disabled"
                }`}
              />
            </div>
            <div className="profile-my-info-form-group">
              <label className="profile-my-info-label">Birth Date</label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate || ""}
                disabled={!editMode}
                onChange={handleInputChange}
                className={`profile-my-info-input ${
                  editMode ? "" : "profile-my-info-input-disabled"
                }`}
              />
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
                name="email"
                value={formData.email || ""}
                disabled={!editMode}
                onChange={handleInputChange}
                className={`profile-my-info-input ${
                  editMode ? "" : "profile-my-info-input-disabled"
                }`}
              />
            </div>
          </div>
          <div className="profile-my-info-form-group">
            <label className="profile-my-info-label">Phone</label>
            <div className="profile-my-info-input-group">
              <input
                type="text"
                name="phone"
                value={formData.phone || ""}
                disabled={!editMode}
                onChange={handleInputChange}
                className={`profile-my-info-input ${
                  editMode ? "" : "profile-my-info-input-disabled"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Nếu đang ở chế độ edit, hiển thị nút Submit và Cancel */}
        {editMode && (
          <div className="profile-my-info-form-actions">
            <button
              onClick={handleSubmit}
              className="profile-my-info-submit-button"
            >
              Submit
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="profile-my-info-cancel-button"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileMyInfo;
