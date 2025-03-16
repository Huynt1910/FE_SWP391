import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { showToast } from "@/utils/toast";
import { FaArrowLeft, FaArrowRight, FaCheck, FaCreditCard, FaMoneyBill } from "react-icons/fa";
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
  }, [therapistId]);

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
        console.error("Error fetching available slots:", err);
        setError("Failed to load available slots");
        
        // Check if the error is due to expired session
        if (err.message && (
            err.message.includes("expired") || 
            err.message.includes("unauthorized") || 
            err.message.includes("401")
          )) {
          showToast("error", "Your session has expired. Please log in again.");
          // Optionally redirect to login page
          // setTimeout(() => router.push("/login"), 2000);
        } else {
          showToast("error", "Failed to load available slots");
        }
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
        console.error("Error fetching therapist schedule:", err);
        setError("Failed to load therapist schedule");
        
        // Check if the error is due to expired session
        if (err.message && (
            err.message.includes("expired") || 
            err.message.includes("unauthorized") || 
            err.message.includes("401")
          )) {
          showToast("error", "Your session has expired. Please log in again.");
          // Optionally redirect to login page
          // setTimeout(() => router.push("/login"), 2000);
        } else {
          showToast("error", "Failed to load therapist schedule");
        }
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
  const handleSelectTherapist = (therapist) => {
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

  // Generate sample time slots for testing if no real data is available
  const generateSampleTimeSlots = () => {
    if (availableTimes && availableTimes.length > 0) {
      return availableTimes;
    }
    
    // Generate sample time slots from 9 AM to 5 PM
    const sampleSlots = [];
    for (let hour = 9; hour <= 17; hour++) {
      const displayHour = hour > 12 ? hour - 12 : hour;
      const amPm = hour >= 12 ? 'PM' : 'AM';
      sampleSlots.push({
        id: `slot-${hour}`,
        displayTime: `${displayHour}:00 ${amPm}`,
        startTime: `${hour}:00:00`
      });
    }
    return sampleSlots;
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