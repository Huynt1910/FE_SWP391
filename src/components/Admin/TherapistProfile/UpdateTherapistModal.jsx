import React, { useState, useEffect } from "react";

const UpdateTherapistModal = ({
  isOpen,
  onClose,
  onSubmit,
  updateData,
  setUpdateData,
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (updateData.imgUrl) {
      setPreview(updateData.imgUrl); // Hiển thị hình ảnh hiện tại nếu có
    }
  }, [updateData]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file)); // Hiển thị preview hình ảnh mới
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Thêm các trường vào FormData
    formData.append("fullName", updateData.fullName || "");
    formData.append("email", updateData.email || "");
    formData.append("phone", updateData.phone || "");
    formData.append("address", updateData.address || "");
    formData.append("gender", updateData.gender || "");
    formData.append("birthDate", updateData.birthDate || "");
    formData.append("yearExperience", updateData.yearExperience || "");

    // Xử lý hình ảnh
    if (selectedFile) {
      formData.append("imgUrl", selectedFile); // Gửi hình ảnh mới nếu có
    } else {
      // Nếu không chọn hình ảnh mới, báo lỗi hoặc giữ nguyên hình ảnh hiện tại
      console.error("Hình ảnh không được chọn!");
      return;
    }

    // Log dữ liệu trước khi gửi
    console.log("FormData to send:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value instanceof File ? value.name : value);
    }

    onSubmit(formData); // Gửi dữ liệu lên server
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Cập Nhật Thông Tin</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Họ và tên</label>
            <input
              type="text"
              value={updateData.fullName}
              onChange={(e) =>
                setUpdateData({ ...updateData, fullName: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={updateData.email}
              onChange={(e) =>
                setUpdateData({ ...updateData, email: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>Số điện thoại</label>
            <input
              type="text"
              value={updateData.phone}
              onChange={(e) =>
                setUpdateData({ ...updateData, phone: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>Địa chỉ</label>
            <input
              type="text"
              value={updateData.address}
              onChange={(e) =>
                setUpdateData({ ...updateData, address: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>Giới tính</label>
            <select
              value={updateData.gender}
              onChange={(e) =>
                setUpdateData({ ...updateData, gender: e.target.value })
              }
            >
              <option value="Male">Nam</option>
              <option value="Female">Nữ</option>
            </select>
          </div>
          <div className="form-group">
            <label>Ngày sinh</label>
            <input
              type="date"
              value={updateData.birthDate}
              onChange={(e) =>
                setUpdateData({ ...updateData, birthDate: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>Kinh nghiệm (năm)</label>
            <input
              type="number"
              value={updateData.yearExperience}
              onChange={(e) =>
                setUpdateData({
                  ...updateData,
                  yearExperience: e.target.value,
                })
              }
            />
          </div>
          <div className="form-group">
            <label>Hình ảnh</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {preview && (
              <div className="image-preview">
                <img src={preview} alt="Preview" />
              </div>
            )}
          </div>
          <div className="modal-actions">
            <button type="submit" className="btn btn-primary">
              Lưu
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateTherapistModal;
