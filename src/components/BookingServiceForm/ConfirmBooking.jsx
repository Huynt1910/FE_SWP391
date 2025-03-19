import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight, FaCheck, FaTag } from 'react-icons/fa';
import useBookingHook from "@/auth/hook/useBookingHook";

const ConfirmBooking = ({
  selectedTherapist,
  selectedServices,
  selectedDate,
  selectedTime,
  selectedVoucher,
  onVoucherSelect,
  customerNotes,
  onCustomerNotesChange,
  onNext,
  onPrev,
  isPending
}) => {
  const [vouchers, setVouchers] = useState([]);
  const [loadingVouchers, setLoadingVouchers] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const { getAvailableVouchers } = useBookingHook();

  // Calculate total price
  const totalPrice = selectedServices.reduce((total, service) => total + (service.price || 0), 0);

  // Fetch available vouchers
  useEffect(() => {
    const fetchVouchers = async () => {
      setLoadingVouchers(true);
      try {
        const availableVouchers = await getAvailableVouchers();
        setVouchers(availableVouchers || []);
      } catch (error) {
        console.error("Error fetching vouchers:", error);
      } finally {
        setLoadingVouchers(false);
      }
    };

    fetchVouchers();
  }, []);

  // Calculate discount when voucher changes
  useEffect(() => {
    if (selectedVoucher) {
      const discount = (totalPrice * selectedVoucher.percentDiscount) / 100;
      setDiscountAmount(discount);
    } else {
      setDiscountAmount(0);
    }
  }, [selectedVoucher, totalPrice]);

  // Format price as VND
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(price).replace('₫', ' ₫');
  };

  // Handle voucher selection
  const handleVoucherSelect = (voucher) => {
    if (selectedVoucher && selectedVoucher.voucherCode === voucher.voucherCode) {
      onVoucherSelect(null); // Deselect if already selected
    } else {
      onVoucherSelect(voucher);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="booking-confirmation">
      <h2 className="booking-confirmation__title">Review and Confirm Booking</h2>

      <div className="booking-confirmation__details">
        <div className="booking-summary">
          <h3>Booking Summary</h3>

          <div className="booking-summary__content">
            <div className="booking-summary__item">
              <span className="label">Therapist:</span>
              <span className="value">{selectedTherapist?.fullName || selectedTherapist?.name}</span>
            </div>

            <div className="booking-summary__item">
              <span className="label">Services:</span>
              <div className="value services-list">
                {selectedServices.map(service => (
                  <div key={service.id} className="service-item">
                    <span className="service-name">{service.name}</span>
                    <span className="service-price">{formatPrice(service.price || 0)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="booking-summary__item">
              <span className="label">Date:</span>
              <span className="value">{formatDate(selectedDate)}</span>
            </div>

            <div className="booking-summary__item">
              <span className="label">Time:</span>
              <span className="value">{selectedTime}</span>
            </div>

            <div className="booking-summary__total">
              <span>Total Amount:</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
          </div>
        </div>

        {/* Voucher Selection */}
        <div className="voucher-selection">
          <h3><FaTag className="icon" /> Available Vouchers</h3>

          {loadingVouchers ? (
            <p>Loading vouchers...</p>
          ) : vouchers.length > 0 ? (
            <div className="vouchers-list">
              {vouchers.map(voucher => (
                <div
                  key={voucher.voucherCode}
                  className={`voucher-card ${selectedVoucher?.voucherCode === voucher.voucherCode ? 'selected' : ''}`}
                  onClick={() => handleVoucherSelect(voucher)}
                >
                  <div className="voucher-info">
                    <h4 className="voucher-name">{voucher.voucherName}</h4>
                    <p className="voucher-discount">{voucher.percentDiscount}% OFF</p>
                    <p className="voucher-code">Code: {voucher.voucherCode}</p>
                    <p className="voucher-expiry">Expires: {formatDate(voucher.expiryDate)}</p>
                  </div>
                  {selectedVoucher?.voucherCode === voucher.voucherCode && (
                    <div className="voucher-selected-mark">
                      <FaCheck />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>No vouchers available at this time.</p>
          )}
        </div>

        <div className="customer-notes">
          <h3>Additional Notes</h3>
          <textarea
            className="customer-notes__input"
            placeholder="Any special requests or information for your booking?"
            value={customerNotes}
            onChange={(e) => onCustomerNotesChange(e.target.value)}
          />
        </div>

        {selectedVoucher && (
          <div className="final-price-summary">
            <div className="price-item">
              <span>Original Price:</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="price-item discount">
              <span>Discount ({selectedVoucher.percentDiscount}%):</span>
              <span>-{formatPrice(discountAmount)}</span>
            </div>
            <div className="price-item total">
              <span>Final Price:</span>
              <span>{formatPrice(totalPrice - discountAmount)}</span>
            </div>
          </div>
        )}
      </div>

      <div className="booking-actions">
        <button
          className="booking-actions__prev"
          onClick={onPrev}
          disabled={isPending}
        >
          <FaArrowLeft className="icon" /> Back
        </button>
        <button
          className="booking-actions__confirm"
          onClick={onNext}
          disabled={isPending}
        >
          {isPending ? 'Processing...' : 'Confirm Booking'} <FaArrowRight className="icon" />
        </button>
      </div>

      <div className="booking-note">
        <p>Note: By confirming your booking, your appointment will be reserved. You will receive a confirmation notice when the booking is complete.</p>
      </div>

      <style jsx>{`
        .booking-confirmation {
          padding: 20px;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }
        
        .booking-confirmation__title {
          font-size: 1.8rem;
          margin-bottom: 20px;
          color: #333;
          text-align: center;
        }
        
        .booking-confirmation__price-banner {
          background: linear-gradient(to right, #4CAF50, #2196F3);
          color: white;
          padding: 15px 20px;
          border-radius: 8px;
          margin-bottom: 20px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .price-banner__content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .price-banner__services {
          font-size: 1rem;
          opacity: 0.9;
        }
        
        .price-banner__total {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }
        
        .price-value {
          font-size: 1.5rem;
          font-weight: 700;
        }
        
        .price-label {
          font-size: 0.9rem;
          opacity: 0.8;
        }
        
        .price-banner__discount {
          font-size: 0.85rem;
          background-color: rgba(255, 255, 255, 0.2);
          padding: 3px 8px;
          border-radius: 20px;
          margin-top: 5px;
        }
        
        .booking-confirmation__details {
          display: grid;
          grid-gap: 20px;
        }
        
        .booking-summary, .voucher-selection, .customer-notes, .payment-summary {
          background-color: #f9f9f9;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .booking-summary h3, .voucher-selection h3, .customer-notes h3 {
          font-size: 1.4rem;
          margin-bottom: 15px;
          color: #333;
          display: flex;
          align-items: center;
        }
        
        .icon {
          margin-right: 8px;
        }
        
        .booking-summary__item {
          margin-bottom: 12px;
          font-size: 1rem;
        }
        
        .booking-summary__item .label {
          font-weight: 600;
          min-width: 100px;
          display: inline-block;
          color: #555;
        }
        
        .services-list {
          margin-top: 5px;
        }
        
        .service-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
          padding: 5px;
          border-bottom: 1px dashed #eee;
        }
        
        .service-price {
          font-weight: 500;
          color: #333;
        }
        
        .booking-summary__total {
          margin-top: 15px;
          padding-top: 10px;
          border-top: 1px solid #ddd;
          display: flex;
          justify-content: space-between;
          font-weight: 600;
          font-size: 1.1rem;
        }
        
        .vouchers-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          grid-gap: 15px;
        }
        
        .voucher-card {
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          padding: 15px;
          position: relative;
          cursor: pointer;
          transition: all 0.2s;
          background-color: #fff;
        }
        
        .voucher-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        
        .voucher-card.selected {
          border-color: #4CAF50;
          background-color: #f1f8e9;
        }
        
        .voucher-name {
          font-size: 1.1rem;
          margin-bottom: 8px;
          color: #333;
        }
        
        .voucher-discount {
          font-size: 1.2rem;
          font-weight: 600;
          color: #e53935;
          margin-bottom: 5px;
        }
        
        .voucher-code, .voucher-expiry {
          font-size: 0.9rem;
          color: #666;
          margin-bottom: 3px;
        }
        
        .voucher-selected-mark {
          position: absolute;
          top: 10px;
          right: 10px;
          background-color: #4CAF50;
          color: white;
          border-radius: 50%;
          width: 25px;
          height: 25px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .customer-notes__input {
          width: 100%;
          min-height: 100px;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          resize: vertical;
          font-family: inherit;
        }
        
        .customer-notes__input:focus {
          outline: none;
          border-color: #2196F3;
        }
        
        .payment-summary {
          padding: 20px;
          background-color: #f5f5f5;
          border-radius: 8px;
        }
        
        .payment-summary__item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        
        .payment-summary__item.total {
          font-size: 1.3rem;
          font-weight: 600;
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid #ddd;
        }
        
        .payment-summary__item.discount {
          color: #4CAF50;
        }
        
        .booking-actions {
          display: flex;
          justify-content: space-between;
          margin-top: 30px;
        }
        
        .booking-actions__prev,
        .booking-actions__confirm {
          display: flex;
          align-items: center;
          padding: 12px 24px;
          border: none;
          border-radius: 4px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .booking-actions__prev {
          background-color: #f5f5f5;
          color: #333;
        }
        
        .booking-actions__prev:hover {
          background-color: #e0e0e0;
        }
        
        .booking-actions__confirm {
          background-color: #4CAF50;
          color: white;
        }
        
        .booking-actions__confirm:hover {
          background-color: #388E3C;
        }
        
        .booking-actions__confirm:disabled {
          background-color: #B0BEC5;
          cursor: not-allowed;
        }
        
        .booking-actions__prev:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .booking-note {
          margin-top: 20px;
          padding: 10px;
          background-color: #fff3e0;
          border-radius: 4px;
          font-size: 0.9rem;
          color: #795548;
        }
        
        @media (max-width: 768px) {
          .price-banner__content {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .price-banner__total {
            margin-top: 10px;
            align-items: flex-start;
          }
          
          .vouchers-list {
            grid-template-columns: 1fr;
          }
          
          .booking-actions {
            flex-direction: column;
            gap: 15px;
          }
          
          .booking-actions__prev,
          .booking-actions__confirm {
            width: 100%;
            justify-content: center;
          }
        }

        .final-price-summary {
          background-color: #f5f5f5;
          padding: 20px;
          border-radius: 8px;
          margin-top: 20px;
        }

        .price-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          padding: 5px 0;
        }

        .price-item.discount {
          color: #4CAF50;
          border-bottom: 1px dashed #ddd;
          padding-bottom: 10px;
        }

        .price-item.total {
          font-size: 1.2rem;
          font-weight: 600;
          margin-top: 10px;
          padding-top: 10px;
        }
      `}</style>
    </div>
  );
};

export default ConfirmBooking; 