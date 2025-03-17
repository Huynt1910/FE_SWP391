import React from "react";
import { FaPlus } from "react-icons/fa";

const ServiceHeader = ({ onAddClick }) => {
  return (
    <div className="admin-page__header">
      <div className="admin-page__header-title">
        <h1>Quản lý dịch vụ</h1>
        <p>Quản lý thông tin các dịch vụ của spa</p>
      </div>
      <div className="admin-page__header-actions">
        <button className="btn btn-primary" onClick={onAddClick}>
          <FaPlus /> Thêm dịch vụ
        </button>
      </div>
    </div>
  );
};

export default ServiceHeader;
