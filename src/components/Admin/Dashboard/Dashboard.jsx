import React, { useState, useEffect } from "react";
import {
  FaUsers,
  FaCalendarCheck,
  FaMoneyBillWave,
  FaChartLine,
  FaSpinner,
} from "react-icons/fa";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Doughnut, Bar } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState("day");
  const [statistics, setStatistics] = useState({
    totalCustomers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    recentBookings: [],
    monthlyRevenue: [],
  });

  const [isLoading, setIsLoading] = useState(true);

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    fetchDashboardData(range);
  };

  const formatDateTime = (date) => {
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const fetchDashboardData = (range) => {
    setIsLoading(true);
    setTimeout(() => {
      setStatistics({
        totalCustomers: 150,
        totalBookings: 89,
        todayBookings: 12,
        todayRevenue: 15000000,
        totalRevenue: 45000000,
        recentBookings: [
          {
            id: 1,
            customerName: "Nguyen Van A",
            serviceName: "Facial Treatment",
            datetime: "2024-03-15T10:00:00",
            value: 850000,
            status: "pending",
          },
          {
            id: 2,
            customerName: "Tran Thi B",
            serviceName: "Massage",
            datetime: "2024-03-14T15:30:00",
            value: 750000,
            status: "confirmed",
          },
        ],
        monthlyRevenue: [
          { month: "Jan", revenue: 15000000 },
          { month: "Feb", revenue: 25000000 },
          { month: "Mar", revenue: 45000000 },
        ],
      });
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    fetchDashboardData(timeRange);
  }, []);

  const bookingStatusData = {
    labels: ["Chờ xác nhận", "Đã xác nhận", "Hoàn thành", "Đã hủy"],
    datasets: [
      {
        data: [15, 25, 40, 20],
        backgroundColor: ["#fbbf24", "#34d399", "#60a5fa", "#f87171"],
      },
    ],
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getStatusText = (status) => {
    const statusMap = {
      pending: "Chờ xác nhận",
      confirmed: "Đã xác nhận",
      completed: "Hoàn thành",
      cancelled: "Đã hủy",
    };
    return statusMap[status] || status;
  };

  const revenueData = {
    labels: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
    datasets: [
      {
        label: "Doanh thu",
        data: [650, 590, 800, 810, 560, 550, 400],
        borderColor: "#3b82f6",
        tension: 0.4,
      },
    ],
  };

  const revenueOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const customerTypeData = {
    labels: ["Khách hàng mới", "Khách hàng cũ"],
    datasets: [
      {
        data: [30, 70],
        backgroundColor: ["#34d399", "#60a5fa"],
      },
    ],
  };

  const customerTypeOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  const popularServicesData = {
    labels: ["Massage", "Facial", "Nails", "Hair", "Spa"],
    datasets: [
      {
        label: "Số lượt đặt",
        data: [65, 59, 80, 81, 56],
        backgroundColor: "#3b82f6",
      },
    ],
  };

  const servicesOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const statusOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  const quickStats = [
    {
      title: "Tổng khách hàng",
      value: statistics.totalCustomers?.toLocaleString() || "0",
      icon: <FaUsers />,
      color: "customers",
      trend: "+5.2%",
    },
    {
      title: "Lịch hẹn hôm nay",
      value: statistics.todayBookings?.toLocaleString() || "0",
      icon: <FaCalendarCheck />,
      color: "bookings",
      trend: "+12%",
    },
    {
      title: "Doanh thu hôm nay",
      value: formatCurrency(statistics.todayRevenue || 0),
      icon: <FaMoneyBillWave />,
      color: "revenue",
      trend: "+8.1%",
    },
    {
      title: "Tỉ lệ hoàn thành",
      value: "92%",
      icon: <FaChartLine />,
      color: "completion",
      trend: "+2.4%",
    },
  ];

  if (isLoading) {
    return (
      <div className="dashboard__loading">
        <FaSpinner className="spinner" />
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div className="admin-page__header-title">
          <h1>Dashboard</h1>
          <p>Tổng quan hoạt động kinh doanh</p>
        </div>
        <div className="admin-page__header-actions">
          <div className="dashboard__time-filter">
            <button
              className={`dashboard__time-btn ${
                timeRange === "day" ? "active" : ""
              }`}
              onClick={() => handleTimeRangeChange("day")}
            >
              Ngày
            </button>
            <button
              className={`dashboard__time-btn ${
                timeRange === "week" ? "active" : ""
              }`}
              onClick={() => handleTimeRangeChange("week")}
            >
              Tuần
            </button>
            <button
              className={`dashboard__time-btn ${
                timeRange === "month" ? "active" : ""
              }`}
              onClick={() => handleTimeRangeChange("month")}
            >
              Tháng
            </button>
            <button
              className={`dashboard__time-btn ${
                timeRange === "year" ? "active" : ""
              }`}
              onClick={() => handleTimeRangeChange("year")}
            >
              Năm
            </button>
          </div>
        </div>
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
                  <span className="trend">{stat.trend}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="dashboard__charts">
            <div className="chart-container revenue-chart">
              <h3>Doanh thu 7 ngày gần nhất</h3>
              <Line data={revenueData} options={revenueOptions} />
            </div>

            <div className="chart-container status-chart">
              <h3>Trạng thái lịch hẹn</h3>
              <Doughnut data={bookingStatusData} options={statusOptions} />
            </div>
          </div>

          <div className="dashboard__insights">
            <div className="customer-stats">
              <h3>Phân tích khách hàng</h3>
              <div className="stats-grid">
                <div className="customer-type">
                  <Doughnut
                    data={customerTypeData}
                    options={customerTypeOptions}
                  />
                  <p>Tỉ lệ khách hàng mới/cũ</p>
                </div>
                <div className="popular-services">
                  <Bar data={popularServicesData} options={servicesOptions} />
                  <p>Top 5 dịch vụ phổ biến</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
