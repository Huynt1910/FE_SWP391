import React from "react";
import { FaEdit, FaTrash, FaUserPlus, FaKey } from "react-icons/fa";

const TherapistTable = ({
  therapists,
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
            <th>Kinh nghiệm</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {therapists.map((therapist) => (
            <tr key={therapist.id}>
              <td>{therapist.fullName}</td>
              <td>{therapist.email}</td>
              <td>{therapist.phone}</td>
              <td>{therapist.address}</td>
              <td>{therapist.gender === "Male" ? "Nam" : "Nữ"}</td>
              <td>{therapist.yearExperience} năm</td>
              <td>
                <span
                  className={`status-badge status-badge--${
                    therapist.status ? "active" : "inactive"
                  }`}
                >
                  {therapist.status ? "Hoạt động" : "Ngưng hoạt động"}
                </span>
              </td>
              <td>
                <div className="action-buttons">
                  <button
                    className="edit-btn"
                    title="Chỉnh sửa"
                    onClick={() => onEdit(therapist)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="key-btn"
                    title="Đặt lại mật khẩu"
                    onClick={() => onResetPassword(therapist)}
                  >
                    <FaKey />
                  </button>
                  {therapist.status ? (
                    <button
                      className="delete-btn"
                      title="Ngưng hoạt động"
                      onClick={() => onDelete(therapist.id)}
                    >
                      <FaTrash />
                    </button>
                  ) : (
                    <button
                      className="restore-btn"
                      title="Khôi phục hoạt động"
                      onClick={() => onRestore(therapist.id)}
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

export default TherapistTable;
