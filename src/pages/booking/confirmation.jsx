import React, { useEffect, useState } from 'react';
import { Layout } from "@/layout/Layout";
import { useRouter } from 'next/router';
import { FaCalendarCheck, FaArrowLeft, FaTag, FaMoneyBillWave, FaCheckCircle } from 'react-icons/fa';
import Link from 'next/link';
import { PublicLayout } from '@/layout/PublicLayout';

const BookingConfirmationPage = () => {
  const router = useRouter();
  const [bookingDetails, setBookingDetails] = useState(null);

  // Format price as VND
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(price).replace('₫', ' ₫');
  };

  useEffect(() => {
    // Get booking details from localStorage if available
    try {
      const storedBookingDetails = localStorage.getItem('bookingDetails');
      if (storedBookingDetails) {
        setBookingDetails(JSON.parse(storedBookingDetails));
      }
    } catch (error) {
      console.error('Error retrieving booking details:', error);
    }
  }, []);

  if (!bookingDetails) {
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
          <div className="finish-booking-status">
            <div className="status-icon">
              <FaCheckCircle />
            </div>
            <h1>Booking Finished!</h1>
            <p className="status-message">Your booking has been successfully completed and confirmed.</p>
          </div>
          
          <div className="booking-details">
            <h2>Booking Information</h2>
            
            {/* Services Price Section */}
            <div className="details-item services-price no-bottom-margin">
              <span className="label">Services:</span>
              <div className="services-list">
                {bookingDetails.servicePrices.map((service, index) => (
                  <div key={index} className="service-price-item">
                    <span>{service.name}</span>
                    <span className="price-value">{formatPrice(service.price)}</span>
                  </div>
                ))}
                <div className="subtotal">
                  <span>Subtotal:</span>
                  <span className="price-value">{formatPrice(bookingDetails.subtotal)}</span>
                </div>
              </div>
            </div>
            
            {bookingDetails.voucherName && (
              <div className="details-item voucher no-bottom-margin no-top-padding">
                <span className="label">
                  <FaTag className="icon" /> Voucher Applied:
                </span>
                <div className="voucher-info">
                  <span className="voucher-name">{bookingDetails.voucherName} ({bookingDetails.voucherDiscount}% off)</span>
                  <span className="discount-amount">
                    -{formatPrice(bookingDetails.discountAmount)}
                  </span>
                </div>
              </div>
            )}

            {/* Total Amount Section */}
            <div className="details-item total no-top-padding">
              <span className="label">
                <FaMoneyBillWave className="icon" /> Total Amount:
              </span>
              <span className="value total-amount">
                {formatPrice(bookingDetails.totalAmount)}
              </span>
            </div>

            {/* Booking Details Section */}
            <div className="details-item">
              <span className="label">Therapist:</span>
              <span className="value">{bookingDetails.therapistName}</span>
            </div>
            
            <div className="details-item">
              <span className="label">Date:</span>
              <span className="value">{new Date(bookingDetails.bookingDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
            
            <div className="details-item">
              <span className="label">Time:</span>
              <span className="value">{bookingDetails.bookingTime}</span>
            </div>

            {bookingDetails.customerNotes && (
              <div className="details-item">
                <span className="label">Notes:</span>
                <span className="value">{bookingDetails.customerNotes}</span>
              </div>
            )}
          </div>
          
          <div className="actions">
            <Link href="/profile" className="home-button">
              View My Bookings
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
        }

        .finish-booking-status {
          text-align: center;
          margin-bottom: 40px;
          padding: 20px;
          background: #e8f5e9;
          border-radius: 8px;
        }

        .status-icon {
          font-size: 64px;
          color: #4CAF50;
          margin-bottom: 20px;
        }

        .status-message {
          font-size: 18px;
          color: #2E7D32;
          margin-top: 10px;
        }
        
        h1 {
          font-size: 32px;
          margin-bottom: 16px;
          color: #1B5E20;
        }
        
        .booking-details {
          background-color: #f9f9f9;
          border-radius: 8px;
          padding: 25px;
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
        
        .details-item.no-bottom-margin {
          margin-bottom: 0;
          padding-bottom: 5px;
        }
        
        .details-item.no-top-padding {
          padding-top: 5px;
        }
        
        .label {
          font-weight: 600;
          color: #666;
          width: 150px;
          display: flex;
          align-items: center;
        }
        
        .value {
          flex: 1;
          color: #333;
        }

        .icon {
          margin-right: 8px;
        }
        
        .services-list {
          flex: 1;
          width: 100%;
        }

        .service-price-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          margin-bottom: 0;
          border-bottom: 1px dashed #e0e0e0;
        }

        .service-price-item:last-of-type {
          margin-bottom: 5px;
        }

        .price-value {
          font-weight: 500;
        }

        .subtotal {
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
          padding-top: 10px;
          font-weight: 600;
          border-top: 1px solid #ddd;
        }

        .voucher-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex: 1;
          padding: 4px 8px;
          background-color: #e8f5e9;
          border-radius: 4px;
        }

        .voucher-name {
          color: #2E7D32;
          font-weight: 500;
        }

        .discount-amount {
          color: #2E7D32;
          font-weight: 600;
        }

        .details-item.total {
          margin-top: 10px;
          padding: 15px;
          border-top: 2px solid #e0e0e0;
          font-size: 18px;
          background-color: #e8f5e9;
          border-radius: 4px;
        }

        .total-amount {
          font-weight: 700;
          color: #1B5E20;
          font-size: 20px;
        }
        
        .actions {
          margin-top: 30px;
          text-align: center;
        }
        
        .home-button {
          display: inline-block;
          background-color: #4CAF50;
          color: white;
          padding: 12px 25px;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        
        .home-button:hover {
          background-color: #388E3C;
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