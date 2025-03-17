import React from "react";
import { FaEdit, FaTrash, FaUserPlus, FaKey } from "react-icons/fa";

const StaffTable = ({
  staffs,
  onEdit,
  onDelete,
  onRestore,
  onResetPassword,
}) => {
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
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {staffs.map((staff) => (
            <tr key={staff.id}>
              <td>{staff.fullName}</td>
              <td>{staff.email}</td>
              <td>{staff.phone}</td>
              <td>{staff.address}</td>
              <td>{staff.gender === "Male" ? "Nam" : "Nữ"}</td>
              <td>
                <span
                  className={`status-badge status-badge--${
                    staff.status ? "active" : "inactive"
                  }`}
                >
                  {staff.status ? "Hoạt động" : "Ngưng hoạt động"}
                </span>
              </td>
              <td>
                <div className="action-buttons">
                  <button
                    className="edit-btn"
                    title="Chỉnh sửa"
                    onClick={() => onEdit(staff)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="key-btn"
                    title="Đặt lại mật khẩu"
                    onClick={() => onResetPassword(staff)}
                  >
                    <FaKey />
                  </button>
                  {staff.status ? (
                    <button
                      className="delete-btn"
                      title="Ngưng hoạt động"
                      onClick={() => onDelete(staff.id)}
                    >
                      <FaTrash />
                    </button>
                  ) : (
                    <button
                      className="restore-btn"
                      title="Khôi phục hoạt động"
                      onClick={() => onRestore(staff.id)}
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

export default StaffTable;
