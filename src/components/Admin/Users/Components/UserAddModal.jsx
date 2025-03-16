import { useState } from "react";
import { useRegisterUser } from "@/auth/hook/admin/useRegisterUserHook";

export const UserAddModal = ({ onClose, role }) => {
  const { mutate: registerUser, isLoading } = useRegisterUser();

  // Common fields for all user types
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    phone: "",
    address: "",
    gender: "Male",
    birthDate: "",
    // Role specific fields
    ...(role === "CUSTOMER" && {
      firstName: "",
      lastName: "",
    }),
    ...(role === "THERAPIST" && {
      fullName: "",
      yearExperience: 0,
    }),
    ...(role === "STAFF" && {
      fullName: "",
    }),
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const userData = { ...formData };

    // Remove role-specific fields if they don't apply
    if (role !== "CUSTOMER") {
      delete userData.firstName;
      delete userData.lastName;
    }
    if (role !== "THERAPIST") {
      delete userData.yearExperience;
    }

    registerUser({ role, userData });
    onClose();
  };

  return (
    <div className="admin-page__modal">
      <div className="admin-page__modal-content">
        <div className="admin-page__modal-content-header">
          <h2>
            Thêm{" "}
            {role === "THERAPIST"
              ? "Therapist"
              : role === "STAFF"
              ? "Nhân viên"
              : "Khách hàng"}
          </h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="admin-page__modal-content-body">
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              {/* Common fields */}
              <div className="form-group">
                <label>Tên đăng nhập</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Mật khẩu</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
              </div>

              {/* Role-specific name fields */}
              {role === "CUSTOMER" ? (
                <>
                  <div className="form-group">
                    <label>Họ</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Tên</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      required
                    />
                  </div>
                </>
              ) : (
                <div className="form-group">
                  <label>Họ và tên</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    required
                  />
                </div>
              )}

              {/* Common fields continued */}
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Số điện thoại</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Địa chỉ</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Giới tính</label>
                <select
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                >
                  <option value="Male">Nam</option>
                  <option value="Female">Nữ</option>
                </select>
              </div>

              <div className="form-group">
                <label>Ngày sinh</label>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) =>
                    setFormData({ ...formData, birthDate: e.target.value })
                  }
                  required
                />
              </div>

              {/* Therapist-specific field */}
              {role === "THERAPIST" && (
                <div className="form-group">
                  <label>Số năm kinh nghiệm</label>
                  <input
                    type="number"
                    value={formData.yearExperience}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        yearExperience: parseInt(e.target.value),
                      })
                    }
                    min="0"
                    required
                  />
                </div>
              )}

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? "Đang xử lý..." : "Tạo tài khoản"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
