import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaCheck, FaUserMd, FaCalendarAlt, FaTags, FaTicketAlt, FaMoneyBillWave, FaCommentAlt } from 'react-icons/fa';
import useBookingHook from "@/auth/hook/useBookingHook";
import Link from 'next/link';

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
    // If the voucher is already selected, deselect it
    if (selectedVoucher && selectedVoucher.voucherId === voucher.voucherId) {
      onVoucherSelect(null);
    } else {
      onVoucherSelect(voucher);
    }
  };

  // Function to handle the next button click (submit booking)
  const handleConfirmBooking = () => {
    console.log("Submitting booking...");
    onNext(); // Call the submit function passed from parent
  };

  return (
    <div className="booking-service-form">
      <div className="booking-confirmation">
        <h2 className="booking-confirmation__title">Confirm Your Booking</h2>
        <p className="booking-confirmation__subtitle">Please review your booking details before confirming</p>
        
        {/* Booking Summary */}
        <div className="booking-summary">
          <h3 className="booking-summary__title">Booking Summary</h3>
          
          {/* Therapist Info */}
          <div className="booking-summary__item">
            <div className="booking-summary__label">
              <FaUserMd className="icon" /> Therapist
            </div>
            <div className="booking-summary__value">
              {selectedTherapist ? (
                <div className="therapist-info">
                  <span>{selectedTherapist.fullName || selectedTherapist.name}</span>
                </div>
              ) : (
                "No therapist selected"
              )}
            </div>
          </div>
          
          {/* Date & Time */}
          <div className="booking-summary__item">
            <div className="booking-summary__label">
              <FaCalendarAlt className="icon" /> Date & Time
            </div>
            <div className="booking-summary__value">
              {selectedDate ? (
                <span>
                  {new Date(selectedDate).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              ) : (
                "Date not selected"
              )}
              {selectedTime && (
                <span className="time-slot">at {selectedTime}</span>
              )}
            </div>
          </div>
          
          {/* Services */}
          <div className="booking-summary__item">
            <div className="booking-summary__label">
              <FaTags className="icon" /> Services
            </div>
            <div className="booking-summary__value">
              {selectedServices && selectedServices.length > 0 ? (
                <div className="service-list">
                  {selectedServices.map((service) => (
                    <div key={service.id} className="service-item">
                      <span className="service-name">{service.name}</span>
                      <span className="service-price">
                        {formatPrice(service.price)}
                      </span>
                    </div>
                  ))}
                  <div className="service-subtotal">
                    <span>Subtotal:</span>
                    <span className="subtotal-amount">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                </div>
              ) : (
                "No services selected"
              )}
            </div>
          </div>
          
          {/* Voucher Selection */}
          {vouchers && vouchers.length > 0 && (
            <div className="booking-summary__item">
              <div className="booking-summary__label">
                <FaTicketAlt className="icon" /> Voucher
              </div>
              <div className="booking-summary__value">
                <div className="voucher-list">
                  {vouchers.map(voucher => (
                    <div 
                      key={voucher.voucherId} 
                      className={`voucher-item ${selectedVoucher && selectedVoucher.voucherId === voucher.voucherId ? 'selected' : ''}`}
                      onClick={() => handleVoucherSelect(voucher)}
                    >
                      <div className="voucher-radio">
                        <div className={`radio-circle ${selectedVoucher && selectedVoucher.voucherId === voucher.voucherId ? 'checked' : ''}`}>
                          {selectedVoucher && selectedVoucher.voucherId === voucher.voucherId && (
                            <div className="radio-dot"></div>
                          )}
                        </div>
                      </div>
                      <div className="voucher-details">
                        <div className="voucher-name">{voucher.voucherName}</div>
                        <div className="voucher-discount">{voucher.percentDiscount}% off</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {selectedVoucher && (
                  <div className="discount-row">
                    <span>Discount:</span>
                    <span className="discount-amount">
                      - {formatPrice(discountAmount)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Total Amount */}
          <div className="booking-summary__item total">
            <div className="booking-summary__label">
              <FaMoneyBillWave className="icon" /> Total
            </div>
            <div className="booking-summary__value total-amount">
              {formatPrice(totalPrice - discountAmount)}
            </div>
          </div>
          
          {/* Customer Notes */}
          <div className="booking-summary__item">
            <div className="booking-summary__label">
              <FaCommentAlt className="icon" /> Notes
            </div>
            <div className="booking-summary__value">
              <textarea
                className="customer-notes"
                placeholder="Any special requests or notes for your treatment?"
                value={customerNotes}
                onChange={(e) => onCustomerNotesChange(e.target.value)}
                rows={3}
              />
            </div>
          </div>
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
        <div className="booking-actions__right">
          <button 
            className="booking-actions__confirm" 
            onClick={handleConfirmBooking} 
            disabled={isPending}
          >
            {isPending ? (
              <>
                <div className="spinner-small"></div> Processing...
              </>
            ) : (
              <>
                Confirm Booking <FaCheck className="icon" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmBooking; 