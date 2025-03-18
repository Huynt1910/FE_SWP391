import React from 'react';
import { FaArrowLeft, FaCheck, FaCreditCard, FaMoneyBill } from 'react-icons/fa';

const PaymentConfirmation = ({ 
  selectedTherapist, 
  selectedServices,
  selectedDate, 
  selectedTime,
  selectedPaymentMethod,
  customerNotes,
  onCustomerNotesChange,
  onPaymentMethodSelect,
  onPrev,
  onNext,
  isPending,
  paymentMethods
}) => {
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'No date selected';
    return new Date(dateString).toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Calculate total price of selected services
  const calculateTotalPrice = () => {
    if (!selectedServices || selectedServices.length === 0) return 0;
    return selectedServices.reduce((total, service) => total + (service.price || 0), 0);
  };

  // Get service duration
  const getServiceDuration = () => {
    if (!selectedServices || selectedServices.length === 0) return "N/A";
    // If only one service, return its duration
    if (selectedServices.length === 1) {
      return selectedServices[0].duration || "30 mins";
    }
    // If multiple services, return combined duration or estimated duration
    return "Multiple services";
  };

  // Format price to display as VND currency
  const formatPrice = (price) => {
    // The price is already in VND
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="payment-confirmation">
      <h2 className="payment-confirmation__title">Payment & Confirmation</h2>
      
      <div className="payment-confirmation__summary">
        <h3>Booking Summary</h3>
        <div className="summary-item">
          <span>Service:</span>
          <span>
            {selectedServices && selectedServices.length > 0 
              ? selectedServices.map(service => service.name).join(", ")
              : "No service selected"}
          </span>
        </div>
        <div className="summary-item">
          <span>Duration:</span>
          <span>{getServiceDuration()}</span>
        </div>
        <div className="summary-item">
          <span>Therapist:</span>
          <span>{selectedTherapist ? (selectedTherapist.fullName || selectedTherapist.name) : 'No therapist selected'}</span>
        </div>
        <div className="summary-item">
          <span>Date:</span>
          <span>{formatDate(selectedDate)}</span>
        </div>
        <div className="summary-item">
          <span>Time:</span>
          <span>{selectedTime || 'No time selected'}</span>
        </div>
        <div className="summary-item">
          <span>Price:</span>
          <span>{formatPrice(calculateTotalPrice())}</span>
        </div>
      </div>
      
      <div className="payment-confirmation__methods">
        <h3>Select Payment Method</h3>
        <div className="payment-methods">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`payment-method ${
                selectedPaymentMethod?.id === method.id ? "selected" : ""
              }`}
              onClick={() => onPaymentMethodSelect(method)}
            >
              <div className="payment-icon">{method.icon}</div>
              <span>{method.name}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="payment-confirmation__notes">
        <h3>Additional Notes</h3>
        <textarea
          placeholder="Any special requests or information for your therapist?"
          value={customerNotes}
          onChange={(e) => onCustomerNotesChange(e.target.value)}
          rows={3}
        ></textarea>
      </div>
      
      <div className="payment-confirmation__policies">
        <h3>Booking Policies</h3>
        <ul>
          <li>Please arrive 15 minutes before your appointment time.</li>
          <li>Cancellations must be made at least 24 hours in advance for a full refund.</li>
          <li>Late arrivals may result in shortened service time.</li>
        </ul>
      </div>
      
      {/* Actions */}
      <div className="booking-actions">
        <button 
          className="booking-actions__prev" 
          onClick={onPrev}
        >
          <FaArrowLeft className="icon" /> BACK
        </button>
        <button 
          className="booking-actions__confirm" 
          onClick={onNext}
          disabled={!selectedPaymentMethod || isPending}
        >
          {isPending ? "Processing..." : "CONFIRM BOOKING"} {!isPending && <FaCheck className="icon" />}
        </button>
      </div>
    </div>
  );
};

export default PaymentConfirmation; 