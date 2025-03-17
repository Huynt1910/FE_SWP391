import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const ServiceTable = ({ services, sortConfig, onSort, onEdit, onDelete }) => {
  return (
    <div className="admin-page__table">
      <table>
        <thead>
          <tr>
            <th onClick={() => onSort("serviceName")}>
              Tên dịch vụ
              {sortConfig.key === "serviceName" && (
                <span className="sort-indicator">
                  {sortConfig.direction === "asc" ? " ↑" : " ↓"}
                </span>
              )}
            </th>
            {/* ...other headers... */}
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service.serviceId}>
              <td>{service.serviceName}</td>
              <td>{service.description}</td>
              <td className="price-cell">
                {new Intl.NumberFormat("vi-VN").format(service.price)}
              </td>
              <td className="duration-cell">{service.duration}</td>
              <td>
                <span
                  className={`status-badge status-badge--${
                    service.isActive ? "active" : "inactive"
                  }`}
                >
                  {service.isActive ? "Hoạt động" : "Tạm ngưng"}
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
                  <button
                    className="delete-btn"
                    title="Xóa"
                    onClick={() => onDelete(service)}
                  >
                    <FaTrash />
                  </button>
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
