import React, { useState } from 'react';
import { FaArrowLeft, FaArrowRight, FaCalendarAlt, FaClock, FaExclamationTriangle } from 'react-icons/fa';

const ScheduleSelection = ({ 
  selectedTherapist, 
  selectedDate, 
  selectedTime,
  onSelectDate,
  onSelectTime,
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
      onSelectDate(date);
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
      onSelectTime(time);
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
                key={dateObj.value}
                className={`date-card ${selectedDate === dateObj.value ? 'selected' : ''}`}
                onClick={() => handleDateSelect(dateObj.value)}
              >
                <div className="day">{dateObj.date.split(',')[0]}</div>
                <div className="date">{dateObj.date.split(',')[1]}</div>
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
                  key={timeSlot.id}
                  className={`time-card ${selectedTime?.id === timeSlot.id ? 'selected' : ''}`}
                  onClick={() => handleTimeSelect(timeSlot)}
                >
                  <div className="time">{timeSlot.displayTime}</div>
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