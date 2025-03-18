import React from 'react';
import { FaArrowLeft, FaArrowRight, FaUser, FaCircle, FaExclamationTriangle } from 'react-icons/fa';
import Link from 'next/link';

const TherapistSelection = ({ therapists, selectedTherapist, onSelectTherapist, onNext, onPrev, loading, error }) => {
  // Function to render stars based on rating
  const renderStars = (rating) => {
    return (
      <div className="stars">
        <span className="star">★</span>
        <span className="star">★</span>
        <span className="star">★</span>
        <span className="star">★</span>
        <span className="star">★</span>
        <span className="rating-value">{rating || 4.5}</span>
      </div>
    );
  };

  // Render loading state
  if (loading) {
    return (
      <div className="book-appointment">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Finding therapists for your selected services...</p>
        </div>
        
        <div className="booking-actions">
          <div className="booking-actions__left">
            <button className="booking-actions__prev" onClick={onPrev}>
              <FaArrowLeft className="icon" /> BACK
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="book-appointment">
        <div className="error-container">
          <h3>Error Loading Therapists</h3>
          <p>{error}</p>
          <button className="btn-primary" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
        
        <div className="booking-actions">
          <div className="booking-actions__left">
            <button className="booking-actions__prev" onClick={onPrev}>
              <FaArrowLeft className="icon" /> BACK
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="book-appointment">
      {/* Therapist selection */}
      <div className="choose-therapist">
        <h2 className="choose-therapist__title">Choose Your Therapist</h2>
        
        <div className="choose-therapist__list">
          {therapists && therapists.length > 0 ? (
            therapists.map((therapist) => (
              <div 
                key={therapist.id} 
                className={`choose-therapist__card ${selectedTherapist?.id === therapist.id ? 'selected' : ''}`}
                onClick={() => onSelectTherapist(therapist)}
              >
                <div className="choose-therapist__card-image-container">
                  <img 
                    src={therapist.imgUrl || therapist.image || '/assets/img/therapists/default.jpg'} 
                    alt={therapist.fullName || therapist.name || 'Therapist'} 
                    className="choose-therapist__card-image"
                    onError={(e) => {
                      console.error(`Failed to load image for therapist:`, therapist.fullName, therapist.imgUrl);
                      e.target.onerror = null;
                      e.target.src = '/assets/img/therapists/default.jpg';
                    }}
                  />
                </div>
                <div className="choose-therapist__card-info">
                  <h3 className="choose-therapist__card-name">
                    {therapist.fullName || therapist.name || 'Unnamed Therapist'}
                  </h3>
                  <p className="choose-therapist__card-specialty">
                    {therapist.specialization || 'Skin Care Specialist'}
                  </p>
                  <p className="choose-therapist__card-experience">
                    {therapist.yearExperience || 5} years experience
                  </p>
                  {renderStars(therapist.rating || 4.5)}
                </div>
              </div>
            ))
          ) : (
            <div className="no-therapists-message">
              <div className="no-therapists-icon">
                <FaExclamationTriangle size={30} color="#ff9800" />
              </div>
              <h3>No Therapists Available</h3>
              <p>We couldn't find any therapists for your selected services at this time.</p>
              <p>Please try selecting different services or check back later.</p>
              <button className="btn-try-different" onClick={onPrev}>
                <FaArrowLeft className="icon" /> Select Different Services
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Actions */}
      <div className="booking-actions">
        <div className="booking-actions__left">
          <button 
            className="booking-actions__prev" 
            onClick={onPrev}
          >
            <FaArrowLeft className="icon" /> BACK
          </button>
          <Link href="/" className="booking-actions__cancel">
            Cancel and return to Home
          </Link>
        </div>
        <button 
          className="booking-actions__next" 
          onClick={onNext}
          disabled={!selectedTherapist}
        >
          NEXT <FaArrowRight className="icon" />
        </button>
      </div>
    </div>
  );
};

export default TherapistSelection; 