import React, { useState } from "react";
import {
  FaUsers,
  FaCalendarCheck,
  FaMoneyBillWave,
  FaChartLine,
  FaSpinner,
} from "react-icons/fa";
import { useDashboardActions } from "@/auth/hook/admin/useDashboardActions";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount || 0);
};

const Dashboard = () => {
  const [currentMonth] = useState(new Date().getMonth() + 1); // Current month (1-12)
  const { useGetDashboardStats } = useDashboardActions();
  const { data: stats, isLoading, error } = useGetDashboardStats(currentMonth);

  console.log("Dashboard Stats:", stats); // Debug log

  const quickStats = [
    {
      title: "Tổng khách hàng",
      value: (stats?.totalCustomers || 0).toLocaleString(),
      icon: <FaUsers />,
      color: "customers",
    },
    {
      title: "Tổng lịch hẹn",
      value: (stats?.totalBookings || 0).toLocaleString(),
      icon: <FaCalendarCheck />,
      color: "bookings",
    },
    {
      title: "Doanh thu tháng",
      value: formatCurrency(stats?.totalRevenue),
      icon: <FaMoneyBillWave />,
      color: "revenue",
    },
    {
      title: "Tổng dịch vụ",
      value: (stats?.totalServices || 0).toLocaleString(),
      icon: <FaChartLine />,
      color: "completion",
    },
  ];

  if (error) {
    console.error("Dashboard Error:", error);
    return (
      <div className="admin-page__error">Có lỗi xảy ra khi tải dữ liệu</div>
    );
  }

  if (isLoading) {
    return (
      <div className="admin-page__loading">
        <FaSpinner className="spinner" />
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <h1>Tổng quan</h1>
      </div>
      <div className="admin-page__content">
        <div className="dashboard">
          <div className="dashboard__stats">
            {quickStats.map((stat, index) => (
              <div className="stat-card" key={index}>
                <div className={`stat-card__icon ${stat.color}`}>
                  {stat.icon}
                </div>
                <div className="stat-card__info">
                  <h3>{stat.title}</h3>
                  <p>{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Add your charts here */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
