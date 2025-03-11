import React, { useState } from "react";
import {
  FaTicketAlt,
  FaCog,
  FaPlus,
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
  FaCalendarAlt,
  FaPercentage,
  FaDollarSign,
} from "react-icons/fa";

function Settings() {
  const [activeTab, setActiveTab] = useState("vouchers");
  const [vouchers, setVouchers] = useState([
    {
      id: 1,
      code: "SUMMER2024",
      type: "percentage",
      value: 20,
      minSpend: 1000000,
      maxDiscount: 500000,
      startDate: "2024-06-01",
      endDate: "2024-08-31",
      usageLimit: 100,
      usageCount: 0,
      status: "active",
    },
    {
      id: 2,
      code: "WELCOME",
      type: "fixed",
      value: 200000,
      minSpend: 500000,
      maxDiscount: 200000,
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      usageLimit: 500,
      usageCount: 123,
      status: "active",
    },
  ]);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [currentVoucher, setCurrentVoucher] = useState(null);
  const [modalMode, setModalMode] = useState("add"); // add, edit, view

  const [voucherForm, setVoucherForm] = useState({
    code: "",
    type: "percentage",
    value: "",
    minSpend: "",
    maxDiscount: "",
    startDate: "",
    endDate: "",
    usageLimit: "",
    status: "active",
  });

  // Voucher Management Functions
  const handleAddVoucher = () => {
    setModalMode("add");
    setCurrentVoucher(null);
    setVoucherForm({
      code: "",
      type: "percentage",
      value: "",
      minSpend: "",
      maxDiscount: "",
      startDate: "",
      endDate: "",
      usageLimit: "",
      status: "active",
    });
    setShowVoucherModal(true);
  };

  const handleEditVoucher = (voucher) => {
    setModalMode("edit");
    setCurrentVoucher(voucher);
    setVoucherForm({
      code: voucher.code,
      type: voucher.type,
      value: voucher.value,
      minSpend: voucher.minSpend,
      maxDiscount: voucher.maxDiscount,
      startDate: voucher.startDate,
      endDate: voucher.endDate,
      usageLimit: voucher.usageLimit,
      status: voucher.status,
    });
    setShowVoucherModal(true);
  };

  const handleDeleteVoucher = (voucherId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa voucher này?")) {
      setVouchers(vouchers.filter((v) => v.id !== voucherId));
    }
  };

  const handleVoucherSubmit = (e) => {
    e.preventDefault();

    if (modalMode === "add") {
      const newVoucher = {
        id: vouchers.length + 1,
        ...voucherForm,
        usageCount: 0,
      };
      setVouchers([...vouchers, newVoucher]);
    } else {
      const updatedVouchers = vouchers.map((v) =>
        v.id === currentVoucher.id ? { ...v, ...voucherForm } : v
      );
      setVouchers(updatedVouchers);
    }

    setShowVoucherModal(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div className="admin-page__header-title">
          <h1>Cài đặt hệ thống</h1>
        </div>
        <div className="admin-page__header-actions">
          <div className="tabs">
            <button
              className={`tab-btn ${activeTab === "vouchers" ? "active" : ""}`}
              onClick={() => setActiveTab("vouchers")}
            >
              <FaTicketAlt /> Quản lý Voucher
            </button>
            <button
              className={`tab-btn ${activeTab === "general" ? "active" : ""}`}
              onClick={() => setActiveTab("general")}
            >
              <FaCog /> Cài đặt chung
            </button>
          </div>
        </div>
      </div>

      <div className="admin-page__content">
        {activeTab === "vouchers" && (
          <div className="vouchers-section">
            <div className="section-header">
              <h2>Quản lý Voucher</h2>
              <button className="btn btn-primary" onClick={handleAddVoucher}>
                <FaPlus /> Thêm Voucher mới
              </button>
            </div>

            <div className="admin-page__table">
              <table>
                <thead>
                  <tr>
                    <th>Mã voucher</th>
                    <th>Loại</th>
                    <th>Giá trị</th>
                    <th>Điều kiện</th>
                    <th>Thời hạn</th>
                    <th>Đã sử dụng</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {vouchers.map((voucher) => (
                    <tr key={voucher.id}>
                      <td>{voucher.code}</td>
                      <td>
                        {voucher.type === "percentage"
                          ? "Phần trăm"
                          : "Số tiền cố định"}
                      </td>
                      <td>
                        {voucher.type === "percentage"
                          ? `${voucher.value}%`
                          : formatCurrency(voucher.value)}
                      </td>
                      <td>
                        <div>Tối thiểu: {formatCurrency(voucher.minSpend)}</div>
                        <div>
                          Giảm tối đa: {formatCurrency(voucher.maxDiscount)}
                        </div>
                      </td>
                      <td>
                        <div>Từ: {voucher.startDate}</div>
                        <div>Đến: {voucher.endDate}</div>
                      </td>
                      <td>
                        {voucher.usageCount}/{voucher.usageLimit}
                      </td>
                      <td>
                        <span className={`status-badge ${voucher.status}`}>
                          {voucher.status === "active"
                            ? "Đang hoạt động"
                            : "Đã kết thúc"}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-icon edit"
                            onClick={() => handleEditVoucher(voucher)}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="btn-icon delete"
                            onClick={() => handleDeleteVoucher(voucher.id)}
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
          </div>
        )}

        {activeTab === "general" && (
          <div className="general-settings-section">
            <h2>Cài đặt chung</h2>
            {/* Add other general settings here */}
          </div>
        )}

        {/* Voucher Modal */}
        {showVoucherModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>
                  {modalMode === "add"
                    ? "Thêm Voucher mới"
                    : "Chỉnh sửa Voucher"}
                </h2>
                <button
                  className="close-btn"
                  onClick={() => setShowVoucherModal(false)}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleVoucherSubmit} className="voucher-form">
                <div className="form-group">
                  <label>Mã voucher:</label>
                  <input
                    type="text"
                    value={voucherForm.code}
                    onChange={(e) =>
                      setVoucherForm({ ...voucherForm, code: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Loại giảm giá:</label>
                    <select
                      value={voucherForm.type}
                      onChange={(e) =>
                        setVoucherForm({ ...voucherForm, type: e.target.value })
                      }
                    >
                      <option value="percentage">Phần trăm</option>
                      <option value="fixed">Số tiền cố định</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Giá trị:</label>
                    <div className="input-with-icon">
                      <input
                        type="number"
                        value={voucherForm.value}
                        onChange={(e) =>
                          setVoucherForm({
                            ...voucherForm,
                            value: e.target.value,
                          })
                        }
                        required
                      />
                      {voucherForm.type === "percentage" ? (
                        <FaPercentage className="input-icon" />
                      ) : (
                        <FaDollarSign className="input-icon" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Giá trị đơn hàng tối thiểu:</label>
                    <input
                      type="number"
                      value={voucherForm.minSpend}
                      onChange={(e) =>
                        setVoucherForm({
                          ...voucherForm,
                          minSpend: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Giảm giá tối đa:</label>
                    <input
                      type="number"
                      value={voucherForm.maxDiscount}
                      onChange={(e) =>
                        setVoucherForm({
                          ...voucherForm,
                          maxDiscount: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Ngày bắt đầu:</label>
                    <input
                      type="date"
                      value={voucherForm.startDate}
                      onChange={(e) =>
                        setVoucherForm({
                          ...voucherForm,
                          startDate: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Ngày kết thúc:</label>
                    <input
                      type="date"
                      value={voucherForm.endDate}
                      onChange={(e) =>
                        setVoucherForm({
                          ...voucherForm,
                          endDate: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Số lượng sử dụng tối đa:</label>
                    <input
                      type="number"
                      value={voucherForm.usageLimit}
                      onChange={(e) =>
                        setVoucherForm({
                          ...voucherForm,
                          usageLimit: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Trạng thái:</label>
                    <select
                      value={voucherForm.status}
                      onChange={(e) =>
                        setVoucherForm({
                          ...voucherForm,
                          status: e.target.value,
                        })
                      }
                    >
                      <option value="active">Đang hoạt động</option>
                      <option value="inactive">Đã kết thúc</option>
                    </select>
                  </div>
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowVoucherModal(false)}
                  >
                    Hủy
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {modalMode === "add" ? "Thêm voucher" : "Lưu thay đổi"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Settings;
