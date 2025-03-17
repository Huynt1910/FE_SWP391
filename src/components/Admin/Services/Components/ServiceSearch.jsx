import React from "react";
import { FaSearch } from "react-icons/fa";

const ServiceSearch = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="admin-page__filters">
      <div className="search-box">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên dịch vụ..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <FaSearch className="search-icon" />
      </div>
    </div>
  );
};

export default ServiceSearch;
