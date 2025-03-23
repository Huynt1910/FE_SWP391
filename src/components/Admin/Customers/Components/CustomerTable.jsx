import React from "react";
import { FaTrash, FaUserPlus, FaKey } from "react-icons/fa";

const CustomerTable = ({
  customers,
  onDeactivate,
  onActivate,
  onResetPassword,
}) => {
  const getFullName = (customer) => {
    return `${customer.firstName} ${customer.lastName}`.trim();
  };

  return (
    <div className="admin-page__table">
      <table>
        <thead>
          <tr>
            <th>Họ và tên</th>
            <th>Email</th>
            <th>Số điện thoại</th>
            <th>Địa chỉ</th>
            <th>Giới tính</th>
            <th>Ngày sinh</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td>{getFullName(customer)}</td>
              <td>{customer.email}</td>
              <td>{customer.phone}</td>
              <td>{customer.address}</td>
              <td>{customer.gender === "Male" ? "Nam" : "Nữ"}</td>
              <td>
                {new Date(customer.birthDate).toLocaleDateString("vi-VN")}
              </td>
              <td>
                <span
                  className={`status-badge status-badge--${
                    customer.status ? "active" : "inactive"
                  }`}
                >
                  {customer.status ? "Hoạt động" : "Ngưng hoạt động"}
                </span>
              </td>
              <td>
                <div className="action-buttons">
                  <button
                    className="key-btn"
                    title="Đặt lại mật khẩu"
                    onClick={() => onResetPassword(customer)}
                  >
                    <FaKey />
                  </button>
                  {customer.status ? (
                    <button
                      className="delete-btn"
                      title="Ngưng hoạt động"
                      onClick={() => onDeactivate(customer.id)}
                    >
                      <FaTrash />
                    </button>
                  ) : (
                    <button
                      className="restore-btn"
                      title="Khôi phục hoạt động"
                      onClick={() => onActivate(customer.id)}
                    >
                      <FaUserPlus />
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

export default CustomerTable;
