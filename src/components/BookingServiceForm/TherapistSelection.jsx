import React from 'react';
import { FaArrowLeft, FaArrowRight, FaUser, FaCircle, FaExclamationTriangle, FaUserMd, FaCalendarAlt, FaClock } from 'react-icons/fa';
import Link from 'next/link';

const TherapistSelection = ({ therapists, selectedTherapist, onSelectTherapist, onNext, onPrev, loading, error }) => {
  // Format role for display
  const formatRole = (role) => {
    if (!role) return "";
    
    // Convert SNAKE_CASE to Title Case
    return role
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Function to render stars based on rating
  const renderStars = (rating) => {
    return (
      <div className="stars">
        {Array(5).fill().map((_, i) => (
          <span key={i} className={`star ${i < Math.floor(rating) ? 'filled' : ''}`}>★</span>
        ))}
        <span className="rating-value">{rating}</span>
      </div>
    );
  };

  // Render loading state
  if (loading) {
    return (
      <div className="booking-service-form">
        <div className="service-selection__loading">
          <div className="loading-icon"></div>
          <p>Finding available therapists for your selected services...</p>
        </div>
        
        <div className="booking-actions">
          <div className="booking-actions__left">
            <button className="booking-actions__prev" onClick={onPrev}>
              <FaArrowLeft className="icon" /> Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="booking-service-form">
        <div className="service-selection__error">
          <div className="error-icon">
            <FaExclamationTriangle className="error-x" />
          </div>
          <h3>Error Loading Therapists</h3>
          <p>{error}</p>
          <button className="booking-actions__prev" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-service-form">
      <div className="service-selection">
        <h2 className="service-selection__title">Choose Your Therapist</h2>
        <p className="service-selection__subtitle">Select from our team of experienced therapists for your treatment</p>
        
        <div className="service-selection__list">
          {therapists && therapists.length > 0 ? (
            therapists.map((therapist) => {
              // Extract therapist properties with fallbacks
              const id = therapist.id || therapist._id;
              const name = therapist.fullName || therapist.name || "Unnamed Therapist";
              const image = therapist.imgUrl || therapist.image || therapist.avatar || "/assets/img/therapists/default.jpg";
              const specialization = therapist.specialization || therapist.specialty || "Skin Care Specialist";
              const experience = therapist.yearsOfExperience || therapist.yearExperience || 5;
              // const rating = therapist.rating || 4.5;
              // const bio = therapist.bio || therapist.description || "Specialized in providing exceptional skin care treatments.";

              return (
                <div 
                  key={id}
                  className={`service-selection__card ${selectedTherapist?.id === id ? 'selected' : ''}`}
                  onClick={() => onSelectTherapist(therapist)}
                >
                  <div className="service-selection__card-image">
                    <img 
                      src={image}
                      alt={name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/assets/img/therapists/default.jpg";
                      }}
                    />
                  </div>

                  <div className="service-selection__card-content">
                    <h3 className="service-selection__card-title">{name}</h3>
                    <div className="service-selection__card-details">
                      <p className="service-selection__card-specialization">
                        <FaUserMd className="icon" /> {specialization}
                      </p>
                      <p className="service-selection__card-experience">
                        <FaClock className="icon" /> {experience} years experience
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="service-selection__empty">
              <FaExclamationTriangle size={30} />
              <h3>No Therapists Available</h3>
              <p>We couldn't find any therapists for your selected services at this time.</p>
              <button className="booking-actions__prev" onClick={onPrev}>
                <FaArrowLeft /> Select Different Services
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="booking-actions">
        <div className="booking-actions__left">
          <button className="booking-actions__prev" onClick={onPrev}>
            <FaArrowLeft className="icon" /> Back
          </button>
          <Link href="/" className="booking-actions__cancel">
            Cancel
          </Link>
        </div>
        <button 
          className="booking-actions__next" 
          onClick={onNext}
          disabled={!selectedTherapist}
        >
          Next <FaArrowRight className="icon" />
        </button>
      </div>
    </div>
  );
};

export default TherapistSelection; 