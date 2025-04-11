import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";
import { PAGE_ACCESS } from "@/lib/api-client/constant";
import {
  FaChartLine,
  FaUsers,
  FaCalendarAlt,
  FaClock,
  FaUserMd,
  FaSprayCan,
  FaUserTie,
  FaCog,
  FaCaretDown,
  FaCaretUp,
  FaStar,
  FaUser,
} from "react-icons/fa";

const Sidebar = ({ isCollapsed }) => {
  const router = useRouter();
  const userRole = getCookie("userRole");
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  const menuItems = [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: <FaChartLine />,
      roles: ["ADMIN", "STAFF"],
    },
    {
      label: "Quản lý tài khoản",
      icon: <FaUsers />,
      roles: ["ADMIN", "STAFF"],
      isDropdown: true,
      children: [
        {
          label: "Quản lý nhân viên",
          path: "/admin/staffs",
          icon: <FaUserTie />,
          roles: ["ADMIN"],
        },
        {
          label: "Quản lý khách hàng",
          path: "/admin/customers",
          icon: <FaUsers />,
          roles: ["ADMIN", "STAFF"],
        },
        {
          label: "Quản lý Therapist",
          path: "/admin/therapists",
          icon: <FaUserMd />,
          roles: ["ADMIN"],
        },
      ],
    },
    {
      label: "Quản lý lịch hẹn",
      path: "/admin/bookings",
      icon: <FaCalendarAlt />,
      roles: ["ADMIN", "STAFF"],
    },
    {
      label: "Quản lý lịch làm việc",
      path: "/admin/schedules",
      icon: <FaClock />,
      roles: ["ADMIN", "STAFF"],
    },
    {
      label: "Quản lý dịch vụ",
      path: "/admin/services",
      icon: <FaSprayCan />,
      roles: ["ADMIN"],
    },
    {
      label: "Quản lý voucher",
      path: "/admin/settings",
      icon: <FaCog />,
      roles: ["ADMIN"],
    },
    {
      label: "Lịch làm việc của tôi",
      path: "/admin/therapist-schedule",
      icon: <FaCalendarAlt />,
      roles: ["THERAPIST"],
    },
    {
      label: "Đánh giá",
      path: "/admin/feedback",
      icon: <FaStar />,
      roles: ["THERAPIST"],
    },
    {
      label: "Thông tin cá nhân",
      path: "/admin/staff-profile",
      icon: <FaUser />,
      roles: ["STAFF"],
    },
    {
      label: "Thông tin cá nhân",
      path: "/admin/therapist-profile",
      icon: <FaUser />,
      roles: ["THERAPIST"],
    },
  ];

  const authorizedMenuItems = menuItems.filter((item) =>
    item.roles.includes(userRole)
  );

  return (
    <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar__brand">
      <img src="/assets/img/logo-admin.png" alt="Logo" />
      <span>Bamboo Spa</span>
      </div>

      <div className="menu">
        <div className="menu__section">
          <div className="section__title">Menu</div>
          {authorizedMenuItems.map((item, index) => (
            <div key={index}>
              {item.isDropdown ? (
                <div className="menu__dropdown">
                  <div
                    className={`menu__link ${isAccountOpen ? "active" : ""}`}
                    onClick={() => setIsAccountOpen(!isAccountOpen)}
                  >
                    <span className="menu__icon">{item.icon}</span>
                    <span className="menu__text">{item.label}</span>
                    <span className="menu__arrow">
                      {isAccountOpen ? <FaCaretUp /> : <FaCaretDown />}
                    </span>
                  </div>
                  {isAccountOpen && (
                    <div className="menu__submenu">
                      {item.children
                        .filter((child) => child.roles.includes(userRole))
                        .map((child, childIndex) => (
                          <Link
                            key={childIndex}
                            href={child.path}
                            className={`menu__link menu__link--sub ${
                              router.pathname === child.path ? "active" : ""
                            }`}
                          >
                            <span className="menu__icon">{child.icon}</span>
                            <span className="menu__text">{child.label}</span>
                          </Link>
                        ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={item.path}
                  className={`menu__link ${
                    router.pathname === item.path ? "active" : ""
                  }`}
                >
                  <span className="menu__icon">{item.icon}</span>
                  <span className="menu__text">{item.label}</span>
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
