import { FaUsers, FaSpa, FaUserTie } from "react-icons/fa";

export const UserTabs = ({ activeTab, onTabChange, counts }) => {
  const tabs = [
    { id: "CUSTOMER", label: "Khách hàng", icon: <FaUsers /> },
    { id: "THERAPIST", label: "Therapist", icon: <FaSpa /> },
    { id: "STAFF", label: "Nhân viên", icon: <FaUserTie /> },
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
          <span className="user-count">{counts[tab.id] || 0}</span>
        </button>
      ))}
    </div>
  );
};
