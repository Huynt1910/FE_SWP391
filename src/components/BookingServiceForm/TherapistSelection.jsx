import React from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import Link from 'next/link';

const TherapistSelection = ({ therapists, selectedTherapist, onSelectTherapist, onNext, onPrev }) => {
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
                <img 
                  src={therapist.image || '/images/default-therapist.jpg'} 
                  alt="Therapist" 
                  className="choose-therapist__card-image" 
                />
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
            <p>No therapists available at the moment.</p>
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