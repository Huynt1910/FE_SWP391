import React from "react";
import { FaEdit, FaTrash, FaCheck } from "react-icons/fa";

const ServiceTable = ({ services, onEdit, onToggleStatus }) => {
  if (!services || services.length === 0) {
    return <div className="empty-message">Không có dịch vụ nào</div>;
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="admin-page__table">
      <table>
        <thead>
          <tr>
            <th>Hình ảnh</th>
            <th>Tên dịch vụ</th>
            <th className="description-cell">Mô tả</th>
            <th className="price-cell">Giá</th>
            <th className="duration-cell">Thời gian</th>
            <th>Phân loại</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr
              key={service.serviceId}
              className={!service.isActive ? "inactive-row" : ""}
            >
              <td>
                <img
                  src={service.imgUrl}
                  alt={service.serviceName}
                  className="service-image"
                />
              </td>
              <td>{service.serviceName}</td>
              <td className="description-cell">{service.description}</td>
              <td className="price-cell">{formatPrice(service.price)}</td>
              <td className="duration-cell">{service.duration}</td>
              <td>{service.category}</td>
              <td>
                <span
                  className={`status-badge ${
                    service.isActive
                      ? "status-badge--active"
                      : "status-badge--inactive"
                  }`}
                >
                  {service.isActive ? "Hoạt động" : "Không hoạt động"}
                </span>
              </td>
              <td>
                <div className="action-buttons">
                  <button
                    className="edit-btn"
                    title="Chỉnh sửa"
                    onClick={() => onEdit(service)}
                  >
                    <FaEdit />
                  </button>
                  {service.isActive ? (
                    <button
                      className="delete-btn"
                      title="Ngưng hoạt động"
                      onClick={() => onToggleStatus(service)}
                    >
                      <FaTrash />
                    </button>
                  ) : (
                    <button
                      className="restore-btn"
                      title="Khôi phục hoạt động"
                      onClick={() => onToggleStatus(service)}
                    >
                      <FaCheck />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ServiceTable;
