import React from "react";
import { useTherapistFeedback } from "@/auth/hook/useTherapistFeedbackHook";
import { FaSpinner, FaStar } from "react-icons/fa";
import { getCookie } from "cookies-next";

export const Feedback = () => {
  // Get therapistId from cookie or context
  const userRole = getCookie("userRole");
  const therapistId = getCookie("therapistId"); // You'll need to set this during login

  const {
    data: feedbacks,
    isLoading,
    error,
  } = useTherapistFeedback(therapistId);

  if (userRole !== "THERAPIST") {
    return (
      <div className="admin-page__error">
        <p>Unauthorized access</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="admin-page__loading">
        <FaSpinner className="spinner" />
        <p>Đang tải feedback...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page__error">
        <p>Có lỗi xảy ra khi tải feedback</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <h1>Đánh giá của khách hàng</h1>
      </div>

      <div className="admin-page__content">
        <div className="feedback-list">
          {feedbacks?.result?.length > 0 ? (
            feedbacks.result.map((feedback, index) => (
              <div key={index} className="feedback-item">
                <div className="feedback-item__header">
                  <h3>{feedback.customerName}</h3>
                  <div className="feedback-item__rating">
                    {[...Array(feedback.rating)].map((_, i) => (
                      <FaStar key={i} className="star-filled" />
                    ))}
                    {[...Array(5 - feedback.rating)].map((_, i) => (
                      <FaStar
                        key={i + feedback.rating}
                        className="star-empty"
                      />
                    ))}
                  </div>
                </div>
                <p className="feedback-item__comment">{feedback.comment}</p>
                <span className="feedback-item__date">
                  {new Date(feedback.createdAt).toLocaleDateString("vi-VN")}
                </span>
              </div>
            ))
          ) : (
            <div className="feedback-empty">
              <p>Chưa có đánh giá nào</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
