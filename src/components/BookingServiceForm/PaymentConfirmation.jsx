import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight, FaCheck, FaCreditCard, FaMoneyBill, FaTag } from 'react-icons/fa';
import useBookingHook from "@/auth/hook/useBookingHook";

const PaymentConfirmation = ({ 
  selectedTherapist, 
  selectedServices,
  selectedDate, 
  selectedTime,
  paymentMethods,
  selectedPaymentMethod,
  onPaymentMethodSelect,
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
    <div className="payment-confirmation">
      <h2 className="payment-confirmation__title">Review and Payment</h2>
      
      <div className="payment-confirmation__details">
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
              <span>Subtotal:</span>
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
        
        <div className="payment-methods">
          <h3>Payment Method</h3>
          <div className="payment-methods__list">
            {paymentMethods.map(method => (
              <div
                key={method.id}
                className={`payment-method ${selectedPaymentMethod?.id === method.id ? 'selected' : ''}`}
                onClick={() => onPaymentMethodSelect(method)}
              >
                <div className="payment-method__icon">
                  {method.icon}
                </div>
                <div className="payment-method__name">{method.name}</div>
                {selectedPaymentMethod?.id === method.id && (
                  <div className="payment-method__selected">
                    <FaCheck />
                  </div>
                )}
              </div>
            ))}
          </div>
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
        
        <div className="payment-summary">
          <div className="payment-summary__item">
            <span className="label">Subtotal:</span>
            <span className="value">{formatPrice(totalPrice)}</span>
          </div>
          
          {selectedVoucher && (
            <div className="payment-summary__item discount">
              <span className="label">Discount ({selectedVoucher.percentDiscount}%):</span>
              <span className="value">-{formatPrice(discountAmount)}</span>
            </div>
          )}
          
          <div className="payment-summary__item total">
            <span className="label">Total:</span>
            <span className="value">{formatPrice(totalPrice - discountAmount)}</span>
          </div>
        </div>
      </div>
      
      <div className="booking-actions">
        <button 
          className="booking-actions__prev" 
          onClick={onPrev}
          disabled={isPending}
        >
          <FaArrowLeft className="icon" /> BACK
        </button>
        <button 
          className="booking-actions__confirm" 
          onClick={onNext}
          disabled={isPending || !selectedPaymentMethod}
        >
          {isPending ? 'Processing...' : 'CONFIRM BOOKING'} <FaArrowRight className="icon" />
        </button>
      </div>
      
      <div className="booking-note">
        <p>Note: By confirming your booking, your appointment will be reserved. You will receive a confirmation notice when the booking is complete.</p>
      </div>
    </div>
  );
};

export default PaymentConfirmation; 