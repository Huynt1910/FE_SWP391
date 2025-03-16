const UnauthorizedPage = () => {
  return (
    <div className="unauthorized-page">
      <div className="unauthorized-content">
        <h1>Không có quyền truy cập</h1>
        <p>Bạn không có quyền truy cập vào trang này.</p>
        <a href="/" className="btn-back">
          Về trang chủ
        </a>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
