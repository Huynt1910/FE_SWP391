import React from "react";
import { useTherapistFeedback } from "@/auth/hook/admin/useTherapistFeedbackHook";
import { FaSpinner, FaStar } from "react-icons/fa";

export const Feedback = () => {
  const { data: feedbacks, isLoading, error } = useTherapistFeedback();

  if (isLoading) {
    return (
      <div className="admin-page__loading">
        <FaSpinner className="spinner" />
        <p>Đang tải đánh giá...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page__error">
        <p>Có lỗi xảy ra khi tải đánh giá</p>
      </div>
    );
  }

  return (
    <div className="admin-page feedback-page">
      <div className="admin-page__header">
        <h1>Đánh Giá Của Khách Hàng</h1>
      </div>

      <div className="admin-page__content">
        <div className="feedback-list">
          {feedbacks?.length > 0 ? (
            feedbacks.map((feedback, index) => (
              <div key={index} className="feedback-item">
                <div className="feedback-item__header">
                  <h3 className="feedback-item__customer">
                    {feedback.customerName}
                  </h3>
                  <div className="feedback-item__rating">
                    {[...Array(Math.round(feedback.score))].map((_, i) => (
                      <FaStar key={i} className="star-filled" />
                    ))}
                    {[...Array(5 - Math.round(feedback.score))].map((_, i) => (
                      <FaStar
                        key={i + Math.round(feedback.score)}
                        className="star-empty"
                      />
                    ))}
                  </div>
                </div>
                <p className="feedback-item__comment">{feedback.content}</p>
                <span className="feedback-item__date">
                  {new Date(feedback.date).toLocaleDateString("vi-VN")}
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
