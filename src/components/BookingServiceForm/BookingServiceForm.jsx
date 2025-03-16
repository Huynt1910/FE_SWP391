import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { showToast } from "@/utils/toast";
import { FaArrowLeft, FaArrowRight, FaCheck, FaCreditCard, FaMoneyBill } from "react-icons/fa";
import useBookingHook from "@/auth/hook/useBookingHook";

// Payment methods
const paymentMethods = [
  { id: 1, name: "Credit Card", icon: <FaCreditCard /> },
  { id: 2, name: "Cash", icon: <FaMoneyBill /> },
];

export const BookingServiceForm = () => {
  // Initialize router and booking hook
  const router = useRouter();
  const { therapistId } = router.query;
  const bookingHook = useBookingHook();
  
  // Step tracking
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3; // Reduced to 3 steps: Therapist, Schedule, Payment/Confirm

  // Form state
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [customerNotes, setCustomerNotes] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  // API data state
  const [therapists, setTherapists] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch active therapists on component mount
  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        setLoading(true);
        const data = await bookingHook.getActiveTherapists();
        setTherapists(Array.isArray(data) ? data : []);
        
        // If therapistId is provided in the URL, select that therapist
        if (therapistId && Array.isArray(data)) {
          const preSelectedTherapist = data.find(t => 
            t.id === Number(therapistId) || 
            t.id === therapistId || 
            t.id.toString() === therapistId.toString()
          );
          
          if (preSelectedTherapist) {
            setSelectedTherapist(preSelectedTherapist);
            // If a therapist is pre-selected, move to the next step
            setCurrentStep(2);
          } else {
            showToast.error("Selected therapist not found");
          }
        }
      } catch (err) {
        console.error("Error fetching therapists:", err);
        setError("Failed to load therapists");
        showToast.error("Failed to load therapists");
        setTherapists([]);
      } finally {
        setLoading(false);
      }
    };

    if (router.isReady) {
      fetchTherapists();
    }
  }, [router.isReady, therapistId]);

  // Fetch available slots when date is selected
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!selectedDate) return;

      try {
        setLoading(true);
        const data = await bookingHook.getAvailableSlots(selectedDate);
        setAvailableSlots(data);
        
        // Format time slots for display
        if (data && data.length > 0) {
          const formattedTimes = data.map(slot => {
            // Assuming slot.startTime is in format "HH:MM:SS"
            const time = new Date(`2000-01-01T${slot.startTime}`);
            return {
              id: slot.id,
              displayTime: time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
              startTime: slot.startTime
            };
          });
          setAvailableTimes(formattedTimes);
        } else {
          setAvailableTimes([]);
        }
        
        setSelectedTime(""); // Reset time when date changes
      } catch (err) {
        setError("Failed to load available slots");
        showToast.error("Failed to load available slots");
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableSlots();
  }, [selectedDate]);

  // Fetch therapist schedule when therapist and date are selected
  useEffect(() => {
    const fetchTherapistSchedule = async () => {
      if (!selectedTherapist || !selectedDate) return;

      try {
        setLoading(true);
        const data = await bookingHook.getTherapistSchedule(selectedDate);
        // Filter available slots based on therapist schedule
        const filteredSlots = availableSlots.filter(slot => 
          data.some(schedule => schedule.slotId === slot.id)
        );
        setAvailableSlots(filteredSlots);
      } catch (err) {
        setError("Failed to load therapist schedule");
        showToast.error("Failed to load therapist schedule");
      } finally {
        setLoading(false);
      }
    };

    fetchTherapistSchedule();
  }, [selectedTherapist, selectedDate]);

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
  const handleTimeSelect = (timeSlot) => {
    setSelectedTime(timeSlot);
  };

  // Handle payment method selection
  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
  };

  // Navigate to next step
  const nextStep = () => {
    if (currentStep < totalSteps) {
      // Validate current step before proceeding
      if (currentStep === 1 && !selectedTherapist) {
        showToast.error("Please select a therapist");
        return;
      }
      if (currentStep === 2 && (!selectedDate || !selectedTime)) {
        showToast.error("Please select both date and time");
        return;
      }

      setCurrentStep(currentStep + 1);

      // If moving to final step, prepare booking details
      if (currentStep === 2) {
        // Generate a random booking ID
        const bookingId = `BK${Date.now().toString().slice(-6)}`;
        
        setBookingDetails({
          bookingId,
          therapist: selectedTherapist,
          date: selectedDate,
          time: selectedTime,
          paymentMethod: paymentMethod || paymentMethods[0], // Default to first payment method if none selected
          notes: customerNotes,
          totalPrice: 50, // Fixed price
          serviceName: "Skin Care Consultation"
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
    
    if (!bookingDetails) {
      showToast.error("Booking details not found");
      return;
    }

    // Validate payment method
    if (!paymentMethod) {
      showToast.error("Please select a payment method");
      return;
    }

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
      { number: 1, label: "Therapist" },
      { number: 2, label: "Schedule" },
      { number: 3, label: "Payment & Confirm" }
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

  // Render therapist selection step
  const renderTherapistSelection = () => {
    return (
      <div className="booking-section">
        <h4>Choose Your Therapist</h4>
        {loading ? (
          <div className="loading-indicator">Loading therapists...</div>
        ) : Array.isArray(therapists) && therapists.length > 0 ? (
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
                  <img src={therapist.image || "/assets/img/therapists/default.jpg"} alt={therapist.name || 'Therapist'} />
                </div>
                <div className="therapist-details">
                  <h5>{therapist.fullName || therapist.name || 'Unnamed Therapist'}</h5>
                  <p className="therapist-specialization">{therapist.specialization || "Skin Care Specialist"}</p>
                  <p className="therapist-experience">{therapist.yearExperience || 0} years experience</p>
                  <div className="therapist-rating">
                    {Array(5).fill().map((_, i) => (
                      <span key={i} className={i < Math.floor(therapist.rating || 4.5) ? "star filled" : "star"}>★</span>
                    ))}
                    <span className="rating-value">{therapist.rating || 4.5}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-data">
            {error ? `Error: ${error}` : "No therapists available"}
          </div>
        )}
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
            {loading ? (
              <div className="loading-indicator">Loading available times...</div>
            ) : availableTimes.length > 0 ? (
              <div className="time-grid">
                {availableTimes.map((timeSlot) => (
                  <div
                    key={timeSlot.id}
                    className={`time-card ${
                      selectedTime?.id === timeSlot.id ? "selected" : ""
                    }`}
                    onClick={() => handleTimeSelect(timeSlot)}
                  >
                    <p>{timeSlot.displayTime}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-data">No available times for this date</div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render payment and confirmation step
  const renderPaymentAndConfirmation = () => {
    return (
      <div className="booking-section">
        <h4>Payment & Confirmation</h4>
        
        <div className="booking-summary">
          <h5>Booking Summary</h5>
          <div className="summary-item">
            <span>Service:</span>
            <span>Skin Care Consultation</span>
          </div>
          <div className="summary-item">
            <span>Duration:</span>
            <span>30 mins</span>
          </div>
          <div className="summary-item">
            <span>Therapist:</span>
            <span>{selectedTherapist ? (selectedTherapist.fullName || selectedTherapist.name) : 'No therapist selected'}</span>
          </div>
          <div className="summary-item">
            <span>Date:</span>
            <span>{selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'No date selected'}</span>
          </div>
          <div className="summary-item">
            <span>Time:</span>
            <span>{selectedTime ? selectedTime.displayTime : 'No time selected'}</span>
          </div>
          <div className="summary-item">
            <span>Price:</span>
            <span>$50.00</span>
          </div>
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
        
        <div className="confirmation-section policies">
          <h5>Booking Policies</h5>
          <ul>
            <li>Please arrive 15 minutes before your appointment time.</li>
            <li>Cancellations must be made at least 24 hours in advance for a full refund.</li>
            <li>Late arrivals may result in shortened service time.</li>
          </ul>
        </div>
      </div>
    );
  };

  // Render the current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderTherapistSelection();
      case 2:
        return renderScheduleSelection();
      case 3:
        return renderPaymentAndConfirmation();
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