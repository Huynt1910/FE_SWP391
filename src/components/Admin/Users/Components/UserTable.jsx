import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

export const UserTable = ({ users, onView, onEdit, onDelete }) => {
  const formatName = (user) => {
    switch (user.role) {
      case "CUSTOMER":
        return user.firstName && user.lastName
          ? `${user.firstName} ${user.lastName}`
          : user.username;
      case "THERAPIST":
      case "STAFF":
        return user.fullName || user.username;
      default:
        return user.username;
    }
  };

  return (
    <div className="admin-page__table">
      <table>
        <thead>
          <tr>
            <th>Tên đăng nhập</th>
            <th>Họ và tên</th>
            <th>Email</th>
            <th>Số điện thoại</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{formatName(user)}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>
                <span
                  className={`status-badge status-badge--${
                    user.status ? "active" : "inactive"
                  }`}
                >
                  {user.status ? "Hoạt động" : "Không hoạt động"}
                </span>
              </td>
              <td>
                <div className="action-buttons">
                  <button
                    className="view-btn"
                    title="Xem chi tiết"
                    onClick={() => onView(user)}
                  >
                    <FaEye />
                  </button>
                  <button
                    className="edit-btn"
                    title="Chỉnh sửa"
                    onClick={() => onEdit(user)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="delete-btn"
                    title="Xóa"
                    onClick={() => onDelete(user)}
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
