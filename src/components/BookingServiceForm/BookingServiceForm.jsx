import { useState, useEffect } from "react";
import router from "next/router";
import { showToast } from "@/utils/toast"; // Adjust path as needed
import { FaArrowLeft, FaArrowRight, FaCheck, FaCreditCard, FaMoneyBill, FaTicketAlt } from "react-icons/fa";

// Sample data (replace with API calls in a real app)
const servicePackages = [
  { 
    id: 1, 
    name: "Basic Massage", 
    duration: "30 mins", 
    price: 50,
    description: "A gentle massage to relieve mild tension and promote relaxation.",
    image: "/assets/img/services/massage-1.jpg"
  },
  { 
    id: 2, 
    name: "Deep Tissue", 
    duration: "60 mins", 
    price: 80,
    description: "Intense massage targeting deep muscle layers to relieve chronic pain.",
    image: "/assets/img/services/massage-2.jpg"
  },
  { 
    id: 3, 
    name: "Aromatherapy", 
    duration: "90 mins", 
    price: 120,
    description: "Relaxing massage with essential oils to enhance physical and mental wellbeing.",
    image: "/assets/img/services/massage-3.jpg"
  },
  { 
    id: 4, 
    name: "Hot Stone Therapy", 
    duration: "75 mins", 
    price: 100,
    description: "Heated stones placed on key points to melt away tension and stress.",
    image: "/assets/img/services/massage-4.jpg"
  },
];

const therapists = [
  { 
    id: 1, 
    name: "Dr. Alice Smith", 
    specialization: "Sports Therapy",
    experience: "8 years",
    rating: 4.8,
    image: "/assets/img/therapists/therapist-1.jpg"
  },
  { 
    id: 2, 
    name: "Dr. Bob Johnson", 
    specialization: "Rehabilitation",
    experience: "12 years",
    rating: 4.9,
    image: "/assets/img/therapists/therapist-2.jpg"
  },
  { 
    id: 3, 
    name: "Dr. Clara Lee", 
    specialization: "Aromatherapy",
    experience: "5 years",
    rating: 4.7,
    image: "/assets/img/therapists/therapist-3.jpg"
  },
  { 
    id: 4, 
    name: "Dr. David Wang", 
    specialization: "Deep Tissue",
    experience: "10 years",
    rating: 4.9,
    image: "/assets/img/therapists/therapist-4.jpg"
  },
];

// Sample vouchers
const availableVouchers = [
  { id: 1, code: "WELCOME10", discount: 10, type: "percent", description: "10% off for new customers" },
  { id: 2, code: "SAVE20", discount: 20, type: "fixed", description: "$20 off your booking" },
  { id: 3, code: "SUMMER25", discount: 25, type: "percent", description: "25% off summer special" },
];

// Payment methods
const paymentMethods = [
  { id: 1, name: "Credit Card", icon: <FaCreditCard /> },
  { id: 2, name: "Cash", icon: <FaMoneyBill /> },
];

export const BookingServiceForm = () => {
  // Step tracking
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  // Form state
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]);
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [customerNotes, setCustomerNotes] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  // Generate available dates (next 7 days)
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const formattedDate = date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
      
      dates.push({
        date: formattedDate,
        value: date.toISOString().split('T')[0]
      });
    }
    
    return dates;
  };

  // Generate time slots based on selected date
  useEffect(() => {
    if (selectedDate) {
      // In a real app, this would be an API call to get available times for the selected date and therapist
      const times = [
        "09:00 AM",
        "10:00 AM",
        "11:00 AM",
        "01:00 PM",
        "02:00 PM",
        "03:00 PM",
        "04:00 PM",
      ];
      
      // Simulate some times being unavailable
      const dayOfWeek = new Date(selectedDate).getDay();
      const availableTimes = times.filter((_, index) => {
        return (index + dayOfWeek) % 3 !== 0; // Just a simple algorithm to vary available times
      });
      
      setAvailableTimes(availableTimes);
      setSelectedTime(""); // Reset time when date changes
    }
  }, [selectedDate, selectedTherapist]);

  // Handle package selection
  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg);
    // Reset subsequent selections
    setSelectedTherapist(null);
    setSelectedDate("");
    setSelectedTime("");
    setAppliedVoucher(null);
    setVoucherCode("");
  };

  // Handle therapist selection
  const handleTherapistSelect = (therapist) => {
    setSelectedTherapist(therapist);
    // Reset subsequent selections
    setSelectedDate("");
    setSelectedTime("");
  };

  // Handle date selection
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime(""); // Reset time when date changes
  };

  // Handle time selection
  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  // Handle voucher application
  const handleApplyVoucher = () => {
    if (!voucherCode.trim()) {
      showToast.error("Please enter a voucher code");
      return;
    }

    const voucher = availableVouchers.find(
      (v) => v.code.toLowerCase() === voucherCode.toLowerCase()
    );

    if (voucher) {
      setAppliedVoucher(voucher);
      showToast.success(`Voucher ${voucher.code} applied successfully!`);
    } else {
      showToast.error("Invalid voucher code");
    }
  };

  // Handle payment method selection
  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
  };

  // Calculate total price
  const calculateTotal = () => {
    if (!selectedPackage) return 0;

    let total = selectedPackage.price;

    if (appliedVoucher) {
      if (appliedVoucher.type === "percent") {
        total = total * (1 - appliedVoucher.discount / 100);
      } else if (appliedVoucher.type === "fixed") {
        total = Math.max(0, total - appliedVoucher.discount);
      }
    }

    return total;
  };

  // Navigate to next step
  const nextStep = () => {
    if (currentStep < totalSteps) {
      // Validate current step before proceeding
      if (currentStep === 1 && !selectedPackage) {
        showToast.error("Please select a service package");
        return;
      }
      if (currentStep === 2 && !selectedTherapist) {
        showToast.error("Please select a therapist");
        return;
      }
      if (currentStep === 3 && (!selectedDate || !selectedTime)) {
        showToast.error("Please select both date and time");
        return;
      }
      if (currentStep === 4 && !paymentMethod) {
        showToast.error("Please select a payment method");
        return;
      }

      setCurrentStep(currentStep + 1);

      // If moving to final step, prepare booking details
      if (currentStep === 4) {
        setBookingDetails({
          package: selectedPackage,
          therapist: selectedTherapist,
          date: selectedDate,
          time: selectedTime,
          voucher: appliedVoucher,
          paymentMethod: paymentMethod,
          notes: customerNotes,
          totalPrice: calculateTotal(),
          bookingId: `BK${Math.floor(100000 + Math.random() * 900000)}`, // Generate random booking ID
          bookingDate: new Date().toLocaleDateString()
        });
      }
    }
  };

  // Navigate to previous step
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle final submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsPending(true);
    try {
      // Simulate API call to book appointment
      setTimeout(() => {
        showToast.success(
          `Booking confirmed! Your booking ID is ${bookingDetails.bookingId}`
        );
        setIsPending(false);
        // Redirect to confirmation page
        router.push("/booking-confirmation");
      }, 1500);
    } catch (error) {
      showToast.error("Error processing your booking");
      setIsPending(false);
    }
  };

  // Render step indicators
  const renderStepIndicators = () => {
    const steps = [
      { number: 1, label: "Package" },
      { number: 2, label: "Therapist" },
      { number: 3, label: "Schedule" },
      { number: 4, label: "Payment" },
      { number: 5, label: "Confirm" }
    ];

    return (
      <div className="booking-steps">
        {steps.map((step) => (
          <div 
            key={step.number} 
            className={`booking-step ${currentStep === step.number ? 'active' : ''} ${currentStep > step.number ? 'completed' : ''}`}
          >
            <div className="step-number">
              {currentStep > step.number ? <FaCheck /> : step.number}
            </div>
            <div className="step-label">{step.label}</div>
          </div>
        ))}
      </div>
    );
  };

  // Render package selection step
  const renderPackageSelection = () => {
    return (
      <div className="booking-section">
        <h4>Choose a Service Package</h4>
        <div className="package-grid">
          {servicePackages.map((pkg) => (
            <div
              key={pkg.id}
              className={`package-card ${
                selectedPackage?.id === pkg.id ? "selected" : ""
              }`}
              onClick={() => handlePackageSelect(pkg)}
            >
              <div className="package-image">
                <img src={pkg.image} alt={pkg.name} />
              </div>
              <div className="package-details">
                <h5>{pkg.name}</h5>
                <p className="package-duration">{pkg.duration}</p>
                <p className="package-price">${pkg.price}</p>
                <p className="package-description">{pkg.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render therapist selection step
  const renderTherapistSelection = () => {
    return (
      <div className="booking-section">
        <h4>Choose Your Therapist</h4>
        <div className="therapist-grid">
          {therapists.map((therapist) => (
            <div
              key={therapist.id}
              className={`therapist-card ${
                selectedTherapist?.id === therapist.id ? "selected" : ""
              }`}
              onClick={() => handleTherapistSelect(therapist)}
            >
              <div className="therapist-image">
                <img src={therapist.image} alt={therapist.name} />
              </div>
              <div className="therapist-details">
                <h5>{therapist.name}</h5>
                <p className="therapist-specialization">{therapist.specialization}</p>
                <p className="therapist-experience">{therapist.experience} experience</p>
                <div className="therapist-rating">
                  {Array(5).fill().map((_, i) => (
                    <span key={i} className={i < Math.floor(therapist.rating) ? "star filled" : "star"}>★</span>
                  ))}
                  <span className="rating-value">{therapist.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render date and time selection step
  const renderScheduleSelection = () => {
    const availableDates = getAvailableDates();
    
    return (
      <div className="booking-section">
        <h4>Select Date & Time</h4>
        
        <div className="date-selection">
          <h5>Available Dates</h5>
          <div className="date-grid">
            {availableDates.map((dateObj) => (
              <div
                key={dateObj.value}
                className={`date-card ${
                  selectedDate === dateObj.value ? "selected" : ""
                }`}
                onClick={() => handleDateSelect(dateObj.value)}
              >
                <p>{dateObj.date}</p>
              </div>
            ))}
          </div>
        </div>
        
        {selectedDate && (
          <div className="time-selection">
            <h5>Available Times</h5>
            <div className="time-grid">
              {availableTimes.map((time) => (
                <div
                  key={time}
                  className={`time-card ${
                    selectedTime === time ? "selected" : ""
                  }`}
                  onClick={() => handleTimeSelect(time)}
                >
                  <p>{time}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render payment step
  const renderPaymentStep = () => {
    return (
      <div className="booking-section">
        <h4>Payment Details</h4>
        
        <div className="booking-summary">
          <h5>Booking Summary</h5>
          <div className="summary-item">
            <span>Service:</span>
            <span>{selectedPackage.name}</span>
          </div>
          <div className="summary-item">
            <span>Duration:</span>
            <span>{selectedPackage.duration}</span>
          </div>
          <div className="summary-item">
            <span>Therapist:</span>
            <span>{selectedTherapist.name}</span>
          </div>
          <div className="summary-item">
            <span>Date:</span>
            <span>{new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <div className="summary-item">
            <span>Time:</span>
            <span>{selectedTime}</span>
          </div>
          <div className="summary-item">
            <span>Price:</span>
            <span>${selectedPackage.price}</span>
          </div>
          
          {appliedVoucher && (
            <div className="summary-item discount">
              <span>Discount:</span>
              <span>
                {appliedVoucher.type === "percent"
                  ? `-${appliedVoucher.discount}%`
                  : `-$${appliedVoucher.discount}`}
              </span>
            </div>
          )}
          
          <div className="summary-item total">
            <span>Total:</span>
            <span>${calculateTotal().toFixed(2)}</span>
          </div>
        </div>
        
        <div className="voucher-section">
          <h5>Have a Voucher?</h5>
          <div className="voucher-input">
            <input
              type="text"
              placeholder="Enter voucher code"
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value)}
              disabled={appliedVoucher !== null}
            />
            <button
              type="button"
              onClick={handleApplyVoucher}
              disabled={appliedVoucher !== null}
              className="btn-apply"
            >
              Apply
            </button>
          </div>
          
          {appliedVoucher && (
            <div className="applied-voucher">
              <FaTicketAlt />
              <span>{appliedVoucher.description}</span>
              <button
                type="button"
                onClick={() => setAppliedVoucher(null)}
                className="btn-remove"
              >
                Remove
              </button>
            </div>
          )}
        </div>
        
        <div className="payment-method-section">
          <h5>Select Payment Method</h5>
          <div className="payment-methods">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`payment-method ${
                  paymentMethod?.id === method.id ? "selected" : ""
                }`}
                onClick={() => handlePaymentMethodSelect(method)}
              >
                <div className="payment-icon">{method.icon}</div>
                <span>{method.name}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="notes-section">
          <h5>Additional Notes</h5>
          <textarea
            placeholder="Any special requests or information for your therapist?"
            value={customerNotes}
            onChange={(e) => setCustomerNotes(e.target.value)}
            rows={3}
          ></textarea>
        </div>
      </div>
    );
  };

  // Render confirmation step
  const renderConfirmationStep = () => {
    if (!bookingDetails) return null;
    
    return (
      <div className="booking-section">
        <div className="confirmation-header">
          <h4>Booking Confirmation</h4>
          <div className="booking-id">Booking ID: {bookingDetails.bookingId}</div>
        </div>
        
        <div className="confirmation-details">
          <div className="confirmation-section">
            <h5>Service Details</h5>
            <div className="confirmation-item">
              <span>Service Package:</span>
              <span>{bookingDetails.package.name}</span>
            </div>
            <div className="confirmation-item">
              <span>Duration:</span>
              <span>{bookingDetails.package.duration}</span>
            </div>
            <div className="confirmation-item">
              <span>Therapist:</span>
              <span>{bookingDetails.therapist.name}</span>
            </div>
          </div>
          
          <div className="confirmation-section">
            <h5>Appointment Details</h5>
            <div className="confirmation-item">
              <span>Date:</span>
              <span>{new Date(bookingDetails.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="confirmation-item">
              <span>Time:</span>
              <span>{bookingDetails.time}</span>
            </div>
          </div>
          
          <div className="confirmation-section">
            <h5>Payment Details</h5>
            <div className="confirmation-item">
              <span>Payment Method:</span>
              <span>{bookingDetails.paymentMethod.name}</span>
            </div>
            <div className="confirmation-item">
              <span>Original Price:</span>
              <span>${bookingDetails.package.price.toFixed(2)}</span>
            </div>
            
            {bookingDetails.voucher && (
              <div className="confirmation-item">
                <span>Discount:</span>
                <span>
                  {bookingDetails.voucher.type === "percent"
                    ? `-${bookingDetails.voucher.discount}%`
                    : `-$${bookingDetails.voucher.discount}`}
                  ({bookingDetails.voucher.code})
                </span>
              </div>
            )}
            
            <div className="confirmation-item total">
              <span>Total Amount:</span>
              <span>${bookingDetails.totalPrice.toFixed(2)}</span>
            </div>
          </div>
          
          {bookingDetails.notes && (
            <div className="confirmation-section">
              <h5>Additional Notes</h5>
              <p className="notes-text">{bookingDetails.notes}</p>
            </div>
          )}
          
          <div className="confirmation-section policies">
            <h5>Booking Policies</h5>
            <ul>
              <li>Please arrive 15 minutes before your appointment time.</li>
              <li>Cancellations must be made at least 24 hours in advance for a full refund.</li>
              <li>Late arrivals may result in shortened service time.</li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  // Render the current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderPackageSelection();
      case 2:
        return renderTherapistSelection();
      case 3:
        return renderScheduleSelection();
      case 4:
        return renderPaymentStep();
      case 5:
        return renderConfirmationStep();
      default:
        return null;
    }
  };

  return (
    <>
      <div className="booking-service">
        <div className="wrapper">
          <div
            className="booking-service-form js-img"
            style={{
              backgroundImage: `url('/assets/img/booking-form__bg.png')`,
            }}
          >
            <form onSubmit={handleSubmit}>
              <h3>Book Your Appointment</h3>
              
              {/* Step indicators */}
              {renderStepIndicators()}
              
              {/* Current step content */}
              {renderCurrentStep()}
              
              {/* Navigation buttons */}
              <div className="booking-navigation">
                {currentStep > 1 && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={prevStep}
                  >
                    <FaArrowLeft /> Back
                  </button>
                )}
                
                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={nextStep}
                  >
                    Next <FaArrowRight />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={isPending}
                  >
                    {isPending ? "Processing..." : "Confirm Booking"}
                  </button>
                )}
              </div>

              <div className="booking-service-form__bottom">
                <a onClick={() => router.push("/home")}>Cancel and return to Home</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingServiceForm;