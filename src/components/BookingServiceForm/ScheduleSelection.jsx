import React, { useState } from 'react';
import { FaArrowLeft, FaArrowRight, FaCalendarAlt, FaClock, FaExclamationTriangle } from 'react-icons/fa';

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

  // Get therapist name from different possible properties
  const getTherapistName = () => {
    if (!selectedTherapist) return 'None';
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
  const handleTimeSelect = (time) => {
    try {
      onTimeSelect(time);
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

  // Handle login redirect
  const handleLogin = () => {
    window.location.href = '/login';
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      const options = { weekday: 'short', month: 'short', day: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  return (
    <div className="schedule-selection">
      <h2 className="schedule-selection__title">Select Date & Time</h2>
      
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
      </div>
      
      <div className="schedule-selection__dates">
        <h3><FaCalendarAlt className="icon" /> Available Dates</h3>
        <div className="date-grid">
          {availableDates && availableDates.length > 0 ? (
            availableDates.map((dateObj) => (
              <div
                key={dateObj.date}
                className={`date-card ${selectedDate === dateObj.date ? 'selected' : ''}`}
                onClick={() => handleDateSelect(dateObj.date)}
              >
                <div className="day">{formatDate(dateObj.date)}</div>
              </div>
            ))
          ) : (
            <p>No available dates</p>
          )}
        </div>
      </div>
      
      {selectedDate && (
        <div className="schedule-selection__times">
          <h3><FaClock className="icon" /> Available Times</h3>
          {availableTimes && availableTimes.length > 0 ? (
            <div className="time-grid">
              {availableTimes.map((timeSlot) => (
                <div
                  key={timeSlot.time}
                  className={`time-card ${selectedTime === timeSlot.time ? 'selected' : ''}`}
                  onClick={() => handleTimeSelect(timeSlot.time)}
                >
                  <div className="time">{timeSlot.time}</div>
                </div>
              ))}
            </div>
          ) : (
            <p>No available times for this date</p>
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