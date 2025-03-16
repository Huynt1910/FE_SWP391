import React, { useEffect } from 'react';
import { FaArrowLeft, FaArrowRight, FaBug, FaExclamationTriangle, FaSignInAlt } from 'react-icons/fa';
import Link from 'next/link';
import { isAuthenticated } from '@/utils/auth';

const TherapistSelection = ({ therapists, selectedTherapist, onSelectTherapist, onNext, onPrev }) => {
  // Check authentication status directly
  const authenticated = isAuthenticated();
  
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

  // Debug function to test API directly
  const testApiDirectly = async () => {
    try {
      console.log("Testing API directly...");
      console.log("Is authenticated:", authenticated);
      
      // Get authentication token from cookies or localStorage
      const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
      
      console.log("Token available:", !!token);
      
      const response = await fetch(
        "https://skincare-booking-api-3e537a79674f.herokuapp.com/api/therapists/activeTherapists",
        {
          headers: token ? {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } : {
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log("API Status:", response.status, response.statusText);
      
      if (!response.ok) {
        console.error("API Error:", response.status, response.statusText);
        return;
      }
      
      const data = await response.json();
      console.log("API Response:", data);
    } catch (error) {
      console.error("API Test Error:", error);
    }
  };

  // Run the API test on component mount
  useEffect(() => {
    testApiDirectly();
  }, []);

  // If not authenticated, show login prompt
  if (!authenticated) {
    return (
      <div className="book-appointment">
        <div className="choose-therapist">
          <h2 className="choose-therapist__title">Choose Your Therapist</h2>
          
          <div className="choose-therapist__list">
            <div className="therapist-list__empty">
              <FaExclamationTriangle size={40} color="#e57373" style={{ marginBottom: '15px' }} />
              <h3>Authentication Required</h3>
              <p>
                You need to be logged in to view available therapists and book appointments.
                Please log in to continue.
              </p>
              <div className="auth-actions">
                <Link href="/login">
                  <button className="login-button">
                    <FaSignInAlt style={{ marginRight: '8px' }} /> Log In
                  </button>
                </Link>
                <Link href="/registration">
                  <button className="signup-button">
                    Create Account
                  </button>
                </Link>
              </div>
              <div className="contact-info">
                <p>For immediate assistance, please contact us:</p>
                <p>Email: support@bambospa.com</p>
                <p>Phone: (123) 456-7890</p>
              </div>
              <button 
                className="debug-button"
                onClick={testApiDirectly}
                style={{ marginTop: '10px', backgroundColor: '#333' }}
              >
                <FaBug style={{ marginRight: '5px' }} /> Test API
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If authenticated but no therapists, show loading or error message
  if (!therapists || therapists.length === 0) {
    return (
      <div className="book-appointment">
        <div className="choose-therapist">
          <h2 className="choose-therapist__title">Choose Your Therapist</h2>
          
          <div className="choose-therapist__list">
            <div className="therapist-list__empty">
              <h3>No Therapists Available</h3>
              <p>
                We're currently experiencing high demand or technical difficulties.
                Our team is working on adding new specialists to serve you better.
              </p>
              <div className="contact-info">
                <p>For immediate assistance, please contact us:</p>
                <p>Email: support@bambospa.com</p>
                <p>Phone: (123) 456-7890</p>
              </div>
              <button 
                className="retry-button"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
              <button 
                className="debug-button"
                onClick={testApiDirectly}
                style={{ marginTop: '10px', backgroundColor: '#333' }}
              >
                <FaBug style={{ marginRight: '5px' }} /> Test API
              </button>
            </div>
          </div>
        </div>
        
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
        </div>
      </div>
    );
  }

  // Normal render with therapists
  return (
    <div className="book-appointment">
      {/* Therapist selection */}
      <div className="choose-therapist">
        <h2 className="choose-therapist__title">Choose Your Therapist</h2>
        
        <div className="choose-therapist__list">
          {therapists.map((therapist) => (
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
          ))}
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