import React, { useState, useEffect } from "react";
import {
  FaUsers,
  FaBoxOpen,
  FaShoppingBag,
  FaExclamationTriangle,
  FaChartLine,
  FaChartBar,
  FaChartPie,
  FaCalendarAlt,
  FaDownload,
  FaFilter,
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
  Legend 
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

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
  const [orderStatus, setOrderStatus] = useState([]);
  const [newCustomers, setNewCustomers] = useState([]);
  const [feedbackList, setFeedbackList] = useState([]);
  const [summaryData, setSummaryData] = useState({
    totalCustomers: 0,
    totalProducts: 0,
    totalOrders: 0,
    outOfStock: 0
  });
  const [revenueData, setRevenueData] = useState({});
  const [categoryData, setCategoryData] = useState({});
  const [timeRange, setTimeRange] = useState('week'); // 'day', 'week', 'month', 'year'

  useEffect(() => {
    fetchSummaryData();
    fetchOrderStatus();
    fetchNewCustomers();
    fetchFeedback();
    fetchRevenueData();
    fetchCategoryData();
  }, [timeRange]);

  // Fetch summary data
  const fetchSummaryData = async () => {
    try {
      // Simulated data - replace with actual API call
      const data = {
        totalCustomers: 1248,
        totalProducts: 356,
        totalOrders: 2453,
        outOfStock: 15
      };
      setSummaryData(data);
    } catch (error) {
      console.error("Error fetching summary data:", error);
    }
  };

  // Fetch order status data
  const fetchOrderStatus = async () => {
    try {
      // Simulated data - replace with actual API call
      const data = [
        { status: "Chờ xử lý", quantity: 12, color: "#FFB74D" },
        { status: "Đang giao", quantity: 8, color: "#64B5F6" },
        { status: "Hoàn thành", quantity: 20, color: "#81C784" },
        { status: "Đã hủy", quantity: 3, color: "#E57373" },
      ];
      setOrderStatus(data);
    } catch (error) {
      console.error("Error fetching order status:", error);
    }
  };

  // Fetch new customers data
  const fetchNewCustomers = async () => {
    try {
      // Simulated data - replace with actual API call
      const data = [
        { id: 1, name: "Nguyễn Văn A", email: "nguyenvana@example.com", time: "2025-02-26 10:00", avatar: "https://randomuser.me/api/portraits/men/1.jpg" },
        { id: 2, name: "Trần Thị B", email: "tranthib@example.com", time: "2025-02-26 11:00", avatar: "https://randomuser.me/api/portraits/women/2.jpg" },
        { id: 3, name: "Lê Văn C", email: "levanc@example.com", time: "2025-02-26 12:30", avatar: "https://randomuser.me/api/portraits/men/3.jpg" },
        { id: 4, name: "Phạm Thị D", email: "phamthid@example.com", time: "2025-02-26 14:15", avatar: "https://randomuser.me/api/portraits/women/4.jpg" },
      ];
      setNewCustomers(data);
    } catch (error) {
      console.error("Error fetching new customers:", error);
    }
  };

  // Fetch feedback data
  const fetchFeedback = async () => {
    try {
      // Simulated data - replace with actual API call
      const data = [
        {
          id: 1,
          content: "Sản phẩm rất tốt, đóng gói cẩn thận, giao hàng nhanh!",
          customer: "Lê Văn C",
          time: "2025-02-25 09:00",
          rating: 5,
          avatar: "https://randomuser.me/api/portraits/men/5.jpg"
        },
        {
          id: 2,
          content: "Giao hàng nhanh, nhưng sản phẩm không đúng như mô tả.",
          customer: "Phạm Thị D",
          time: "2025-02-25 14:00",
          rating: 3,
          avatar: "https://randomuser.me/api/portraits/women/6.jpg"
        },
        {
          id: 3,
          content: "Chất lượng sản phẩm tuyệt vời, sẽ mua lại!",
          customer: "Trần Văn E",
          time: "2025-02-25 16:30",
          rating: 5,
          avatar: "https://randomuser.me/api/portraits/men/7.jpg"
        },
      ];
      setFeedbackList(data);
    } catch (error) {
      console.error("Error fetching feedback:", error);
    }
  };

  // Fetch revenue data for charts
  const fetchRevenueData = async () => {
    try {
      // Simulated data - replace with actual API call
      let labels, values;
      
      switch(timeRange) {
        case 'day':
          labels = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'];
          values = [1200, 1900, 3000, 5000, 4000, 3000];
          break;
        case 'week':
          labels = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'];
          values = [12000, 19000, 15000, 25000, 22000, 30000, 18000];
          break;
        case 'month':
          labels = ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'];
          values = [85000, 95000, 110000, 120000];
          break;
        case 'year':
          labels = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
          values = [300000, 350000, 320000, 380000, 400000, 450000, 420000, 480000, 500000, 540000, 580000, 600000];
          break;
        default:
          labels = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'];
          values = [12000, 19000, 15000, 25000, 22000, 30000, 18000];
      }
      
      setRevenueData({
        labels,
        datasets: [
          {
            label: 'Doanh thu (VNĐ)',
            data: values,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            tension: 0.3
          }
        ]
      });
      
      // Also set category data
      setCategoryData({
        labels: ['Thời trang', 'Điện tử', 'Gia dụng', 'Mỹ phẩm', 'Thực phẩm'],
        datasets: [
          {
            label: 'Doanh thu theo danh mục',
            data: [35, 25, 15, 15, 10],
            backgroundColor: [
              'rgba(255, 99, 132, 0.7)',
              'rgba(54, 162, 235, 0.7)',
              'rgba(255, 206, 86, 0.7)',
              'rgba(75, 192, 192, 0.7)',
              'rgba(153, 102, 255, 0.7)',
            ],
            borderWidth: 1,
          },
        ],
      });
      
    } catch (error) {
      console.error("Error fetching revenue data:", error);
    }
  };
  
  // Fetch category data for pie chart
  const fetchCategoryData = async () => {
    // Implementation included in fetchRevenueData for simplicity
  };

  // Handle time range change
  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <h1 className="dashboard__title">Dashboard</h1>
        <div className="dashboard__actions">
          <div className="dashboard__time-filter">
            <button 
              className={`dashboard__time-btn ${timeRange === 'day' ? 'active' : ''}`}
              onClick={() => handleTimeRangeChange('day')}
            >
              Ngày
            </button>
            <button 
              className={`dashboard__time-btn ${timeRange === 'week' ? 'active' : ''}`}
              onClick={() => handleTimeRangeChange('week')}
            >
              Tuần
            </button>
            <button 
              className={`dashboard__time-btn ${timeRange === 'month' ? 'active' : ''}`}
              onClick={() => handleTimeRangeChange('month')}
            >
              Tháng
            </button>
            <button 
              className={`dashboard__time-btn ${timeRange === 'year' ? 'active' : ''}`}
              onClick={() => handleTimeRangeChange('year')}
            >
              Năm
            </button>
          </div>
          <button className="dashboard__export-btn">
            <FaDownload /> Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="dashboard__summary">
        <div className="dashboard__summary-item">
          <div className="summary-icon users">
            <FaUsers />
          </div>
          <div className="summary-info">
            <h3>{summaryData.totalCustomers.toLocaleString()}</h3>
            <p>Tổng khách hàng</p>
          </div>
        </div>
        
        <div className="dashboard__summary-item">
          <div className="summary-icon products">
            <FaBoxOpen />
          </div>
          <div className="summary-info">
            <h3>{summaryData.totalProducts.toLocaleString()}</h3>
            <p>Tổng sản phẩm</p>
          </div>
        </div>
        
        <div className="dashboard__summary-item">
          <div className="summary-icon orders">
            <FaShoppingBag />
          </div>
          <div className="summary-info">
            <h3>{summaryData.totalOrders.toLocaleString()}</h3>
            <p>Tổng đơn hàng</p>
          </div>
        </div>
        
        <div className="dashboard__summary-item">
          <div className="summary-icon stock">
            <FaExclamationTriangle />
          </div>
          <div className="summary-info">
            <h3>{summaryData.outOfStock}</h3>
            <p>Hết hàng</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard__content">
        {/* Left Column */}
        <div className="dashboard__left">
          {/* Revenue Chart */}
          <div className="dashboard__chart-container">
            <div className="dashboard__chart-header">
              <h3>Doanh thu</h3>
              <div className="dashboard__chart-actions">
                <button className="dashboard__chart-filter">
                  <FaFilter /> Lọc
                </button>
              </div>
            </div>
            <div className="dashboard__chart">
              {revenueData.labels && (
                <Line 
                  data={revenueData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                      title: {
                        display: false,
                      },
                    },
                  }}
                />
              )}
            </div>
          </div>

          {/* Order Status */}
          <div className="dashboard__status-container">
            <div className="dashboard__chart-header">
              <h3>Tình trạng đơn hàng</h3>
            </div>
            <div className="dashboard__status">
              <div className="dashboard__status-chart">
                {orderStatus.length > 0 && (
                  <Pie 
                    data={{
                      labels: orderStatus.map(item => item.status),
                      datasets: [
                        {
                          data: orderStatus.map(item => item.quantity),
                          backgroundColor: orderStatus.map(item => item.color),
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                    }}
                  />
                )}
              </div>
              <div className="dashboard__status-table">
                <table className="dashboard__table">
                  <thead>
                    <tr>
                      <th>Tình trạng</th>
                      <th>Số lượng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderStatus.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <span className="status-dot" style={{ backgroundColor: item.color }}></span>
                          {item.status}
                        </td>
                        <td>{item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="dashboard__right">
          {/* Category Distribution */}
          <div className="dashboard__chart-container">
            <div className="dashboard__chart-header">
              <h3>Phân bố danh mục</h3>
            </div>
            <div className="dashboard__chart">
              {categoryData.labels && (
                <Bar 
                  data={categoryData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                  }}
                />
              )}
            </div>
          </div>

          {/* Recent Customers */}
          <div className="dashboard__recent-container">
            <div className="dashboard__chart-header">
              <h3>Khách hàng mới</h3>
              <a href="/admin/users" className="dashboard__view-all">Xem tất cả</a>
            </div>
            <div className="dashboard__recent-customers">
              {newCustomers.map((customer, index) => (
                <div key={index} className="customer-card">
                  <img src={customer.avatar} alt={customer.name} className="customer-avatar" />
                  <div className="customer-info">
                    <h4>{customer.name}</h4>
                    <p>{customer.email}</p>
                    <small>{customer.time}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Feedback */}
          <div className="dashboard__recent-container">
            <div className="dashboard__chart-header">
              <h3>Đánh giá gần đây</h3>
              <a href="/admin/reviews" className="dashboard__view-all">Xem tất cả</a>
            </div>
            <div className="dashboard__recent-feedback">
              {feedbackList.map((feedback, index) => (
                <div key={index} className="feedback-card">
                  <div className="feedback-header">
                    <img src={feedback.avatar} alt={feedback.customer} className="feedback-avatar" />
                    <div className="feedback-user">
                      <h4>{feedback.customer}</h4>
                      <div className="feedback-rating">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`star ${i < feedback.rating ? 'filled' : ''}`}>★</span>
                        ))}
                      </div>
                    </div>
                    <div className="feedback-time">{feedback.time}</div>
                  </div>
                  <p className="feedback-content">{feedback.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
