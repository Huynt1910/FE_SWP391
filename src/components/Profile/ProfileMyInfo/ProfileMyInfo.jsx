import React, { useState } from "react";
import styles from "./ProfileMyInfo.module.scss";

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
  };

  return (
    <div className={styles["profileMyInfo-container"]}>
      <div className={styles["profileMyInfo-title-container"]}>
        <div className={styles["profileMyInfo-title"]}>Profile</div>
      </div>

      <div className={styles["profileMyInfo-content"]}>
        {/* Top section with security and image */}
        <div className={styles["profileMyInfo-top-section"]}>
          <div className={styles["profileMyInfo-left-section"]}>
            <div className={styles["profileMyInfo-security-section"]}>
              <div className={styles["profileMyInfo-security-title"]}>
                Security
              </div>
              <div className={styles["profileMyInfo-form-group"]}>
                <label className={styles["profileMyInfo-label"]}>Email</label>
                <div className={styles["profileMyInfo-input-group"]}>
                  <input
                    type="text"
                    value={email}
                    disabled
                    className={`${styles["profileMyInfo-input"]} ${styles["profileMyInfo-input-disabled"]}`}
                  />
                  <button
                    onClick={() => setShowEmailModal(true)}
                    className={styles["profileMyInfo-change-button"]}
                  >
                    Change
                  </button>
                </div>
              </div>

              <div className={styles["profileMyInfo-form-group"]}>
                <label className={styles["profileMyInfo-label"]}>Phone</label>
                <div className={styles["profileMyInfo-input-group"]}>
                  <input
                    type="text"
                    value={phone}
                    disabled
                    className={`${styles["profileMyInfo-input"]} ${styles["profileMyInfo-input-disabled"]}`}
                  />
                  <button
                    onClick={() => setShowPhoneModal(true)}
                    className={styles["profileMyInfo-change-button"]}
                  >
                    Change
                  </button>
                </div>
              </div>
              <button
                onClick={() => setShowPasswordModal(true)}
                className={styles["profileMyInfo-password-button"]}
              >
                Change password
              </button>
            </div>
          </div>

          <div className={styles["profileMyInfo-right-section"]}>
            <div className={styles["profileMyInfo-image-section"]}>
              <div className={styles["profileMyInfo-image-container"]}>
                {image ? (
                  <img
                    src={image}
                    alt="Avatar"
                    className={styles["profileMyInfo-image"]}
                  />
                ) : (
                  <div className={styles["profileMyInfo-image-placeholder"]}>
                    Picture
                  </div>
                )}
              </div>
              <div className={styles["profileMyInfo-buttons"]}>
                <label className={styles["profileMyInfo-file-label"]}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className={styles["profileMyInfo-file-input"]}
                  />
                  Add
                </label>
                <button
                  onClick={handleDeleteImage}
                  className={styles["profileMyInfo-delete-button"]}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section with personal info */}
        <div className={styles["profileMyInfo-personal-section"]}>
          <div className={styles["profileMyInfo-info-title"]}>Information</div>
          <div className={styles["profileMyInfo-form-group"]}>
            <label className={styles["profileMyInfo-label"]}>Username</label>
            <input
              type="text"
              value={username}
              disabled
              className={`${styles["profileMyInfo-input"]} ${styles["profileMyInfo-input-disabled"]}`}
            />
          </div>
          <div className={styles["profileMyInfo-form-group"]}>
            <label className={styles["profileMyInfo-label"]}>Full name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles["profileMyInfo-input"]}
            />
          </div>
          <div className={styles["profileMyInfo-form-group"]}>
            <label className={styles["profileMyInfo-label"]}>Gender</label>
            <div className={styles["profileMyInfo-radio-group"]}>
              {["Male", "Female", "Other"].map((option) => (
                <label
                  key={option}
                  className={styles["profileMyInfo-radio-label"]}
                >
                  <input
                    type="radio"
                    name="gender"
                    value={option}
                    checked={gender === option}
                    onChange={() => handleGenderChange(option)}
                    className={styles["profileMyInfo-radio-input"]}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
          <div className={styles["profileMyInfo-form-group"]}>
            <label className={styles["profileMyInfo-label"]}>Birthday</label>
            <div className={styles["profileMyInfo-dob-group"]}>
              <select
                value={dob.day}
                onChange={(e) => setDob({ ...dob, day: e.target.value })}
                className={styles["profileMyInfo-select"]}
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
                className={styles["profileMyInfo-select"]}
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
                className={styles["profileMyInfo-select"]}
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
          <div className={styles["profileMyInfo-form-group"]}>
            <label className={styles["profileMyInfo-label"]}>
              <input
                type="checkbox"
                checked={promotions}
                onChange={handlePromotionsChange}
                className={styles["profileMyInfo-checkbox"]}
              />
              Nhận khuyến mãi
            </label>
          </div>
          <button
            onClick={handleSave}
            className={styles["profileMyInfo-save-button"]}
          >
            Save
          </button>
        </div>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className={styles["profileMyInfo-modal"]}>
          <div className={styles["profileMyInfo-modal-content"]}>
            <h3>Change password</h3>
            <input
              type="password"
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={styles["profileMyInfo-input"]}
            />
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={styles["profileMyInfo-input"]}
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={styles["profileMyInfo-input"]}
            />
            <div className={styles["profileMyInfo-modal-buttons"]}>
              <button onClick={handleChangePassword}>Confirm</button>
              <button onClick={() => setShowPasswordModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Modal */}
      {showEmailModal && (
        <div className={styles["profileMyInfo-modal"]}>
          <div className={styles["profileMyInfo-modal-content"]}>
            <h3>Change email</h3>
            <input
              type="email"
              placeholder="Enter new email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className={styles["profileMyInfo-input"]}
            />
            <div className={styles["profileMyInfo-modal-buttons"]}>
              <button onClick={handleChangeEmail}>Confirm</button>
              <button onClick={() => setShowEmailModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Phone Modal */}
      {showPhoneModal && (
        <div className={styles["profileMyInfo-modal"]}>
          <div className={styles["profileMyInfo-modal-content"]}>
            <h3>Change phone number</h3>
            <input
              type="tel"
              placeholder="Enter new phone number"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              className={styles["profileMyInfo-input"]}
            />
            <div className={styles["profileMyInfo-modal-buttons"]}>
              <button onClick={handleChangePhone}>Confirm</button>
              <button onClick={() => setShowPhoneModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { ProfileMyInfo };
