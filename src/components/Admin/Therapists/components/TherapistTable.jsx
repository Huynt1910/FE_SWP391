import React from "react";
import { FaEdit, FaTrash, FaCheck, FaKey } from "react-icons/fa";

const TherapistTable = ({ therapists, onEdit, onToggleStatus }) => {
  if (!therapists || therapists.length === 0) {
    return <div className="empty-message">Không có nhân viên nào</div>;
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <div className="admin-page__table">
      <table>
        <thead>
          <tr>
            <th>Hình ảnh</th>
            <th>Họ và tên</th>
            <th>Email</th>
            <th>Số điện thoại</th>
            <th>Địa chỉ</th>
            <th>Giới tính</th>
            <th>Ngày sinh</th>
            <th>Kinh nghiệm</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {therapists.map((therapist) => (
            <tr
              key={therapist.id}
              className={!therapist.status ? "inactive-row" : ""}
            >
              <td>
                <img
                  src={therapist.imgUrl}
                  alt={therapist.fullName}
                  className="therapist-image"
                  onError={(e) => {
                    e.target.src = "/default-avatar.png";
                  }}
                />
              </td>
              <td>{therapist.fullName}</td>
              <td>{therapist.email}</td>
              <td>{therapist.phone}</td>
              <td>{therapist.address}</td>
              <td>{therapist.gender === "Male" ? "Nam" : "Nữ"}</td>
              <td>{formatDate(therapist.birthDate)}</td>
              <td>{therapist.yearExperience} năm</td>
              <td>
                <span
                  className={`status-badge ${
                    therapist.status
                      ? "status-badge--active"
                      : "status-badge--inactive"
                  }`}
                >
                  {therapist.status ? "Hoạt động" : "Không hoạt động"}
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
                      onClick={() => onToggleStatus(therapist)}
                    >
                      <FaTrash />
                    </button>
                  ) : (
                    <button
                      className="restore-btn"
                      title="Khôi phục hoạt động"
                      onClick={() => onToggleStatus(therapist)}
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

export default TherapistTable;
