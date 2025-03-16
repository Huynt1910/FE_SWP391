import React, { useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaSpinner } from "react-icons/fa";
import { useGetAllServices } from "@/auth/hook/admin/useGetAllServicesHook";
import { useCreateServices } from "@/auth/hook/admin/useCreateServicesHook";

function Services() {
  const { data: services, isLoading } = useGetAllServices();
  const { createService } = useCreateServices();
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    active: true,
    image: "",
  });

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? e.target.checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createService.mutateAsync(formData);
      setShowModal(false);
      setFormData({
        name: "",
        description: "",
        price: "",
        duration: "",
        active: true,
        image: "",
      });
    } catch (error) {
      console.error("Error creating service:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="admin-page__loading">
        <FaSpinner className="spinner" /> Loading...
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div className="admin-page__header-title">
          <h1>Quản lý dịch vụ</h1>
          <p>Quản lý thông tin các dịch vụ của spa</p>
        </div>
        <div className="admin-page__header-actions">
          <button
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            <FaPlus /> Thêm dịch vụ
          </button>
        </div>
      </div>

      <div className="admin-page__table">
        <table>
          <thead>
            <tr>
              <th>Tên dịch vụ</th>
              <th>Mô tả</th>
              <th>Giá (VNĐ)</th>
              <th>Thời gian</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {services?.map((service) => (
              <tr key={service.id}>
                <td>{service.serviceName}</td>
                <td>{service.description}</td>
                <td>{new Intl.NumberFormat("vi-VN").format(service.price)}</td>
                <td>{service.duration}</td>
                <td>
                  <span
                    className={`status-badge ${
                      service.isActive ? "active" : "inactive"
                    }`}
                  >
                    {service.isActive ? "Hoạt động" : "Tạm ngưng"}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="edit-btn">
                      <FaEdit />
                    </button>
                    <button className="delete-btn">
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="admin-page__modal">
          <div className="admin-page__modal-content">
            <div className="admin-page__modal-header">
              <h2>Thêm dịch vụ mới</h2>
              <button onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tên dịch vụ</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Mô tả</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Giá dịch vụ (VNĐ)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Thời gian (phút)</label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Trạng thái</label>
                <select
                  name="active"
                  value={formData.active}
                  onChange={handleInputChange}
                >
                  <option value={true}>Hoạt động</option>
                  <option value={false}>Tạm ngưng</option>
                </select>
              </div>
              <div className="form-group">
                <label>Hình ảnh URL</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setShowModal(false)}>
                  Hủy
                </button>
                <button type="submit" disabled={createService.isLoading}>
                  {createService.isLoading ? "Đang xử lý..." : "Thêm dịch vụ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Services;
