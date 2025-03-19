import React from "react";
import { FaEdit, FaTrash, FaCheck } from "react-icons/fa";

const ServiceTable = ({ services, onEdit, onToggleStatus }) => {
  const servicesList = services?.result || [];

  return (
    <div className="admin-page__table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Hình ảnh</th>
            <th>Tên dịch vụ</th>
            <th>Mô tả</th>
            <th>Giá</th>
            <th>Thời gian</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {servicesList.length > 0 ? (
            servicesList.map((service) => (
              <tr key={service.serviceId}>
                <td>{service.serviceId}</td>
                <td>
                  <div className="image-preview">
                    <img
                      src={service.imgUrl}
                      alt={service.serviceName}
                      onError={(e) => {
                        e.target.src = "/default-service.png";
                      }}
                    />
                  </div>
                </td>
                <td>{service.serviceName}</td>
                <td>{service.description}</td>
                <td className="price-cell">
                  {service.price?.toLocaleString("vi-VN")}đ
                </td>
                <td className="duration-cell">{service.duration}</td>
                <td>
                  <span
                    className={`status-badge status-badge--${
                      service.isActive ? "active" : "inactive"
                    }`}
                  >
                    {service.isActive ? "Đang hoạt động" : "Ngưng hoạt động"}
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
                        title="Kích hoạt"
                        onClick={() => onToggleStatus(service)}
                      >
                        <FaCheck />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="no-data">
                Không có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ServiceTable;
