import { useState, useEffect } from "react";
import { FaCalendarAlt, FaClock, FaUser, FaSpinner, FaExclamationCircle, FaEllipsisV, FaExclamationTriangle } from "react-icons/fa";
import useBookingListCancelledHook from "@/auth/hook/useBookingListCancelledHook";
import { isAuthenticated } from "@/utils/auth";
import { getCookie } from "cookies-next";

const BookingListCancelled = () => {
  const { 
    loading, 
    error, 
    data: cancelledBookings, 
    refreshCancelledBookings
  } = useBookingListCancelledHook();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [expandedBooking, setExpandedBooking] = useState(null);

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      const isUserAuthenticated = isAuthenticated();
      console.log("BookingListCancelled: User authentication status:", isUserAuthenticated);
      
      if (isUserAuthenticated) {
        // Also verify token validity
        const token = getCookie("token");
        if (!token) {
          console.error("Token not found despite authenticated status");
          setIsAuthChecked(false);
          return;
        }
        
        setIsAuthChecked(true);
        refreshCancelledBookings(); // Force refresh data after confirming authentication
      } else {
        setIsAuthChecked(false);
      }
    };
    
    checkAuth();
  }, []);

  // Refresh data periodically (every 60 seconds)
  useEffect(() => {
    if (isAuthChecked) {
      const interval = setInterval(() => {
        refreshCancelledBookings();
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

  // Safely get string value
  const getStringValue = (value) => {
    if (value === null || value === undefined) return "";
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  // Extract services from booking
  const getServices = (booking) => {
    if (!booking) return [];
    
    // If serviceName is an array of objects with serviceName property
    if (Array.isArray(booking.serviceName)) {
      return booking.serviceName.map(service => {
        if (typeof service === 'object' && service.serviceName) {
          return service.serviceName;
        }
        return String(service);
      });
    }
    
    // If services is available
    if (Array.isArray(booking.services)) {
      return booking.services.map(service => {
        if (typeof service === 'object') {
          return service.serviceName || service.name || 'Unnamed Service';
        }
        return String(service);
      });
    }
    
    // If only a single service name is available
    if (booking.serviceName && typeof booking.serviceName === 'string') {
      return [booking.serviceName];
    }
    
    return [];
  };

  // Check if cancelledBookings is a valid array
  const validCancelledBookings = Array.isArray(cancelledBookings) ? cancelledBookings : [];

  // Render authentication required view
  if (!isAuthChecked) {
    return (
      <div className="booking-list-pending">
        <div className="booking-list-pending__auth-error">
          <FaExclamationCircle size={24} className="auth-error-icon" />
          <h3>Authentication Required</h3>
          <p>You need to be logged in to view your cancelled bookings.</p>
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
          <p>Loading your cancelled bookings...</p>
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
          <p>{typeof error === 'object' ? JSON.stringify(error) : error}</p>
          <button 
            className="error-refresh-button"
            onClick={refreshCancelledBookings}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Render empty state
  if (!validCancelledBookings || validCancelledBookings.length === 0) {
    return (
      <div className="booking-list-pending">
        <div className="booking-list-pending__empty">
          <FaExclamationTriangle className="empty-icon" />
          <h3>No Cancelled Bookings</h3>
          <p>You don't have any cancelled bookings yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-list-pending">
      <div className="booking-list-pending__header">
        <h2>Your Cancelled Bookings</h2>
        <p>These bookings have been cancelled.</p>
      </div>

      <div className="booking-list-pending__list">
        {validCancelledBookings.map((booking) => {
          const services = getServices(booking);
          
          return (
            <div 
              key={booking.bookingId || Math.random().toString()}
              className={`booking-card ${expandedBooking === booking.bookingId ? 'expanded' : ''}`}
            >
              <div className="booking-card__header">
                <div className="booking-id">
                  <span className="label">Booking #</span>
                  <span className="value">{booking.bookingId}</span>
                </div>
                <div className="booking-status cancelled">
                  <span className="status-dot"></span>
                  <FaExclamationTriangle className="status-icon" />
                  <span>CANCELLED</span>
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
                      <span className="info-value">{booking.bookingDate ? formatDate(booking.bookingDate) : "N/A"}</span>
                    </div>
                  </div>
                  <div className="info-item">
                    <FaClock className="info-icon" />
                    <div className="info-content">
                      <span className="info-label">Time</span>
                      <span className="info-value">{booking.bookingTime ? formatTime(booking.bookingTime) : "N/A"}</span>
                    </div>
                  </div>
                  <div className="info-item">
                    <FaUser className="info-icon" />
                    <div className="info-content">
                      <span className="info-label">Therapist</span>
                      <span className="info-value">{booking.therapistName || "Unassigned"}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {expandedBooking === booking.bookingId && (
                <div className="booking-card__details">
                  <h4>Services</h4>
                  <ul className="service-list">
                    {services.length > 0 ? (
                      services.map((service, index) => (
                        <li key={index} className="service-item">
                          {service}
                        </li>
                      ))
                    ) : (
                      <li className="service-item">No service information available</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BookingListCancelled;