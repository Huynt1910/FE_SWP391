import { useState, useEffect } from "react";
import { FaCalendarAlt, FaClock, FaUser, FaSpinner, FaExclamationCircle, FaEllipsisV, FaStar, FaCheckCircle, FaCheck, FaTrash, FaExclamationTriangle } from "react-icons/fa";
import useBookingListCompletedHook from "@/auth/hook/useBookingListCompletedHook";
import { isAuthenticated } from "@/utils/auth";
import { APIClient } from "@/lib/api-client";
import { ACTIONS } from "@/lib/api-client/constant";
import { showToast } from "@/utils/toast";
import { getCookie } from "cookies-next";

const BookingListCompleted = () => {
  const { 
    loading, 
    error, 
    data: completedBookings, 
    refreshCompletedBookings,
    deleteBooking,
    isDeleting: hookIsDeleting 
  } = useBookingListCompletedHook();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [expandedBooking, setExpandedBooking] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedBookingForFeedback, setSelectedBookingForFeedback] = useState(null);
  const [feedbackContent, setFeedbackContent] = useState("");
  const [feedbackScore, setFeedbackScore] = useState(5);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [submittedFeedbackBookings, setSubmittedFeedbackBookings] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [bookingToConfirmDelete, setBookingToConfirmDelete] = useState(null);

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      const isUserAuthenticated = isAuthenticated();
      console.log("BookingListCompleted: User authentication status:", isUserAuthenticated);
      
      if (isUserAuthenticated) {
        // Also verify token validity
        const token = getCookie("token");
        if (!token) {
          console.error("Token not found despite authenticated status");
          setIsAuthChecked(false);
          return;
        }
        
        setIsAuthChecked(true);
        refreshCompletedBookings(); // Force refresh data after confirming authentication
      } else {
        setIsAuthChecked(false);
      }
    };
    
    checkAuth();

    // Load submitted feedback bookings from localStorage
    try {
      const storedFeedbacks = JSON.parse(localStorage.getItem('submittedFeedbackBookings') || '[]');
      setSubmittedFeedbackBookings(storedFeedbacks);
    } catch (error) {
      console.error('Error loading submitted feedbacks:', error);
      // If there's an error reading from localStorage, reset it
      localStorage.setItem('submittedFeedbackBookings', '[]');
    }
  }, []);

  // Refresh data periodically (every 60 seconds)
  useEffect(() => {
    if (isAuthChecked) {
      const interval = setInterval(() => {
        refreshCompletedBookings();
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
    // Check if feedback was already submitted
    if (submittedFeedbackBookings.includes(booking.bookingId)) {
      showToast("You have already submitted feedback for this booking", "info");
      return; // Exit early if feedback already submitted
    }
    
    setSelectedBookingForFeedback(booking);
    setShowFeedbackModal(true);
    setFeedbackContent("");
    setFeedbackScore(5);
  };

  // Handle submitting feedback
  const handleSubmitFeedback = async () => {
    if (!selectedBookingForFeedback) {
      showToast("No booking selected for feedback", "error");
      return;
    }

    // Check if feedback was already submitted
    if (submittedFeedbackBookings.includes(selectedBookingForFeedback.bookingId)) {
      showToast("You have already submitted feedback for this booking", "info");
      setShowFeedbackModal(false);
      return;
    }

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
      // Get user ID from cookie
      const userId = getCookie("userId");
      
      if (!userId) {
        showToast("Please log in again to submit feedback", "error");
        return;
      }

      const feedbackData = {
        date: new Date().toISOString().split('T')[0],
        content: feedbackContent.trim(),
        score: Number(feedbackScore),
        userId: Number(userId),
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
        try {
          // Update localStorage with the new feedback
          const updatedFeedbacks = [...submittedFeedbackBookings, selectedBookingForFeedback.bookingId];
          localStorage.setItem('submittedFeedbackBookings', JSON.stringify(updatedFeedbacks));
          
          // Update state
          setSubmittedFeedbackBookings(updatedFeedbacks);
          
          showToast("Thank you for your feedback!", "success");
          setShowFeedbackModal(false);
          setFeedbackContent("");
          setFeedbackScore(5);
          setSelectedBookingForFeedback(null);
          
          // Refresh bookings to reflect any changes from the server
          refreshCompletedBookings();
        } catch (error) {
          console.error('Error updating localStorage:', error);
        }
      } else if (response?.message?.toLowerCase().includes('already submitted')) {
        // If feedback was already submitted, update our local state
        const updatedFeedbacks = [...submittedFeedbackBookings, selectedBookingForFeedback.bookingId];
        localStorage.setItem('submittedFeedbackBookings', JSON.stringify(updatedFeedbacks));
        setSubmittedFeedbackBookings(updatedFeedbacks);
        
        showToast("You have already submitted feedback for this booking", "info");
        setShowFeedbackModal(false);
      } else {
        throw new Error(response?.message || "Failed to submit feedback");
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      showToast(
        error?.message || "Unable to submit feedback. Please try again later.", 
        "error"
      );
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  // Show delete confirmation
  const confirmDeleteBooking = (booking) => {
    setBookingToConfirmDelete(booking);
    setShowDeleteConfirmation(true);
  };

  // Handle actual deletion after confirmation
  const handleDeleteBooking = async (bookingId) => {
    if (isDeleting) return;
    
    setIsDeleting(true);
    setBookingToDelete(bookingId);
    setShowDeleteConfirmation(false);
    
    try {
      const result = await deleteBooking(bookingId);
      
      if (result.success) {
        showToast("Booking deleted successfully", "success");
      } else {
        showToast(result.message || "Failed to delete booking", "error");
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      showToast(
        error?.message || "Unable to delete booking. Please try again later.", 
        "error"
      );
    } finally {
      setIsDeleting(false);
      setBookingToDelete(null);
      setBookingToConfirmDelete(null);
    }
  };

  // Cancel deletion
  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
    setBookingToConfirmDelete(null);
  };

  // Render authentication required view
  if (!isAuthChecked) {
    return (
      <div className="booking-list-completed">
        <div className="booking-list-completed__auth-error">
          <FaExclamationCircle size={24} className="auth-error-icon" />
          <h3>Authentication Required</h3>
          <p>You need to be logged in to view your completed bookings.</p>
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
      <div className="booking-list-completed">
        <div className="booking-list-completed__loading">
          <FaSpinner className="loading-spinner" />
          <p>Loading your completed bookings...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="booking-list-completed">
        <div className="booking-list-completed__error">
          <FaExclamationCircle size={24} className="error-icon" />
          <h3>Error Loading Bookings</h3>
          <p>{error}</p>
          <button 
            className="error-refresh-button"
            onClick={() => refreshCompletedBookings()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Render empty state
  if (!completedBookings || completedBookings.length === 0) {
    return (
      <div className="booking-list-completed">
        <div className="booking-list-completed__empty">
          <FaCalendarAlt size={24} className="empty-icon" />
          <h3>No Completed Bookings</h3>
          <p>You don't have any completed bookings at the moment.</p>
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
    <div className="booking-list-completed">
      <div className="booking-list-completed__header">
        <h2>Your Completed Bookings</h2>
        <p>Your booking history is shown below</p>
      </div>

      <div className="booking-list-completed__list">
        {completedBookings.map((booking) => (
          <div 
            key={booking.bookingId} 
            className={`booking-card ${expandedBooking === booking.bookingId ? 'expanded' : ''}`}
          >
            <div className="booking-card__header">
              <div className="booking-id">
                <span className="label">Booking #</span>
                <span className="value">{booking.bookingId}</span>
              </div>
              
              <div className="booking-status completed">
                <span className="status-dot"></span>
                <FaCheck className="status-icon" /> Completed
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
                  {submittedFeedbackBookings.includes(booking.bookingId) ? (
                    <div className="feedback-badge">
                      <FaCheckCircle className="icon" />
                      <span>Feedback Submitted</span>
                    </div>
                  ) : (
                    <button 
                      className="feedback-button"
                      onClick={() => handleShowFeedback(booking)}
                    >
                      <FaStar className="icon" /> Leave Feedback
                    </button>
                  )}
                  
                  <button 
                    className="delete-button"
                    onClick={() => confirmDeleteBooking(booking)}
                    disabled={isDeleting && bookingToDelete === booking.bookingId}
                  >
                    {isDeleting && bookingToDelete === booking.bookingId ? (
                      <>
                        <FaSpinner className="spinner" /> Deleting...
                      </>
                    ) : (
                      <>
                        <FaTrash className="icon" /> Delete Booking
                      </>
                    )}
                  </button>
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
            <p>Booking: {selectedBookingForFeedback?.bookingId}</p>
            
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

      {/* Delete confirmation modal */}
      {showDeleteConfirmation && bookingToConfirmDelete && (
        <div className="delete-confirmation-modal">
          <div className="delete-confirmation-modal__content">
            <div className="warning-icon">
              <FaExclamationTriangle />
            </div>
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete booking #{bookingToConfirmDelete.bookingId}?</p>
            <p className="warning-text">This action cannot be undone.</p>
            
            <div className="booking-summary">
              <div className="summary-item">
                <span className="label">Date:</span>
                <span className="value">{formatDate(bookingToConfirmDelete.bookingDate)}</span>
              </div>
              <div className="summary-item">
                <span className="label">Time:</span>
                <span className="value">{formatTime(bookingToConfirmDelete.bookingTime)}</span>
              </div>
              <div className="summary-item">
                <span className="label">Therapist:</span>
                <span className="value">{bookingToConfirmDelete.therapistName}</span>
              </div>
            </div>
            
            <div className="confirmation-actions">
              <button 
                className="cancel-button"
                onClick={cancelDelete}
              >
                Cancel
              </button>
              <button 
                className="confirm-button"
                onClick={() => handleDeleteBooking(bookingToConfirmDelete.bookingId)}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingListCompleted;
