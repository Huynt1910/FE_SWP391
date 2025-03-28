import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight, FaCalendarAlt, FaClock, FaExclamationTriangle, FaCalendarCheck } from 'react-icons/fa';

const ScheduleSelection = ({ 
  selectedTherapist, 
  selectedDate, 
  selectedTime,
  onDateSelect,
  onTimeSelect,
  onPrev,
  onNext,
  availableDates,
  availableTimes
}) => {
  const [sessionExpired, setSessionExpired] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [todayString, setTodayString] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);

  // Set today's date string on component mount
  useEffect(() => {
    const today = new Date();
    setTodayString(today.toISOString().split('T')[0]);
  }, []);
  
  // Get therapist name from different possible properties
  const getTherapistName = () => {
    if (!selectedTherapist) return 'Spa Will Choose Best Available Therapist';
    return selectedTherapist.fullName || selectedTherapist.name || 'Unnamed Therapist';
  };

  // Handle date selection with session check
  const handleDateSelect = (date) => {
    try {
      onDateSelect(date);
      // Clear any previous errors
      setErrorMessage('');
      setSessionExpired(false);
    } catch (error) {
      console.error("Error selecting date:", error);
      // If there's an error, it might be due to expired session
      if (error.message && (
        error.message.includes("expired") || 
        error.message.includes("unauthorized") || 
        error.message.includes("401")
      )) {
        setSessionExpired(true);
      } else {
        setErrorMessage('Failed to select date. Please try again.');
      }
    }
  };

  // Handle time selection
  const handleTimeSelect = (time, slotId) => {
    try {
      onTimeSelect(time, slotId);
      // Clear any previous errors
      setErrorMessage('');
    } catch (error) {
      console.error("Error selecting time:", error);
      // If there's an error, it might be due to expired session
      if (error.message && (
        error.message.includes("expired") || 
        error.message.includes("unauthorized") || 
        error.message.includes("401")
      )) {
        setSessionExpired(true);
      } else {
        setErrorMessage('Failed to select time. Please try again.');
      }
    }
  };

  // Toggle calendar visibility
  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  // Handle login redirect
  const handleLogin = () => {
    window.location.href = '/login';
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      const options = { weekday: 'long', month: 'long', day: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };
  
  // Get the day of the week
  const getDayOfWeek = (dateString) => {
    try {
      const date = new Date(dateString);
      const options = { weekday: 'short' };
      return date.toLocaleDateString('en-US', options);
    } catch (error) {
      return '';
    }
  };
  
  // Get the day number
  const getDayNumber = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.getDate();
    } catch (error) {
      return '';
    }
  };
  
  // Get month name
  const getMonthName = (dateString) => {
    try {
      const date = new Date(dateString);
      const options = { month: 'short' };
      return date.toLocaleDateString('en-US', options);
    } catch (error) {
      return '';
    }
  };

  // Check if a date is today
  const isToday = (dateString) => {
    return dateString === todayString;
  };

  return (
    <div className="schedule-selection">
      <h2 className="schedule-selection__title">Select Time for Your Appointment</h2>
      
      {/* Session expired overlay */}
      {sessionExpired && (
        <div className="schedule-selection__overlay">
          <div className="schedule-selection__error">
            <FaExclamationTriangle className="icon" />
            <p>Your session has expired. Please log in again to continue booking.</p>
            <button className="login-button" onClick={handleLogin}>
              Log In
            </button>
          </div>
        </div>
      )}
      
      {errorMessage && (
        <div className="schedule-selection__error">
          <FaExclamationTriangle className="icon" />
          <p>{errorMessage}</p>
        </div>
      )}
      
      <div className="schedule-selection__therapist">
        <h3>Selected Therapist: {getTherapistName()}</h3>
        {!selectedTherapist && (
          <p className="schedule-selection__note">
            Don't worry! We'll assign the best available therapist for your selected time slot.
          </p>
        )}
      </div>

      {selectedDate && (
        <div className="schedule-selection__selected-date">
          <div className="selected-date-info">
            <FaCalendarCheck className="icon" />
            <span>
              {isToday(selectedDate) ? 'Today' : formatDate(selectedDate)}
              {isToday(selectedDate) && ` (${formatDate(selectedDate)})`}
            </span>
          </div>
          <button 
            className="change-date-btn"
            onClick={toggleCalendar}
          >
            Change Date
          </button>
        </div>
      )}
      
      {(showCalendar || !selectedDate) && (
        <div className="schedule-selection__dates">
          <h3><FaCalendarAlt className="icon" /> Available Dates</h3>
          <div className="date-grid">
            {availableDates && availableDates.length > 0 ? (
              availableDates.map((dateObj) => (
                <div
                  key={dateObj.date}
                  className={`date-card ${selectedDate === dateObj.date ? 'selected' : ''} ${isToday(dateObj.date) ? 'today' : ''}`}
                  onClick={() => handleDateSelect(dateObj.date)}
                >
                  <div className="date-weekday">{getDayOfWeek(dateObj.date)}</div>
                  <div className="date-number">{getDayNumber(dateObj.date)}</div>
                  <div className="date-month">{getMonthName(dateObj.date)}</div>
                  {isToday(dateObj.date) && <div className="date-today-indicator">Today</div>}
                </div>
              ))
            ) : (
              <div className="no-dates-message">
                <p>No available dates found</p>
                <p className="select-another">Please try again later</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {selectedDate && (
        <div className="schedule-selection__times">
          <h3><FaClock className="icon" /> Available Times</h3>
          {availableTimes && availableTimes.length > 0 ? (
            <div className="time-grid">
              {availableTimes.map((timeSlot) => (
                <div
                  key={timeSlot.time || timeSlot.id}
                  className={`time-card ${selectedTime === timeSlot.time ? 'selected' : ''}`}
                  onClick={() => handleTimeSelect(timeSlot.time, timeSlot.id)}
                >
                  <div className="time">
                    {timeSlot.time ? 
                      // Format time to display in a readable format (e.g., "11:00:00" to "11:00 AM")
                      new Date(`2000-01-01T${timeSlot.time}`).toLocaleTimeString([], {
                        hour: '2-digit', 
                        minute: '2-digit',
                        hour12: true
                      }) 
                      : 'Unknown Time'
                    }
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-slots-message">
              <p>No available time slots for this date</p>
              <p className="select-another">Please select another date or therapist</p>
            </div>
          )}
        </div>
      )}
      
      {/* Actions */}
      <div className="booking-actions">
        <button 
          className="booking-actions__prev" 
          onClick={onPrev}
        >
          <FaArrowLeft className="icon" /> BACK
        </button>
        <button 
          className="booking-actions__next" 
          onClick={onNext}
          disabled={!selectedDate || !selectedTime || sessionExpired}
        >
          NEXT <FaArrowRight className="icon" />
        </button>
      </div>
    </div>
  );
};

export default ScheduleSelection; 