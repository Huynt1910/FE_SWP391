import React, { useState } from "react";

const ProfileMyInfo = () => {
  const [username, setUsername] = useState("triuhuynquyn659");
  const [name, setName] = useState("Nguyễn Triệu Huy");
  const [email, setEmail] = useState("hu*******@gmail.com");
  const [phone, setPhone] = useState("********06");
  const [gender, setGender] = useState("Nam");
  const [dob, setDob] = useState({ day: "", month: "", year: "" });
  const [image, setImage] = useState(null);
  const [promotions, setPromotions] = useState(false);

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

  return (
    <div className={styles["profile-container"]}>
      <div className={styles["profile-title-container"]}>
        <div className={styles["profile-title"]}>Hồ Sơ Của Tôi</div>
      </div>
      <div className={styles["profile-content"]}>
        <div className={styles["profile-info"]}>
          <div className={styles["profile-form-group"]}>
            <label className={styles["profile-label"]}>Tên đăng nhập</label>
            <input
              type="text"
              value={username}
              disabled
              className={`${styles["profile-input"]} ${styles["profile-input-disabled"]}`}
            />
          </div>
          <div className={styles["profile-form-group"]}>
            <label className={styles["profile-label"]}>Tên</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles["profile-input"]}
            />
          </div>
          <div className={styles["profile-form-group"]}>
            <label className={styles["profile-label"]}>Email</label>
            <input
              type="text"
              value={email}
              disabled
              className={`${styles["profile-input"]} ${styles["profile-input-disabled"]}`}
            />
          </div>
          <div className={styles["profile-form-group"]}>
            <label className={styles["profile-label"]}>Số điện thoại</label>
            <input
              type="text"
              value={phone}
              disabled
              className={`${styles["profile-input"]} ${styles["profile-input-disabled"]}`}
            />
          </div>
          <div className={styles["profile-form-group"]}>
            <label className={styles["profile-label"]}>Giới tính</label>
            <div className={styles["profile-radio-group"]}>
              {["Nam", "Nữ", "Khác"].map((option) => (
                <label key={option} className={styles["profile-radio-label"]}>
                  <input
                    type="radio"
                    name="gender"
                    value={option}
                    checked={gender === option}
                    onChange={() => setGender(option)}
                    className={styles["profile-radio-input"]}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
          <div className={styles["profile-form-group"]}>
            <label className={styles["profile-label"]}>Ngày sinh</label>
            <div className={styles["profile-dob-group"]}>
              <select
                value={dob.day}
                onChange={(e) => setDob({ ...dob, day: e.target.value })}
                className={styles["profile-select"]}
              >
                <option value="">Ngày</option>
                {[...Array(31).keys()].map((day) => (
                  <option key={day + 1} value={day + 1}>
                    {day + 1}
                  </option>
                ))}
              </select>
              <select
                value={dob.month}
                onChange={(e) => setDob({ ...dob, month: e.target.value })}
                className={styles["profile-select"]}
              >
                <option value="">Tháng</option>
                {[...Array(12).keys()].map((month) => (
                  <option key={month + 1} value={month + 1}>
                    {month + 1}
                  </option>
                ))}
              </select>
              <select
                value={dob.year}
                onChange={(e) => setDob({ ...dob, year: e.target.value })}
                className={styles["profile-select"]}
              >
                <option value="">Năm</option>
                {[...Array(100).keys()].map((year) => (
                  <option key={year + 1925} value={year + 1925}>
                    {year + 1925}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className={styles["profile-form-group"]}>
            <label className={styles["profile-label"]}>
              <input
                type="checkbox"
                checked={promotions}
                onChange={(e) => setPromotions(e.target.checked)}
                className={styles["profile-checkbox"]}
              />
              Nhận khuyến mãi
            </label>
          </div>
          <button
            onClick={handleSave}
            className={styles["profile-save-button"]}
          >
            Lưu
          </button>
        </div>
        <div className={styles["profile-image-section"]}>
          <div className={styles["profile-image-container"]}>
            {image ? (
              <img
                src={image}
                alt="Avatar"
                className={styles["profile-image"]}
              />
            ) : (
              <div className={styles["profile-image-placeholder"]}>Ảnh</div>
            )}
          </div>
          <div className={styles["profile-buttons"]}>
            <label className={styles["profile-file-label"]}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className={styles["profile-file-input"]}
              />
              Chọn ảnh
            </label>
            <button
              onClick={handleDeleteImage}
              className={styles["profile-delete-button"]}
            >
              Xóa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileMyInfo;
