import React, { useState, useEffect } from "react";

const Dashboard = () => {
  const [orderStatus, setOrderStatus] = useState([]);
  const [newCustomers, setNewCustomers] = useState([]);
  const [feedbackList, setFeedbackList] = useState([]);

  useEffect(() => {
    fetchOrderStatus();
    fetchNewCustomers();
    fetchFeedback();
  }, []);

  // Hàm lấy dữ liệu tình trạng đơn hàng (giả lập)
  const fetchOrderStatus = async () => {
    try {
      // Giả lập dữ liệu mẫu
      const data = [
        { status: "Chờ xử lý", quantity: 12 },
        { status: "Đang giao", quantity: 8 },
        { status: "Hoàn thành", quantity: 20 },
      ];
      setOrderStatus(data);
      // Khi có API thật, bạn dùng:
      // const res = await fetch("/api/orderStatus");
      // const data = await res.json();
      // setOrderStatus(data);
    } catch (error) {
      console.error("Error fetching order status:", error);
    }
  };

  // Hàm lấy dữ liệu khách hàng mới (giả lập)
  const fetchNewCustomers = async () => {
    try {
      const data = [
        { id: 1, name: "Nguyễn A", time: "2025-02-26 10:00" },
        { id: 2, name: "Trần B", time: "2025-02-26 11:00" },
      ];
      setNewCustomers(data);
      // API thật:
      // const res = await fetch("/api/newCustomers");
      // const data = await res.json();
      // setNewCustomers(data);
    } catch (error) {
      console.error("Error fetching new customers:", error);
    }
  };

  // Hàm lấy dữ liệu feedback mới (giả lập)
  const fetchFeedback = async () => {
    try {
      const data = [
        {
          id: 1,
          content: "Sản phẩm tốt",
          customer: "Lê C",
          time: "2025-02-25 09:00",
        },
        {
          id: 2,
          content: "Giao hàng nhanh",
          customer: "Phạm D",
          time: "2025-02-25 14:00",
        },
      ];
      setFeedbackList(data);
      // API thật:
      // const res = await fetch("/api/feedback");
      // const data = await res.json();
      // setFeedbackList(data);
    } catch (error) {
      console.error("Error fetching feedback:", error);
    }
  };

  return (
    <div className="dashboard">
      {/* Cột bên trái */}
      <div className="dashboard__left">
        {/* Phần tổng hợp 4 khối */}
        <div className="dashboard__summary">
          <div className="dashboard__summary-item">Tổng khách hàng</div>
          <div className="dashboard__summary-item">Tổng sản phẩm</div>
          <div className="dashboard__summary-item">Tổng đơn hàng</div>
          <div className="dashboard__summary-item">Hết hàng</div>
        </div>

        {/* Tình trạng đơn hàng */}
        <div className="dashboard__status">
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
                  <td>{item.status}</td>
                  <td>{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Khách hàng mới */}
        <div className="dashboard__new-customers">
          <table className="dashboard__table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Khách hàng</th>
                <th>Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {newCustomers.map((customer, index) => (
                <tr key={index}>
                  <td>{customer.id}</td>
                  <td>{customer.name}</td>
                  <td>{customer.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Feedback mới */}
        <div className="dashboard__feedback">
          <table className="dashboard__table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Nội dung</th>
                <th>Khách hàng</th>
                <th>Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {feedbackList.map((feedback, index) => (
                <tr key={index}>
                  <td>{feedback.id}</td>
                  <td>{feedback.content}</td>
                  <td>{feedback.customer}</td>
                  <td>{feedback.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cột bên phải */}
      <div className="dashboard__right">
        {/* 2 bảng số liệu */}
        <div className="dashboard__charts">
          <div className="dashboard__chart">Bảng doanh thu (cột)</div>
          <div className="dashboard__chart">Bảng đầu vào</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
