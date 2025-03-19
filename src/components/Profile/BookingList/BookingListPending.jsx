import { useState, useEffect } from "react";
import { FaCalendarAlt, FaClock, FaUser, FaSpinner, FaExclamationCircle, FaEllipsisV, FaCheckCircle, FaStar } from "react-icons/fa";
import useBookingListPendingHook from "@/auth/hook/useBookingListPendingHook";
import { isAuthenticated, getToken } from "@/utils/auth";
import { APIClient } from "@/lib/api-client";
import { ACTIONS, API_URL } from "@/lib/api-client/constant";
import { useRouter } from 'next/router';
import { showToast } from "@/utils/toast";

const BookingListPending = () => {
  const router = useRouter();
  const { loading, error, data: pendingBookings, refreshPendingBookings } = useBookingListPendingHook();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [expandedBooking, setExpandedBooking] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancellingBookingId, setCancellingBookingId] = useState(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const [completingBookingId, setCompletingBookingId] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedBookingForFeedback, setSelectedBookingForFeedback] = useState(null);
  const [feedbackContent, setFeedbackContent] = useState("");
  const [feedbackScore, setFeedbackScore] = useState(5);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [submittedFeedbackBookings, setSubmittedFeedbackBookings] = useState([]);

  // Check authentication on component mount
  useEffect(() => {
    const isUserAuthenticated = isAuthenticated();
    console.log("BookingListPending: User authentication status:", isUserAuthenticated);
    setIsAuthChecked(isUserAuthenticated);
  }, []);

  // Refresh data periodically (every 60 seconds)
  useEffect(() => {
    if (isAuthChecked) {
      const interval = setInterval(() => {
        refreshPendingBookings();
      }, 60000);
      
      return () => clearInterval(interval);
    }
  }, [isAuthChecked]);

  // Format date for display (YYYY-MM-DD to DD/MM/YYYY)
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  // Format time for display (HH:MM:SS to HH:MM)
  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    
    return timeString.substring(0, 5);
  };

  // Toggle expanded booking details
  const toggleExpandBooking = (bookingId) => {
    if (expandedBooking === bookingId) {
      setExpandedBooking(null);
    } else {
      setExpandedBooking(bookingId);
    }
  };

  // Handle booking cancellation
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    setIsCancelling(true);
    setCancellingBookingId(bookingId);

    try {
      console.log('Attempting to cancel booking ID:', bookingId);
      
      const response = await APIClient.invoke({
        action: ACTIONS.DELETE_BOOKING,
        data: { bookingId: bookingId.toString() }, // Pass as data not pathParams
        options: { 
          preventRedirect: true,
          secure: true
        }
      });

      console.log('Cancel booking response:', response);

      if (response && response.success === true) {
        alert('Booking cancelled successfully');
        refreshPendingBookings(); // Refresh the list
      } else {
        alert(response?.message || 'Failed to cancel booking');
      }
    } catch (err) {
      console.error('Error cancelling booking:', err);
      alert('Failed to cancel booking. Please try again later.');
    } finally {
      setIsCancelling(false);
      setCancellingBookingId(null);
    }
  };

  // Handle booking completion
  const handleCompleteBooking = async (booking) => {
    if (!window.confirm('Are you sure you want to complete this booking?')) {
      return;
    }

    setIsCompleting(true);
    setCompletingBookingId(booking.bookingId);

    try {
      // Create booking details for the confirmation page
      const bookingDetails = {
        bookingId: booking.bookingId,
        therapistName: booking.therapistName,
        serviceNames: booking.serviceName.map(service => service.serviceName).join(', '),
        appointmentDateTime: `${formatDate(booking.bookingDate)} ${formatTime(booking.bookingTime)}`,
        serviceId: booking.serviceName.map(service => service.serviceId),
        // Add service prices if available or use placeholder
        servicePrices: booking.serviceName.map(service => service.price || 1000000),
        // Calculate subtotal from service prices
        subtotal: booking.serviceName.reduce((sum, service) => sum + (service.price || 1000000), 0),
        // Add total amount
        totalAmount: booking.serviceName.reduce((sum, service) => sum + (service.price || 1000000), 0)
      };

      // Store booking details in localStorage for the confirmation page
      localStorage.setItem('lastBookingDetails', JSON.stringify(bookingDetails));
      
      // Redirect to confirmation page
      router.push('/booking/confirmation?success=true&bookingId=' + booking.bookingId);
    } catch (err) {
      console.error('Error completing booking:', err);
      alert('Failed to complete booking. Please try again later.');
    } finally {
      setIsCompleting(false);
      setCompletingBookingId(null);
    }
  };

  // Format currency to VND
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Handle showing feedback modal
  const handleShowFeedback = (booking) => {
    setSelectedBookingForFeedback(booking);
    setShowFeedbackModal(true);
    setFeedbackContent("");
    setFeedbackScore(5);
  };

  // Handle submitting feedback
  const handleSubmitFeedback = async () => {
    if (!selectedBookingForFeedback) return;

    // Validate required fields
    if (!feedbackContent.trim()) {
      showToast("Please enter your feedback comments", "error");
      return;
    }

    if (!feedbackScore) {
      showToast("Please select a rating", "error");
      return;
    }

    setIsSubmittingFeedback(true);
    try {
      // Get user info from localStorage
      const userString = localStorage.getItem('user');
      const user = userString ? JSON.parse(userString) : null;
      
      if (!user || !user.id) {
        showToast("User information not found. Please log in again.", "error");
        return;
      }

      const feedbackData = {
        date: new Date().toISOString().split('T')[0],
        content: feedbackContent.trim(),
        score: Number(feedbackScore),
        userId: Number(user.id),
        bookingId: Number(selectedBookingForFeedback.bookingId)
      };

      console.log("Submitting feedback:", feedbackData);

      const response = await APIClient.invoke({
        action: ACTIONS.SUBMIT_FEEDBACK,
        data: feedbackData,
        options: { 
          preventRedirect: true,
          secure: true
        }
      });

      console.log("Feedback response:", response);

      if (response?.success) {
        showToast("Thank you for your feedback!", "success");
        setShowFeedbackModal(false);
        setFeedbackContent("");
        setFeedbackScore(5);
        // Add the booking ID to submitted feedback list
        setSubmittedFeedbackBookings(prev => [...prev, selectedBookingForFeedback.bookingId]);
        refreshPendingBookings();
      } else {
        throw new Error(response?.message || "Failed to submit feedback");
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      showToast(
        error?.response?.message || error.message || "Unable to submit feedback. Please try again later.", 
        "error"
      );
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  // Render authentication required view
  if (!isAuthChecked) {
    return (
      <div className="booking-list-pending">
        <div className="booking-list-pending__auth-error">
          <FaExclamationCircle size={24} className="auth-error-icon" />
          <h3>Authentication Required</h3>
          <p>You need to be logged in to view your pending bookings.</p>
          <button 
            className="auth-error-button"
            onClick={() => window.location.href = '/login'}
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  // Render loading state
  if (loading) {
    return (
      <div className="booking-list-pending">
        <div className="booking-list-pending__loading">
          <FaSpinner className="loading-spinner" />
          <p>Loading your pending bookings...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="booking-list-pending">
        <div className="booking-list-pending__error">
          <FaExclamationCircle size={24} className="error-icon" />
          <h3>Error Loading Bookings</h3>
          <p>{error}</p>
          <button 
            className="error-refresh-button"
            onClick={() => refreshPendingBookings()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Render empty state
  if (!pendingBookings || pendingBookings.length === 0) {
    return (
      <div className="booking-list-pending">
        <div className="booking-list-pending__empty">
          <FaCalendarAlt size={24} className="empty-icon" />
          <h3>No Pending Bookings</h3>
          <p>You don't have any pending bookings at the moment.</p>
          <button 
            className="book-now-button"
            onClick={() => window.location.href = '/booking'}
          >
            Book Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-list-pending">
      <div className="booking-list-pending__header">
        <h2>Your Pending Bookings</h2>
        <p>These bookings are awaiting confirmation from our clinic</p>
      </div>

      <div className="booking-list-pending__list">
        {pendingBookings.map((booking) => (
          <div 
            key={booking.bookingId} 
            className={`booking-card ${expandedBooking === booking.bookingId ? 'expanded' : ''}`}
          >
            <div className="booking-card__header">
              <div className="booking-id">
                <span className="label">Booking #</span>
                <span className="value">{booking.bookingId}</span>
              </div>
              
              <div className="booking-status">
                <span className="status-dot"></span>
                <span className="status-text">{booking.status}</span>
              </div>
              
              <button 
                className="expand-button"
                onClick={() => toggleExpandBooking(booking.bookingId)}
                aria-label="Toggle booking details"
              >
                <FaEllipsisV />
              </button>
            </div>
            
            <div className="booking-card__main">
              <div className="booking-info">
                <div className="info-item">
                  <FaCalendarAlt className="info-icon" />
                  <div className="info-content">
                    <span className="info-label">Date</span>
                    <span className="info-value">{formatDate(booking.bookingDate)}</span>
                  </div>
                </div>
                
                <div className="info-item">
                  <FaClock className="info-icon" />
                  <div className="info-content">
                    <span className="info-label">Time</span>
                    <span className="info-value">{formatTime(booking.bookingTime)}</span>
                  </div>
                </div>
                
                <div className="info-item">
                  <FaUser className="info-icon" />
                  <div className="info-content">
                    <span className="info-label">Therapist</span>
                    <span className="info-value">{booking.therapistName}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {expandedBooking === booking.bookingId && (
              <div className="booking-card__details">
                <h4>Services</h4>
                <ul className="service-list">
                  {booking.serviceName.map((service, index) => (
                    <li key={index} className="service-item">
                      {service.serviceName}
                    </li>
                  ))}
                </ul>
                
                <div className="booking-actions">
                  <button 
                    className="cancel-button"
                    onClick={() => handleCancelBooking(booking.bookingId)}
                    disabled={isCancelling}
                  >
                    {isCancelling && cancellingBookingId === booking.bookingId ? (
                      <>
                        <FaSpinner className="spinner" /> Cancelling...
                      </>
                    ) : (
                      "Cancel Booking"
                    )}
                  </button>
                  
                  <button 
                    className="complete-button"
                    onClick={() => handleCompleteBooking(booking)}
                    disabled={isCompleting}
                  >
                    {isCompleting && completingBookingId === booking.bookingId ? (
                      <>
                        <FaSpinner className="spinner" /> Completing...
                      </>
                    ) : (
                      <>
                        <FaCheckCircle className="icon" /> Complete Booking
                      </>
                    )}
                  </button>

                  {!submittedFeedbackBookings.includes(booking.bookingId) && (
                    <button 
                      className="feedback-button"
                      onClick={() => handleShowFeedback(booking)}
                    >
                      <FaStar className="icon" /> Leave Feedback
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {showFeedbackModal && (
        <div className="feedback-modal">
          <div className="feedback-modal__content">
            <h3>Leave Your Feedback</h3>
            <p>Booking #{selectedBookingForFeedback?.bookingId}</p>
            
            <div className="rating-section">
              <p>Your Rating:</p>
              <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className={`star-button ${star <= feedbackScore ? 'active' : ''}`}
                    onClick={() => setFeedbackScore(star)}
                  >
                    <FaStar />
                  </button>
                ))}
              </div>
            </div>
            
            <div className="feedback-input">
              <label htmlFor="feedback">Your Comments:</label>
              <textarea
                id="feedback"
                value={feedbackContent}
                onChange={(e) => setFeedbackContent(e.target.value)}
                placeholder="Tell us about your experience..."
                rows={4}
              />
            </div>
            
            <div className="feedback-actions">
              <button 
                className="cancel-button"
                onClick={() => setShowFeedbackModal(false)}
                disabled={isSubmittingFeedback}
              >
                Cancel
              </button>
              <button 
                className="submit-button"
                onClick={handleSubmitFeedback}
                disabled={isSubmittingFeedback || !feedbackContent.trim()}
              >
                {isSubmittingFeedback ? (
                  <>
                    <FaSpinner className="spinner" /> Submitting...
                  </>
                ) : (
                  'Submit Feedback'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        /* Existing styles... */
        
        .booking-actions {
          display: flex;
          gap: 10px;
          margin-top: 15px;
        }
        
        .cancel-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background-color: #e74c3c;
          color: white;
          border: none;
          padding: 8px 15px;
          border-radius: 4px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .cancel-button:hover {
          background-color: #c0392b;
        }
        
        .cancel-button:disabled {
          background-color: #95a5a6;
          cursor: not-allowed;
        }
        
        .complete-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background-color: #2ecc71;
          color: white;
          border: none;
          padding: 8px 15px;
          border-radius: 4px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .complete-button:hover {
          background-color: #27ae60;
        }
        
        .complete-button:disabled {
          background-color: #95a5a6;
          cursor: not-allowed;
        }
        
        .spinner {
          animation: spin 1s linear infinite;
        }
        
        .icon {
          margin-right: 2px;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .feedback-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .feedback-modal__content {
          background-color: white;
          padding: 30px;
          border-radius: 8px;
          width: 90%;
          max-width: 500px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .feedback-modal__content h3 {
          margin: 0 0 15px 0;
          font-size: 1.5rem;
          color: #333;
        }

        .rating-section {
          margin: 20px 0;
        }

        .stars {
          display: flex;
          gap: 10px;
          margin-top: 10px;
        }

        .star-button {
          background: none;
          border: none;
          font-size: 24px;
          color: #ddd;
          cursor: pointer;
          padding: 0;
          transition: color 0.2s;
        }

        .star-button.active {
          color: #ffc107;
        }

        .feedback-input {
          margin: 20px 0;
        }

        .feedback-input label {
          display: block;
          margin-bottom: 8px;
          color: #555;
        }

        .feedback-input textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          resize: vertical;
          font-family: inherit;
        }

        .feedback-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 20px;
        }

        .feedback-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background-color: #ffc107;
          color: #333;
          border: none;
          padding: 8px 15px;
          border-radius: 4px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .feedback-button:hover {
          background-color: #ffb300;
        }

        .submit-button {
          background-color: #4CAF50;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .submit-button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default BookingListPending;