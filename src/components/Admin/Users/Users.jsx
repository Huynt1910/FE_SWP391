import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaFilter,
  FaEdit,
  FaTrash,
  FaUserPlus,
  FaEye,
  FaLock,
  FaUnlock,
  FaDownload,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaPlus,
  FaCircle,
} from "react-icons/fa";

function Users() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({
    key: "id",
    direction: "ascending",
  });
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  // Form state for adding/editing users
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "user",
    status: "active",
    avatar: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchTerm, selectedRole, selectedStatus, users, sortConfig]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Simulated API call - replace with actual API
      setTimeout(() => {
        const mockUsers = [
          {
            id: 1,
            fullName: "Nguyễn Văn A",
            email: "nguyenvana@example.com",
            phone: "0901234567",
            role: "admin",
            status: "active",
            lastLogin: "2025-03-01 10:30",
            registeredDate: "2024-01-15",
            avatar: "https://randomuser.me/api/portraits/men/1.jpg",
          },
          {
            id: 2,
            fullName: "Trần Thị B",
            email: "tranthib@example.com",
            phone: "0912345678",
            role: "user",
            status: "active",
            lastLogin: "2025-03-01 09:15",
            registeredDate: "2024-02-20",
            avatar: "https://randomuser.me/api/portraits/women/2.jpg",
          },
          {
            id: 3,
            fullName: "Lê Văn C",
            email: "levanc@example.com",
            phone: "0923456789",
            role: "user",
            status: "inactive",
            lastLogin: "2025-02-25 14:45",
            registeredDate: "2024-01-30",
            avatar: "https://randomuser.me/api/portraits/men/3.jpg",
          },
          {
            id: 4,
            fullName: "Phạm Thị D",
            email: "phamthid@example.com",
            phone: "0934567890",
            role: "staff",
            status: "active",
            lastLogin: "2025-03-01 08:00",
            registeredDate: "2024-02-10",
            avatar: "https://randomuser.me/api/portraits/women/4.jpg",
          },
          {
            id: 5,
            fullName: "Hoàng Văn E",
            email: "hoangvane@example.com",
            phone: "0945678901",
            role: "user",
            status: "blocked",
            lastLogin: "2025-02-20 11:30",
            registeredDate: "2024-01-05",
            avatar: "https://randomuser.me/api/portraits/men/5.jpg",
          },
          {
            id: 6,
            fullName: "Ngô Thị F",
            email: "ngothif@example.com",
            phone: "0956789012",
            role: "user",
            status: "active",
            lastLogin: "2025-02-28 16:20",
            registeredDate: "2024-02-15",
            avatar: "https://randomuser.me/api/portraits/women/6.jpg",
          },
          {
            id: 7,
            fullName: "Đỗ Văn G",
            email: "dovang@example.com",
            phone: "0967890123",
            role: "staff",
            status: "active",
            lastLogin: "2025-03-01 12:10",
            registeredDate: "2024-01-25",
            avatar: "https://randomuser.me/api/portraits/men/7.jpg",
          },
          {
            id: 8,
            fullName: "Lý Thị H",
            email: "lythih@example.com",
            phone: "0978901234",
            role: "user",
            status: "inactive",
            lastLogin: "2025-02-26 09:45",
            registeredDate: "2024-02-05",
            avatar: "https://randomuser.me/api/portraits/women/8.jpg",
          },
          {
            id: 9,
            fullName: "Vũ Văn I",
            email: "vuvani@example.com",
            phone: "0989012345",
            role: "user",
            status: "active",
            lastLogin: "2025-02-28 14:30",
            registeredDate: "2024-01-10",
            avatar: "https://randomuser.me/api/portraits/men/9.jpg",
          },
          {
            id: 10,
            fullName: "Mai Thị K",
            email: "maithik@example.com",
            phone: "0990123456",
            role: "user",
            status: "active",
            lastLogin: "2025-03-01 11:00",
            registeredDate: "2024-02-25",
            avatar: "https://randomuser.me/api/portraits/women/10.jpg",
          },
          {
            id: 11,
            fullName: "Trịnh Văn L",
            email: "trinhvanl@example.com",
            phone: "0901234568",
            role: "user",
            status: "active",
            lastLogin: "2025-02-27 10:15",
            registeredDate: "2024-01-20",
            avatar: "https://randomuser.me/api/portraits/men/11.jpg",
          },
          {
            id: 12,
            fullName: "Đinh Thị M",
            email: "dinhthim@example.com",
            phone: "0912345679",
            role: "user",
            status: "blocked",
            lastLogin: "2025-02-25 13:40",
            registeredDate: "2024-02-01",
            avatar: "https://randomuser.me/api/portraits/women/12.jpg",
          },
        ];
        setUsers(mockUsers);
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let result = [...users];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (user) =>
          user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.phone.includes(searchTerm)
      );
    }

    // Apply role filter
    if (selectedRole !== "all") {
      result = result.filter((user) => user.role === selectedRole);
    }

    // Apply status filter
    if (selectedStatus !== "all") {
      result = result.filter((user) => user.status === selectedStatus);
    }

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredUsers(result);
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort />;
    return sortConfig.direction === "ascending" ? <FaSortUp /> : <FaSortDown />;
  };

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Modal handlers
  const handleOpenModal = (mode, user = null) => {
    setModalMode(mode);
    setSelectedUser(user);
    if (user && (mode === "edit" || mode === "view")) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        role: "user",
        status: "active",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalMode("");
    setSelectedUser(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "user",
      status: "active",
    });
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentUser(null);
  };

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modalMode === "add") {
      // Add new user
      const newUser = {
        id: users.length + 1,
        ...formData,
        lastLogin: "-",
        registeredDate: new Date().toISOString().split("T")[0],
      };
      setUsers([...users, newUser]);
    } else if (modalMode === "edit") {
      // Update existing user
      const updatedUsers = users.map((user) =>
        user.id === currentUser.id ? { ...user, ...formData } : user
      );
      setUsers(updatedUsers);
    } else if (modalMode === "delete") {
      // Delete user
      const updatedUsers = users.filter((user) => user.id !== currentUser.id);
      setUsers(updatedUsers);
    }
    closeModal();
  };

  // Status toggle handler
  const toggleUserStatus = (userId) => {
    const updatedUsers = users.map((user) => {
      if (user.id === userId) {
        const newStatus =
          user.status === "active"
            ? "inactive"
            : user.status === "inactive"
            ? "active"
            : user.status === "blocked"
            ? "active"
            : "blocked";
        return { ...user, status: newStatus };
      }
      return user;
    });
    setUsers(updatedUsers);
  };

  // Export users data
  const exportUsersData = () => {
    // In a real application, this would generate a CSV or Excel file
    console.log("Exporting users data:", filteredUsers);
    alert("Exporting users data...");
  };

  // Render status badge
  const renderStatusBadge = (status) => {
    let badgeClass = "";
    switch (status) {
      case "active":
        badgeClass = "status-badge status-active";
        break;
      case "inactive":
        badgeClass = "status-badge status-inactive";
        break;
      case "blocked":
        badgeClass = "status-badge status-blocked";
        break;
      default:
        badgeClass = "status-badge";
    }
    return <span className={badgeClass}>{status}</span>;
  };

  // Render role badge
  const renderRoleBadge = (role) => {
    let badgeClass = "";
    switch (role) {
      case "admin":
        badgeClass = "role-badge role-admin";
        break;
      case "staff":
        badgeClass = "role-badge role-staff";
        break;
      case "user":
        badgeClass = "role-badge role-user";
        break;
      default:
        badgeClass = "role-badge";
    }
    return <span className={badgeClass}>{role}</span>;
  };

  return (
    <div className="admin-page">
      {/* Header Section */}
      <div className="admin-page__header">
        <div className="admin-page__header-title">
          <h1>Quản lý người dùng</h1>
          <p>Quản lý thông tin và phân quyền người dùng</p>
        </div>
        <div className="admin-page__header-actions">
          <button
            className="btn btn-primary"
            onClick={() => handleOpenModal("add")}
          >
            <FaPlus /> Thêm người dùng
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="admin-page__filters">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <div className="filter">
            <label>Vai trò</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="all">Tất cả vai trò</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
          <div className="filter">
            <label>Trạng thái</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="inactive">Bị khóa</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="admin-page__table">
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort("fullName")}>
                Họ tên {getSortIcon("fullName")}
              </th>
              <th onClick={() => handleSort("phone")}>
                Số điện thoại {getSortIcon("phone")}
              </th>
              <th onClick={() => handleSort("email")}>
                Email {getSortIcon("email")}
              </th>
              <th onClick={() => handleSort("role")}>
                Vai trò {getSortIcon("role")}
              </th>
              <th onClick={() => handleSort("status")}>
                Trạng thái {getSortIcon("status")}
              </th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.length > 0 ? (
              currentUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.fullName}</td>
                  <td>{user.phone}</td>
                  <td>{user.email}</td>
                  <td>{renderRoleBadge(user.role)}</td>
                  <td>{renderStatusBadge(user.status)}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="view-btn"
                        onClick={() => handleOpenModal("view", user)}
                        title="Xem chi tiết"
                      >
                        <FaEye />
                      </button>
                      <button
                        className="edit-btn"
                        onClick={() => handleOpenModal("edit", user)}
                        title="Chỉnh sửa"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="status-btn"
                        onClick={() => toggleUserStatus(user.id)}
                        title={
                          user.status === "active"
                            ? "Khóa tài khoản"
                            : "Mở khóa"
                        }
                      >
                        {user.status === "active" ? <FaLock /> : <FaUnlock />}
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(user.id)}
                        title="Xóa"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-data">
                  Không tìm thấy người dùng nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredUsers.length > 0 && (
        <div className="admin-page__pagination">
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            &laquo; Trước
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              className={`pagination-btn ${
                currentPage === index + 1 ? "active" : ""
              }`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}

          <button
            className="pagination-btn"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Sau &raquo;
          </button>
        </div>
      )}

      {/* User Modal */}
      {showModal && (
        <div className="admin-page__modal">
          <div className="admin-page__modal-content">
            <div className="admin-page__modal-content-header">
              <h2>
                {modalMode === "view"
                  ? "Chi tiết người dùng"
                  : modalMode === "edit"
                  ? "Chỉnh sửa người dùng"
                  : "Thêm người dùng mới"}
              </h2>
              <button className="close-btn" onClick={handleCloseModal}>
                ×
              </button>
            </div>

            <div className="admin-page__modal-content-body">
              {modalMode === "view" ? (
                <div className="user-details">
                  <p>
                    <strong>Họ tên:</strong> {selectedUser.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedUser.email}
                  </p>
                  <p>
                    <strong>Số điện thoại:</strong> {selectedUser.phone}
                  </p>
                  <p>
                    <strong>Vai trò:</strong>{" "}
                    {selectedUser.role === "admin" ? "Admin" : "User"}
                  </p>
                  <p>
                    <strong>Trạng thái:</strong>{" "}
                    {selectedUser.status === "active"
                      ? "Đang hoạt động"
                      : "Bị khóa"}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Họ tên</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Số điện thoại</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Vai trò</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Trạng thái</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      <option value="active">Đang hoạt động</option>
                      <option value="inactive">Bị khóa</option>
                    </select>
                  </div>
                </form>
              )}
            </div>

            <div className="admin-page__modal-content-footer">
              <button className="btn-secondary" onClick={handleCloseModal}>
                Đóng
              </button>
              {modalMode !== "view" && (
                <button className="btn-primary" onClick={handleSubmit}>
                  {modalMode === "add" ? "Thêm người dùng" : "Lưu thay đổi"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
