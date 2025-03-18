import React, { useEffect, useState } from 'react';
import { Layout } from "@/layout/Layout";
import { useRouter } from 'next/router';
import { FaCalendarCheck, FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';
import { PublicLayout } from '@/layout/PublicLayout';

const BookingConfirmationPage = () => {
  const router = useRouter();
  const { success, bookingId } = router.query;
  const [bookingDetails, setBookingDetails] = useState(null);

  useEffect(() => {
    // Get booking details from localStorage if available
    try {
      const storedBookingDetails = localStorage.getItem('lastBookingDetails');
      if (storedBookingDetails) {
        setBookingDetails(JSON.parse(storedBookingDetails));
      }
    } catch (error) {
      console.error('Error retrieving booking details:', error);
    }
  }, []);

  if (!success) {
    return (
      <PublicLayout>
        <div className="container">
          <div className="error-section">
            <h1>No booking information found</h1>
            <p>Please try booking again or contact customer support.</p>
            <Link href="/booking" className="back-button">
              <FaArrowLeft className="icon" /> Back to Booking
            </Link>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="container">
        <div className="confirmation-section">
          <div className="confirmation-icon">
            <FaCalendarCheck />
          </div>
          <h1>Booking Confirmed!</h1>
          <p className="success-message">Your appointment has been successfully booked.</p>
          
          {bookingDetails && (
            <div className="booking-details">
              <h2>Booking Details</h2>
              <div className="details-item">
                <span className="label">Therapist:</span>
                <span className="value">{bookingDetails.therapistName}</span>
              </div>
              
              <div className="details-item">
                <span className="label">Services:</span>
                <span className="value">{bookingDetails.serviceNames}</span>
              </div>
              
              <div className="details-item">
                <span className="label">Date & Time:</span>
                <span className="value">{bookingDetails.appointmentDateTime}</span>
              </div>
              
              {bookingDetails.voucherName && (
                <div className="details-item">
                  <span className="label">Voucher Applied:</span>
                  <span className="value">{bookingDetails.voucherName} ({bookingDetails.voucherDiscount}% off)</span>
                </div>
              )}
            </div>
          )}
          
          <div className="actions">
            <Link href="/" className="home-button">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 60px 20px;
        }
        
        .confirmation-section {
          background-color: white;
          border-radius: 10px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
          padding: 40px;
          text-align: center;
        }
        
        .confirmation-icon {
          font-size: 60px;
          color: #4CAF50;
          margin-bottom: 20px;
        }
        
        h1 {
          font-size: 32px;
          margin-bottom: 16px;
          color: #333;
        }
        
        .success-message {
          font-size: 18px;
          color: #666;
          margin-bottom: 30px;
        }
        
        .booking-details {
          background-color: #f9f9f9;
          border-radius: 8px;
          padding: 25px;
          text-align: left;
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
        
        .details-item:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }
        
        .label {
          font-weight: 600;
          color: #666;
          width: 150px;
        }
        
        .value {
          flex: 1;
          color: #333;
        }
        
        .actions {
          margin-top: 30px;
        }
        
        .home-button {
          display: inline-block;
          background-color: #ff5a5f;
          color: white;
          padding: 12px 25px;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        
        .home-button:hover {
          background-color: #e6484d;
        }
        
        .error-section {
          text-align: center;
          padding: 50px 20px;
        }
        
        .back-button {
          display: inline-flex;
          align-items: center;
          background-color: #f0f0f0;
          color: #333;
          padding: 10px 20px;
          border-radius: 6px;
          text-decoration: none;
          margin-top: 20px;
        }
        
        .icon {
          margin-right: 8px;
        }
        
        @media (max-width: 768px) {
          .container {
            padding: 40px 20px;
          }
          
          .confirmation-section {
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
      `}</style>
    </PublicLayout>
  );
};

export default BookingConfirmationPage; 