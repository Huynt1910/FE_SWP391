<<<<<<< HEAD
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
=======
import React, { useState } from "react";

const ProfileMyInfo = () => {
  const [username, setUsername] = useState("triuhuynquyn659");
  const [name, setName] = useState("Nguyễn Triệu Huy");
  const [email, setEmail] = useState("hu*******@gmail.com");
  const [phone, setPhone] = useState("********06");
  const [gender, setGender] = useState("Male");
  const [dob, setDob] = useState({ day: "", month: "", year: "" });
  const [image, setImage] = useState(null);
  const [promotions, setPromotions] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = () => {
    setImage(null);
  };

  const handleSave = () => {
    // Add logic to save the updated profile information
    console.log({
      username,
      name,
      email,
      phone,
      gender,
      dob,
      image,
      promotions,
    });
  };

  const handleChangePassword = () => {
    // Add API call to change password
    console.log({ currentPassword, newPassword, confirmPassword });
    setShowPasswordModal(false);
  };

  const handleChangeEmail = () => {
    // Add API call to change email
    console.log({ newEmail });
    setShowEmailModal(false);
  };

  const handleChangePhone = () => {
    // Add API call to change phone
    console.log({ newPhone });
    setShowPhoneModal(false);
  };

  const handleGenderChange = (selectedGender) => {
    setGender(selectedGender);
  };

  const handlePromotionsChange = (e) => {
    setPromotions(e.target.checked);
>>>>>>> 036e585c0a1989822418855a48b6b136afee7f46
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
<<<<<<< HEAD
                value={formData.username}
=======
                value={username}
>>>>>>> 036e585c0a1989822418855a48b6b136afee7f46
                disabled
                className="profile-my-info-input profile-my-info-input-disabled"
              />
            </div>
            <div className="profile-my-info-form-group">
              <label className="profile-my-info-label">Full name</label>
              <input
                type="text"
<<<<<<< HEAD
                value={`${formData.firstName} ${formData.lastName}`}
                onChange={handleNameChange}
=======
                value={name}
                onChange={(e) => setName(e.target.value)}
>>>>>>> 036e585c0a1989822418855a48b6b136afee7f46
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
<<<<<<< HEAD
                      checked={formData.gender === option}
                      onChange={handleChange}
=======
                      checked={gender === option}
                      onChange={() => handleGenderChange(option)}
>>>>>>> 036e585c0a1989822418855a48b6b136afee7f46
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
<<<<<<< HEAD
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
=======
                <select
                  value={dob.day}
                  onChange={(e) => setDob({ ...dob, day: e.target.value })}
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
                  value={dob.month}
                  onChange={(e) => setDob({ ...dob, month: e.target.value })}
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
                  value={dob.year}
                  onChange={(e) => setDob({ ...dob, year: e.target.value })}
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
            <div className="profile-my-info-form-group">
              <label className="profile-my-info-label">
                <input
                  type="checkbox"
                  checked={promotions}
                  onChange={handlePromotionsChange}
                  className="profile-my-info-checkbox"
                />
                Nhận khuyến mãi
              </label>
            </div>
>>>>>>> 036e585c0a1989822418855a48b6b136afee7f46
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
<<<<<<< HEAD
                value={formData.email}
=======
                value={email}
>>>>>>> 036e585c0a1989822418855a48b6b136afee7f46
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
<<<<<<< HEAD
                value={formData.phone}
=======
                value={phone}
>>>>>>> 036e585c0a1989822418855a48b6b136afee7f46
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
