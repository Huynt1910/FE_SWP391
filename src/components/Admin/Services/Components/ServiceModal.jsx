import React from "react";
import { FaCloudUploadAlt } from "react-icons/fa";

const ServiceModal = ({
  show,
  onClose,
  formData,
  onSubmit,
  onChange,
  imagePreview,
  onImageClick,
  fileInputRef,
  onImageChange,
  isCreating,
}) => {
  if (!show) return null;

  return (
    <div className="admin-page__modal">
      <div className="admin-page__modal-content">
        <div className="admin-page__modal-content-header">
          <h2>Thêm dịch vụ mới</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <form onSubmit={onSubmit} className="admin-page__modal-content-body">
          <div className="form-group">
            <label>Tên dịch vụ</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={onChange}
              placeholder="Nhập tên dịch vụ"
              required
            />
          </div>

          <div className="form-group">
            <label>Mô tả</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={onChange}
              placeholder="Nhập mô tả dịch vụ"
              required
            />
          </div>

          <div className="form-group">
            <label>Giá dịch vụ (VNĐ)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={onChange}
              placeholder="Nhập giá dịch vụ"
              required
              min="0"
              step="1000"
            />
          </div>

          <div className="form-group">
            <label>Thời gian (HH:mm)</label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={onChange}
              placeholder="VD: 01:45"
              required
              pattern="[0-9]{2}:[0-9]{2}"
            />
          </div>

          <div className="form-group">
            <label>Trạng thái</label>
            <select name="active" value={formData.active} onChange={onChange}>
              <option value="true">Hoạt động</option>
              <option value="false">Tạm ngưng</option>
            </select>
          </div>

          <div className="form-group">
            <label>Hình ảnh</label>
            <div className="image-upload" onClick={onImageClick}>
              {imagePreview ? (
                <div className="image-preview">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="service-image"
                  />
                </div>
              ) : (
                <div className="upload-placeholder">
                  <FaCloudUploadAlt size={40} />
                  <p>Click để tải ảnh lên hoặc kéo thả file vào đây</p>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={onImageChange}
                accept="image/*"
                style={{ display: "none" }}
              />
            </div>
          </div>

          <div className="admin-page__modal-content-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isCreating}
            >
              {isCreating ? "Đang xử lý..." : "Thêm dịch vụ"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceModal;
