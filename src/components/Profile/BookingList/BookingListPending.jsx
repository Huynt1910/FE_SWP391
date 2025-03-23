import { useState, useEffect } from "react";
import { FaCalendarAlt, FaClock, FaUser, FaSpinner, FaExclamationCircle, FaEllipsisV, FaCheckCircle, FaStar, FaMoneyBillWave } from "react-icons/fa";
import useBookingListPendingHook from "@/auth/hook/useBookingListPendingHook";
import { isAuthenticated, getToken } from "@/utils/auth";
import { APIClient } from "@/lib/api-client";
import { ACTIONS, API_URL } from "@/lib/api-client/constant";
import { useRouter } from 'next/router';
import { showToast } from "@/utils/toast";
import { getCookie } from "cookies-next";

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
  const [completedBookings, setCompletedBookings] = useState([]);
  const [isProcessingFinish, setIsProcessingFinish] = useState(false);
  const [processingFinishId, setProcessingFinishId] = useState(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [selectedBookingForCompletion, setSelectedBookingForCompletion] = useState(null);
  const [showPaymentButton, setShowPaymentButton] = useState(false);
  const [selectedBookingForPayment, setSelectedBookingForPayment] = useState(null);

  // Check authentication on component mount
  useEffect(() => {
    const isUserAuthenticated = isAuthenticated();
    console.log("BookingListPending: User authentication status:", isUserAuthenticated);
    setIsAuthChecked(isUserAuthenticated);

    // Load submitted feedback bookings from localStorage
    try {
      const storedFeedbacks = JSON.parse(localStorage.getItem('submittedFeedbackBookings') || '[]');
      setSubmittedFeedbackBookings(storedFeedbacks);
    } catch (error) {
      console.error('Error loading submitted feedbacks:', error);
      // If there's an error reading from localStorage, reset it
      localStorage.setItem('submittedFeedbackBookings', '[]');
    }

    // Load completed bookings from localStorage on mount
    try {
      const storedCompletedBookings = JSON.parse(localStorage.getItem('completedBookings') || '[]');
      setCompletedBookings(storedCompletedBookings);
    } catch (error) {
      console.error('Error loading completed bookings:', error);
      localStorage.setItem('completedBookings', '[]');
    }
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
    // Check if feedback was already submitted
    if (submittedFeedbackBookings.includes(booking.bookingId)) {
      showToast("You have already submitted feedback for this booking", "info");
      return;
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
          refreshPendingBookings();
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

  // Handle showing completion modal
  const handleShowCompletion = (booking) => {
    // Create booking details without prices
    const bookingDetails = {
      bookingId: booking.bookingId,
      therapistName: booking.therapistName,
      bookingDate: booking.bookingDate,
      bookingTime: booking.bookingTime,
      services: booking.serviceName.map(service => ({
        name: service.serviceName
      }))
    };
    
    console.log('Booking details for completion:', bookingDetails);
    setSelectedBookingForCompletion(bookingDetails);
    setShowCompletionModal(true);
  };

  // Handle finish booking
  const handleFinishBooking = async (bookingId) => {
    // Check if booking was already completed
    if (completedBookings.includes(bookingId)) {
      showToast("This booking has already been completed", "info");
      return;
    }

    setIsProcessingFinish(true);
    setProcessingFinishId(bookingId);

    try {
      console.log('Attempting to finish booking:', bookingId);
      
      // Get auth token
      const token = getToken();
      if (!token) {
        throw new Error("Authentication required");
      }

      // Make direct API call to match Postman structure
      const finishUrl = `${API_URL}/booking/${bookingId}/finish`;
      console.log('Finish booking URL:', finishUrl);
      
      const response = await fetch(finishUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Finish booking response status:', response.status);
      
      const responseData = await response.json();
      console.log('Finish booking response:', responseData);

      if (response.ok && responseData.success) {
        // Update localStorage and state with the completed booking
        const updatedCompletedBookings = [...completedBookings, bookingId];
        localStorage.setItem('completedBookings', JSON.stringify(updatedCompletedBookings));
        setCompletedBookings(updatedCompletedBookings);
        
        // Show payment button and store booking for payment
        setSelectedBookingForPayment(selectedBookingForCompletion);
        setShowPaymentButton(true);
        
        showToast("Booking completed successfully! Please proceed to payment.", "success");
        // Refresh booking list
        refreshPendingBookings();
      } else {
        throw new Error(responseData?.message || "Failed to complete booking");
      }
    } catch (err) {
      console.error('Error finishing booking:', err);
      showToast(err.message || "Failed to complete booking. Please try again later.", "error");
      
      // If unauthorized, redirect to login
      if (err.message?.toLowerCase().includes('auth') || err.message?.toLowerCase().includes('unauthorized')) {
        router.push('/login');
      }
    } finally {
      setIsProcessingFinish(false);
      setProcessingFinishId(null);
    }
  };

  // Handle payment
  const handlePayment = async () => {
    if (selectedBookingForPayment) {
      try {
        console.log('Attempting payment for booking ID:', selectedBookingForPayment.bookingId);
        
        // Get auth token
        const token = getToken();
        if (!token) {
          throw new Error("Authentication required");
        }

        // First try with APIClient
        const response = await APIClient.invoke({
          action: ACTIONS.PAYMENT,
          pathParams: { bookingId: selectedBookingForPayment.bookingId.toString() },
          options: {
            preventRedirect: true,
            secure: true,
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        });

        console.log('Payment response:', response);
        
        // If we get a 400 error, try direct fetch as fallback
        if (response?.success === false && response?.status === 400) {
          console.log('API call failed with 400, trying direct fetch...');
          
          // Construct the direct API URL
          const directUrl = `${API_URL}/payment/${selectedBookingForPayment.bookingId}`;
          console.log('Direct payment URL:', directUrl);
          
          // Fetch directly from the API with auth token
          const directResponse = await fetch(directUrl, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (directResponse.ok) {
            const paymentUrl = await directResponse.text();
            console.log('Direct payment URL response:', paymentUrl);
            
            if (paymentUrl && paymentUrl.includes('vnpayment.vn')) {
              // Success, redirect to payment page
              window.location.href = paymentUrl;
              setShowCompletionModal(false);
              setShowPaymentButton(false);
              return;
            } else {
              throw new Error("Invalid payment URL in direct response");
            }
          } else {
            const errorText = await directResponse.text();
            throw new Error(`Direct API call failed: ${directResponse.status} - ${errorText}`);
          }
        }
        
        // Continue with normal flow for successful APIClient response
        if (typeof response === 'string' && response.includes('vnpayment.vn')) {
          window.location.href = response;
          setShowCompletionModal(false);
          setShowPaymentButton(false);
        } else if (response && response.result && typeof response.result === 'string' && response.result.includes('vnpayment.vn')) {
          window.location.href = response.result;
          setShowCompletionModal(false);
          setShowPaymentButton(false);
        } else if (response && typeof response === 'object') {
          // Look for possible URL properties
          console.log('Response properties:', Object.keys(response));
          
          for (const prop of ['url', 'redirectUrl', 'paymentUrl', 'link', 'data']) {
            if (response[prop] && typeof response[prop] === 'string' && response[prop].includes('vnpayment.vn')) {
              window.location.href = response[prop];
              setShowCompletionModal(false);
              setShowPaymentButton(false);
              return;
            }
          }
          
          // If we got here with a success response but no URL, try opening a direct URL
          if (response?.success !== false) {
            const fallbackUrl = `${API_URL}/payment/${selectedBookingForPayment.bookingId}`;
            console.log('No payment URL found, trying fallback redirect to:', fallbackUrl);
            
            // Add auth token to the fallback request
            const fallbackResponse = await fetch(fallbackUrl, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            
            if (fallbackResponse.ok) {
              const fallbackPaymentUrl = await fallbackResponse.text();
              if (fallbackPaymentUrl && fallbackPaymentUrl.includes('vnpayment.vn')) {
                window.location.href = fallbackPaymentUrl;
                setShowCompletionModal(false);
                setShowPaymentButton(false);
                return;
              }
            }
          }
          
          throw new Error(`Payment failed: ${response?.message || 'Unknown error'}`);
        } else {
          throw new Error("Invalid payment response format");
        }
      } catch (err) {
        console.error('Error getting payment URL:', err);
        showToast(err.message || "Failed to get payment URL. Please try again later.", "error");
        
        // If unauthorized, redirect to login
        if (err.message?.toLowerCase().includes('auth') || err.message?.toLowerCase().includes('unauthorized')) {
          router.push('/login');
          return;
        }
        
        // Show more information about the error
        console.log('Error details:', err);
      }
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
        <h2>Your Bookings</h2>
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
                  
                  {!completedBookings.includes(booking.bookingId) && (
                    <button
                      onClick={() => handleShowCompletion(booking)}
                      className="complete-button"
                    >
                      <FaCheckCircle className="icon" /> Complete
                    </button>
                  )}

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

      {showCompletionModal && selectedBookingForCompletion && (
        <div className="completion-modal">
          <div className="completion-modal__content">
            <div className="finish-booking-status">
              <div className="status-icon">
                <FaCheckCircle />
              </div>
              <h1>Complete Booking #{selectedBookingForCompletion.bookingId}</h1>
              <p className="status-message">
                {showPaymentButton 
                  ? "Booking completed successfully! Please proceed to payment."
                  : "Please review the booking details before completion."}
              </p>
            </div>
            
            <div className="booking-details">
              <h2>Booking Information</h2>
              
              {/* Services Section */}
              <div className="details-item services no-bottom-margin">
                <span className="label">Services:</span>
                <div className="services-list">
                  {selectedBookingForCompletion.services && selectedBookingForCompletion.services.map((service, index) => (
                    <div key={index} className="service-item">
                      <span>{service.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Booking Details Section */}
              <div className="details-item">
                <span className="label">Therapist:</span>
                <span className="value">{selectedBookingForCompletion.therapistName}</span>
              </div>
              
              <div className="details-item">
                <span className="label">Date:</span>
                <span className="value">{formatDate(selectedBookingForCompletion.bookingDate)}</span>
              </div>
              
              <div className="details-item">
                <span className="label">Time:</span>
                <span className="value">{selectedBookingForCompletion.bookingTime}</span>
              </div>
            </div>
            
            <div className="actions">
              {showPaymentButton ? (
                <>
                  <button 
                    className="cancel-button"
                    onClick={() => {
                      setShowCompletionModal(false);
                      setShowPaymentButton(false);
                    }}
                  >
                    Close
                  </button>
                  <button 
                    className="payment-button"
                    onClick={handlePayment}
                  >
                    <FaMoneyBillWave className="icon" /> Proceed to Payment
                  </button>
                </>
              ) : (
                <>
                  <button 
                    className="cancel-button"
                    onClick={() => setShowCompletionModal(false)}
                    disabled={isProcessingFinish}
                  >
                    Cancel
                  </button>
                  <button 
                    className="complete-button"
                    onClick={() => handleFinishBooking(selectedBookingForCompletion.bookingId)}
                    disabled={isProcessingFinish}
                  >
                    {isProcessingFinish ? (
                      <><FaSpinner className="spinner" /> Processing...</>
                    ) : (
                      <><FaCheckCircle className="icon" /> Complete Booking</>
                    )}
                  </button>
                </>
              )}
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

        .completion-modal {
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

        .completion-modal__content {
          background-color: white;
          border-radius: 10px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
          padding: 40px;
          width: 90%;
          max-width: 800px;
        }

        .finish-booking-status {
          text-align: center;
          margin-bottom: 40px;
          padding: 20px;
          background: #e8f5e9;
          border-radius: 8px;
        }

        .status-icon {
          font-size: 64px;
          color: #4CAF50;
          margin-bottom: 20px;
        }

        .status-message {
          font-size: 18px;
          color: #2E7D32;
          margin-top: 10px;
        }

        h1 {
          font-size: 32px;
          margin-bottom: 16px;
          color: #1B5E20;
        }

        .booking-details {
          background-color: #f9f9f9;
          border-radius: 8px;
          padding: 25px;
          margin: 30px 0;
        }

        .booking-details h2 {
          font-size: 20px;
          margin-bottom: 20px;
          color: #333;
          text-align: center;
        }

        .details-item {
          display: flex;
          margin-bottom: 15px;
          padding-bottom: 15px;
          border-bottom: 1px solid #eee;
        }

        .details-item.no-bottom-margin {
          margin-bottom: 0;
          padding-bottom: 5px;
        }

        .details-item.no-top-padding {
          padding-top: 5px;
        }

        .label {
          font-weight: 600;
          color: #666;
          width: 150px;
          display: flex;
          align-items: center;
        }

        .value {
          flex: 1;
          color: #333;
        }

        .icon {
          margin-right: 8px;
        }

        .services-list {
          flex: 1;
          width: 100%;
        }

        .service-item {
          display: flex;
          padding: 8px 0;
          margin-bottom: 0;
          border-bottom: 1px dashed #e0e0e0;
        }

        .service-item:last-of-type {
          margin-bottom: 5px;
          border-bottom: none;
        }

        .actions {
          margin-top: 30px;
          display: flex;
          justify-content: flex-end;
          gap: 15px;
        }

        .cancel-button {
          padding: 12px 24px;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          background-color: #e74c3c;
          color: white;
          transition: all 0.3s ease;
        }

        .cancel-button:hover {
          background-color: #c0392b;
        }

        .complete-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          background-color: #4CAF50;
          color: white;
          transition: all 0.3s ease;
        }

        .complete-button:hover {
          background-color: #388E3C;
        }

        .complete-button:disabled {
          background-color: #95a5a6;
          cursor: not-allowed;
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .completion-modal__content {
            padding: 30px 20px;
          }

          .details-item {
            flex-direction: column;
          }

          .label {
            width: 100%;
            margin-bottom: 5px;
          }
        }

        .payment-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          background-color: #4CAF50;
          color: white;
          transition: all 0.3s ease;
        }

        .payment-button:hover {
          background-color: #388E3C;
        }

        .payment-button .icon {
          font-size: 18px;
        }
      `}</style>
    </div>
  );
};

export default BookingListPending;