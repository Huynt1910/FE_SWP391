import { useState, useEffect } from "react";
import { FaCalendarAlt, FaClock, FaUser, FaSpinner, FaExclamationCircle, FaEllipsisV } from "react-icons/fa";
import useBookingListPendingHook from "@/auth/hook/useBookingListPendingHook";
import { isAuthenticated } from "@/utils/auth";
import { APIClient } from "@/lib/api-client";
import { ACTIONS } from "@/lib/api-client/constant";

const BookingListPending = () => {
  const { loading, error, data: pendingBookings, refreshPendingBookings } = useBookingListPendingHook();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [expandedBooking, setExpandedBooking] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancellingBookingId, setCancellingBookingId] = useState(null);

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
                  
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingListPending;
