import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { showToast } from "@/utils/toast";
import { FaArrowLeft, FaArrowRight, FaCheck, FaCreditCard, FaMoneyBill, FaLock } from "react-icons/fa";
import useBookingHook from "@/auth/hook/useBookingHook";
import TherapistSelection from "./TherapistSelection";
import ScheduleSelection from "./ScheduleSelection";
import PaymentConfirmation from "./PaymentConfirmation";

// Payment methods
const paymentMethods = [
  { id: 1, name: "Credit Card", icon: <FaCreditCard /> },
  { id: 2, name: "Cash", icon: <FaMoneyBill /> },
];

export const BookingServiceForm = () => {
  // Initialize router and booking hook
  const router = useRouter();
  const { therapistId } = router.query;
  const { loading: bookingLoading, error: bookingError, data: therapistsData, authRequired, getActiveTherapists } = useBookingHook();
  
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
        const data = await getActiveTherapists();
        
        // Check if authentication is required
        if (authRequired) {
          console.log("Authentication required for booking");
          setError("Authentication required to book appointments");
          return;
        }
        
        setTherapists(Array.isArray(data) ? data : []);
        
        // If therapistId is provided in the URL, select that therapist
        if (therapistId && Array.isArray(data)) {
          const preSelectedTherapist = data.find(t => 
            t.id === Number(therapistId) || 
            t.id === therapistId
          );
          
          if (preSelectedTherapist) {
            setSelectedTherapist(preSelectedTherapist);
            // Optionally move to next step if therapist is pre-selected
            // setCurrentStep(2);
          }
        }
      } catch (error) {
        console.error("Error fetching therapists:", error);
        setError("Failed to load therapists. Please try again later.");
        showToast("error", "Failed to load therapists");
      } finally {
        setLoading(false);
      }
    };

    fetchTherapists();
  }, [therapistId, authRequired]);

  // Handle login redirect
  const handleLogin = () => {
    // Store the current URL to redirect back after login
    localStorage.setItem('redirectAfterLogin', router.asPath);
    router.push('/login');
  };

  // Render authentication required message
  const renderAuthRequired = () => {
    return (
      <div className="booking-auth-required">
        <div className="booking-auth-required__icon">
          <FaLock size={40} />
        </div>
        <h2>Authentication Required</h2>
        <p>You need to be logged in to book an appointment.</p>
        <p>Please log in to continue with your booking.</p>
        <button 
          className="booking-auth-required__login-btn"
          onClick={handleLogin}
        >
          Log In to Book
        </button>
        <button 
          className="booking-auth-required__back-btn"
          onClick={() => router.push('/service')}
        >
          Back to Services
        </button>
      </div>
    );
  };

  // If authentication is required, show login prompt
  if (authRequired) {
    return renderAuthRequired();
  }

  // If there's an error related to authentication, show login prompt
  if (error && (
    error.includes("Authentication required") || 
    error.includes("log in") || 
    error.includes("unauthorized")
  )) {
    return renderAuthRequired();
  }

  // Handle therapist selection
  const handleSelectTherapist = (therapist) => {
    setSelectedTherapist(therapist);
    console.log("Selected therapist:", therapist);
  };

  // Handle date selection
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    console.log("Selected date:", date);
    // When a date is selected, generate available time slots
    setAvailableTimes(generateSampleTimeSlots());
  };

  // Handle time selection
  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    console.log("Selected time:", time);
  };

  // Handle payment method selection
  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
    console.log("Selected payment method:", method);
  };

  // Generate sample available dates (7 days from today)
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const options = { weekday: 'short' };
      const dayName = date.toLocaleDateString('en-US', options);
      
      const dateValue = date.toISOString().split('T')[0];
      const dateDisplay = `${date.getDate()}/${date.getMonth() + 1}`;
      
      dates.push({
        value: dateValue,
        date: `${dayName}, ${dateDisplay}`
      });
    }
    
    return dates;
  };

  // Generate sample time slots
  const generateSampleTimeSlots = () => {
    return [
      { id: 1, time: "09:00", displayTime: "9:00 AM" },
      { id: 2, time: "10:00", displayTime: "10:00 AM" },
      { id: 3, time: "11:00", displayTime: "11:00 AM" },
      { id: 4, time: "12:00", displayTime: "12:00 PM" },
      { id: 5, time: "13:00", displayTime: "1:00 PM" },
      { id: 6, time: "14:00", displayTime: "2:00 PM" },
      { id: 7, time: "15:00", displayTime: "3:00 PM" },
      { id: 8, time: "16:00", displayTime: "4:00 PM" },
      { id: 9, time: "17:00", displayTime: "5:00 PM" },
    ];
  };
  
  // Handle next step
  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      // Validate current step before proceeding
      if (currentStep === 1 && !selectedTherapist) {
        showToast("error", "Please select a therapist");
        return;
      }
      if (currentStep === 2 && (!selectedDate || !selectedTime)) {
        showToast("error", "Please select both date and time");
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

  // Handle previous step
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
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
      <div className="book-appointment__steps">
        {steps.map((step) => (
          <div 
            key={step.number} 
            className="book-appointment__step"
          >
            <div className={`book-appointment__step-number ${currentStep === step.number ? 'active' : ''}`}>
              {step.number}
            </div>
            <div className={`book-appointment__step-label ${currentStep === step.number ? 'active' : ''}`}>
              {step.label}
            </div>
          </div>
        ))}
      </div>
    );
  };


  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <TherapistSelection 
            therapists={therapists}
            selectedTherapist={selectedTherapist}
            onSelectTherapist={handleSelectTherapist}
            onNext={handleNextStep}
            onPrev={() => router.push("/")}
          />
        );
      case 2:
        return (
          <ScheduleSelection
            selectedTherapist={selectedTherapist}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onSelectDate={handleDateSelect}
            onSelectTime={handleTimeSelect}
            onPrev={handlePrevStep}
            onNext={handleNextStep}
            availableDates={getAvailableDates()}
            availableTimes={generateSampleTimeSlots()}
          />
        );
      case 3:
        return (
          <PaymentConfirmation
            selectedTherapist={selectedTherapist}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            paymentMethod={paymentMethod}
            customerNotes={customerNotes}
            setCustomerNotes={setCustomerNotes}
            onSelectPaymentMethod={handlePaymentMethodSelect}
            onPrev={handlePrevStep}
            onSubmit={handleSubmit}
            isPending={isPending}
            paymentMethods={paymentMethods}
          />
        );
      default:
        return null;
    }
  };

  // Handle final submission
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    if (!bookingDetails) {
      showToast("error", "Booking details not found");
      return;
    }

    // Validate payment method
    if (!paymentMethod) {
      showToast("error", "Please select a payment method");
      return;
    }

    setIsPending(true);
    try {
      // Simulate API call to book appointment
      setTimeout(() => {
        showToast("success", `Booking confirmed! Your booking ID is ${bookingDetails.bookingId}`);
        setIsPending(false);
        // Redirect to confirmation page
        router.push("/booking-confirmation");
      }, 1500);
    } catch (error) {
      showToast("error", "Error processing your booking");
      setIsPending(false);
    }
  };

  return (
    <div className="booking-service">
      <div className="wrapper">
        <div className="book-appointment">
          <h1 className="book-appointment__title">Book Your Appointment</h1>
          {renderStepIndicators()}
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default BookingServiceForm;