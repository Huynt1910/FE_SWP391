import React from "react";
import { FaUserMd, FaUserSlash, FaUsers } from "react-icons/fa";

const StaffTabs = ({ activeTab, onTabChange, counts }) => {
  const tabs = [
    {
      id: "ALL",
      label: "Tất cả",
      icon: <FaUsers />,
      count: counts.all || 0,
    },
    {
      id: "ACTIVE",
      label: "Đang hoạt động",
      icon: <FaUserMd />,
      count: counts.active || 0,
    },
    {
      id: "INACTIVE",
      label: "Ngưng hoạt động",
      icon: <FaUserSlash />,
      count: counts.inactive || 0,
    },
  ];

  return (
    <div className="admin-page__tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.icon}
          <span>{tab.label}</span>
          <span className="therapist-count">{tab.count}</span>
        </button>
      ))}
    </div>
  );
};

export default StaffTabs;
