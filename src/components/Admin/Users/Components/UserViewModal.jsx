export const UserViewModal = ({ user, onClose }) => {
  const formatName = (user) => {
    switch (user.role) {
      case "CUSTOMER":
        return user.firstName && user.lastName
          ? `${user.firstName} ${user.lastName}`
          : user.username;
      case "THERAPIST":
      case "STAFF":
        return user.fullName;
      default:
        return user.username;
    }
  };

  const renderNameFields = (user) => {
    if (user.role === "CUSTOMER") {
      return (
        <>
          <div className="info-item">
            <label>Họ</label>
            <p>{user.firstName}</p>
          </div>
          <div className="info-item">
            <label>Tên</label>
            <p>{user.lastName}</p>
          </div>
          <div className="info-item">
            <label>Họ và tên</label>
            <p>{formatName(user)}</p>
          </div>
        </>
      );
    }

    return (
      <div className="info-item">
        <label>Họ và tên</label>
        <p>{user.fullName}</p>
      </div>
    );
  };

  return (
    <div className="admin-page__modal">
      <div className="admin-page__modal-content">
        <div className="admin-page__modal-content-header">
          <h2>
            Thông tin{" "}
            {user.role === "THERAPIST"
              ? "Therapist"
              : user.role === "STAFF"
              ? "Nhân viên"
              : "Khách hàng"}
          </h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="admin-page__modal-content-body">
          <div className="user-info">
            <div className="avatar-section">
              <div className="avatar-preview">
                <img src="/default-avatar.png" alt={formatName(user)} />
              </div>
            </div>
            <div className="info-grid">
              <div className="info-item">
                <label>Tên đăng nhập</label>
                <p>{user?.username}</p>
              </div>
              {renderNameFields(user)}
              <div className="info-item">
                <label>Email</label>
                <p>{user?.email}</p>
              </div>
              <div className="info-item">
                <label>Số điện thoại</label>
                <p>{user?.phone}</p>
              </div>
              <div className="info-item">
                <label>Địa chỉ</label>
                <p>{user?.address}</p>
              </div>
              {user.role === "THERAPIST" && (
                <div className="info-item">
                  <label>Kinh nghiệm</label>
                  <p>{user?.yearExperience} năm</p>
                </div>
              )}
              <div className="info-item">
                <label>Trạng thái</label>
                <p>{user?.status ? "Hoạt động" : "Không hoạt động"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
