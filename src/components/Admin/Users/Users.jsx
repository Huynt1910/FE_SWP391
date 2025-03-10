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
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "ascending" });
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [modalMode, setModalMode] = useState("view"); // view, edit, add, delete

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
  const openViewModal = (user) => {
    setCurrentUser(user);
    setModalMode("view");
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setCurrentUser(user);
    setFormData({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      avatar: user.avatar,
    });
    setModalMode("edit");
    setShowModal(true);
  };

  const openAddModal = () => {
    setCurrentUser(null);
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      role: "user",
      status: "active",
      avatar: "",
    });
    setModalMode("add");
    setShowModal(true);
  };

  const openDeleteModal = (user) => {
    setCurrentUser(user);
    setModalMode("delete");
    setShowModal(true);
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
        const newStatus = user.status === "active" ? "inactive" : 
                         user.status === "inactive" ? "active" : 
                         user.status === "blocked" ? "active" : "blocked";
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
    <div className="users-management">
      <div className="users-management__header">
        <h1>Quản lý người dùng</h1>
        <div className="users-management__actions">
          <button className="btn btn-primary" onClick={openAddModal}>
            <FaUserPlus /> Thêm người dùng
          </button>
          <button className="btn btn-secondary" onClick={exportUsersData}>
            <FaDownload /> Xuất dữ liệu
          </button>
        </div>
      </div>

      <div className="users-management__filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email, số điện thoại..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="search-icon" />
        </div>

        <div className="filter-group">
          <div className="filter">
            <label>Vai trò:</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="all">Tất cả</option>
              <option value="admin">Admin</option>
              <option value="staff">Nhân viên</option>
              <option value="user">Người dùng</option>
            </select>
          </div>

          <div className="filter">
            <label>Trạng thái:</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">Tất cả</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Không hoạt động</option>
              <option value="blocked">Bị chặn</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : (
        <>
          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort("id")}>
                    ID {getSortIcon("id")}
                  </th>
                  <th onClick={() => handleSort("fullName")}>
                    Họ tên {getSortIcon("fullName")}
                  </th>
                  <th onClick={() => handleSort("email")}>
                    Email {getSortIcon("email")}
                  </th>
                  <th onClick={() => handleSort("phone")}>
                    Số điện thoại {getSortIcon("phone")}
                  </th>
                  <th onClick={() => handleSort("role")}>
                    Vai trò {getSortIcon("role")}
                  </th>
                  <th onClick={() => handleSort("status")}>
                    Trạng thái {getSortIcon("status")}
                  </th>
                  <th onClick={() => handleSort("lastLogin")}>
                    Đăng nhập cuối {getSortIcon("lastLogin")}
                  </th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.length > 0 ? (
                  currentUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td className="user-name-cell">
                        <img
                          src={user.avatar}
                          alt={user.fullName}
                          className="user-avatar"
                        />
                        {user.fullName}
                      </td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>{renderRoleBadge(user.role)}</td>
                      <td>{renderStatusBadge(user.status)}</td>
                      <td>{user.lastLogin}</td>
                      <td className="actions-cell">
                        <button
                          className="action-btn view-btn"
                          onClick={() => openViewModal(user)}
                          title="Xem chi tiết"
                        >
                          <FaEye />
                        </button>
                        <button
                          className="action-btn edit-btn"
                          onClick={() => openEditModal(user)}
                          title="Chỉnh sửa"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="action-btn status-btn"
                          onClick={() => toggleUserStatus(user.id)}
                          title={user.status === "active" ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                        >
                          {user.status === "active" ? <FaLock /> : <FaUnlock />}
                        </button>
                        <button
                          className="action-btn delete-btn"
                          onClick={() => openDeleteModal(user)}
                          title="Xóa"
                        >
                          <FaTrash />
                        </button>
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
            <div className="pagination">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                &laquo; Trước
              </button>
              
              <div className="pagination-info">
                Trang {currentPage} / {totalPages}
              </div>
              
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                Sau &raquo;
              </button>
            </div>
          )}
        </>
      )}

      {/* User Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>
                {modalMode === "view"
                  ? "Chi tiết người dùng"
                  : modalMode === "edit"
                  ? "Chỉnh sửa người dùng"
                  : modalMode === "add"
                  ? "Thêm người dùng mới"
                  : "Xóa người dùng"}
              </h2>
              <button className="close-btn" onClick={closeModal}>
                &times;
              </button>
            </div>
            
            <div className="modal-content">
              {modalMode === "delete" ? (
                <div className="delete-confirmation">
                  <p>
                    Bạn có chắc chắn muốn xóa người dùng{" "}
                    <strong>{currentUser.fullName}</strong>?
                  </p>
                  <p>Hành động này không thể hoàn tác.</p>
                  
                  <div className="modal-actions">
                    <button
                      className="btn btn-secondary"
                      onClick={closeModal}
                    >
                      Hủy
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={handleSubmit}
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              ) : modalMode === "view" ? (
                <div className="user-details">
                  <div className="user-profile-header">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.fullName}
                      className="user-profile-avatar"
                    />
                    <div className="user-profile-info">
                      <h3>{currentUser.fullName}</h3>
                      <p>{currentUser.email}</p>
                      <div className="user-badges">
                        {renderRoleBadge(currentUser.role)}
                        {renderStatusBadge(currentUser.status)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="user-details-content">
                    <div className="detail-item">
                      <span className="detail-label">ID:</span>
                      <span className="detail-value">{currentUser.id}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Số điện thoại:</span>
                      <span className="detail-value">{currentUser.phone}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Ngày đăng ký:</span>
                      <span className="detail-value">{currentUser.registeredDate}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Đăng nhập cuối:</span>
                      <span className="detail-value">{currentUser.lastLogin}</span>
                    </div>
                  </div>
                  
                  <div className="modal-actions">
                    <button
                      className="btn btn-secondary"
                      onClick={closeModal}
                    >
                      Đóng
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        closeModal();
                        openEditModal(currentUser);
                      }}
                    >
                      Chỉnh sửa
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="user-form">
                  <div className="form-group">
                    <label htmlFor="fullName">Họ tên:</label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="phone">Số điện thoại:</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="role">Vai trò:</label>
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                    >
                      <option value="admin">Admin</option>
                      <option value="staff">Nhân viên</option>
                      <option value="user">Người dùng</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="status">Trạng thái:</label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      <option value="active">Hoạt động</option>
                      <option value="inactive">Không hoạt động</option>
                      <option value="blocked">Bị chặn</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="avatar">URL Ảnh đại diện:</label>
                    <input
                      type="text"
                      id="avatar"
                      name="avatar"
                      value={formData.avatar}
                      onChange={handleInputChange}
                    />
                    {formData.avatar && (
                      <img
                        src={formData.avatar}
                        alt="Avatar preview"
                        className="avatar-preview"
                      />
                    )}
                  </div>
                  
                  <div className="modal-actions">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={closeModal}
                    >
                      Hủy
                    </button>
                    <button type="submit" className="btn btn-primary">
                      {modalMode === "add" ? "Thêm" : "Lưu"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
