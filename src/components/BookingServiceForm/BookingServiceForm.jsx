import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { showToast } from "@/utils/toast";
import { FaArrowLeft, FaArrowRight, FaCheck, FaCreditCard, FaMoneyBill, FaLock } from "react-icons/fa";
import useBookingHook from "@/auth/hook/useBookingHook";
import useListAllServices from "@/auth/hook/useListAllServices";
import TherapistSelection from "./TherapistSelection";
import ScheduleSelection from "./ScheduleSelection";
import PaymentConfirmation from "./PaymentConfirmation";
import ServiceSelection from "./ServiceSelection";

// Payment methods
const paymentMethods = [
  { id: 1, name: "Credit Card", icon: <FaCreditCard /> },
  { id: 2, name: "Cash", icon: <FaMoneyBill /> },
];

export const BookingServiceForm = () => {
  // Initialize router and hooks
  const router = useRouter();
  const { therapistId, step } = router.query;
  const { loading: bookingLoading, error: bookingError, data: therapistsData, authRequired, getActiveTherapists } = useBookingHook();
  const { loading: servicesLoading, error: servicesError, data: services, getAllServices } = useListAllServices();
  
  // Step tracking - initialize from URL query parameter if available
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4; // 4 steps: Service, Therapist, Schedule, Payment/Confirm

  // Form state
  const [selectedServices, setSelectedServices] = useState([]);
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

  // Set initial step based on URL parameter if available
  useEffect(() => {
    if (router.isReady) {
      if (step && !isNaN(Number(step))) {
        setCurrentStep(Number(step));
      }
    }
  }, [router.isReady, step]);

  // Check localStorage for pre-selected service on component mount
  useEffect(() => {
    if (router.isReady) {
      try {
        const storedService = localStorage.getItem('selectedService');
        if (storedService) {
          const service = JSON.parse(storedService);
          setSelectedServices([service]);
          
          // If the step has been set to 2+ (from direct booking), fetch therapists for this service
          if (currentStep >= 2 && service.id) {
            getActiveTherapists([service.id]);
          }
          
          // Clear localStorage to prevent it from being used again on page refresh
          localStorage.removeItem('selectedService');
        }
      } catch (error) {
        console.error("Error parsing stored service:", error);
      }
    }
  }, [router.isReady, currentStep]);

  // Fetch services on component mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        await getAllServices();
      } catch (err) {
        console.error("Error fetching services:", err);
        setError(err.message || "Failed to fetch services");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Fetch active therapists on service selection change
  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        if (selectedServices.length > 0) {
          setLoading(true);
          const serviceIds = selectedServices.map(service => service.id);
          const data = await getActiveTherapists(serviceIds);
          
          // Check if authentication is required
          if (authRequired) {
            console.log("Authentication required for booking");
            return;
          }
          
          // Format therapist data
          if (data && data.length > 0) {
            console.log("Fetched therapists:", data);
            setTherapists(data);
            
            // If a therapist ID was provided in the URL, pre-select it
            if (therapistId) {
              const preselectedTherapist = data.find(
                (therapist) => therapist.id.toString() === therapistId.toString()
              );
              if (preselectedTherapist) {
                setSelectedTherapist(preselectedTherapist);
              }
            }
          } else {
            console.log("No therapists found");
            setTherapists([]);
          }
        }
      } catch (err) {
        console.error("Error fetching therapists:", err);
        setError(err.message || "Failed to fetch therapists");
      } finally {
        setLoading(false);
      }
    };

    if (currentStep >= 2 && selectedServices.length > 0) {
      fetchTherapists();
    }
  }, [selectedServices, currentStep]);

  const handleLogin = () => {
    // Save current state to local storage or context
    const bookingState = {
      selectedServices,
      selectedTherapist,
      selectedDate,
      selectedTime,
      currentStep
    };
    localStorage.setItem("bookingState", JSON.stringify(bookingState));
    
    // Redirect to login
    router.push("/login?redirect=/booking");
  };

  const renderAuthRequired = () => {
    return (
      <div className="auth-required">
        <div className="auth-required__content">
          <div className="auth-required__icon">
            <FaLock size={30} />
          </div>
          <h2>Authentication Required</h2>
          <p>
            Please log in to book an appointment with our therapists.
          </p>
          <div className="auth-required__actions">
            <button 
              className="btn-primary"
              onClick={handleLogin}
            >
              Log In to Continue
            </button>
            <button 
              className="btn-secondary"
              onClick={() => router.push("/")}
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleSelectService = (service) => {
    // Check if service is already selected
    const isSelected = selectedServices.some(s => s.id === service.id);
    
    if (isSelected) {
      // Remove service from selection
      setSelectedServices(prev => prev.filter(s => s.id !== service.id));
    } else {
      // Add service to selection
      setSelectedServices(prev => [...prev, service]);
    }
  };

  const handleSelectTherapist = (therapist) => {
    setSelectedTherapist(therapist);
    // When therapist is selected, generate available dates and times
    getAvailableDates();
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    // Generate time slots for the selected date
    const slots = generateSampleTimeSlots();
    setAvailableTimes(slots);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
  };

  const getAvailableDates = () => {
    // In a real application, this would fetch available dates from the API
    // based on the selected therapist's availability
    
    // For now, generate sample dates (next 14 days)
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Skip weekends (0 = Sunday, 6 = Saturday)
      const dayOfWeek = date.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        dates.push({
          date: date.toISOString().split('T')[0],
          available: Math.random() > 0.3, // Randomly mark some dates as unavailable
        });
      }
    }
    
    setAvailableSlots(dates);
    return dates;
  };

  const generateSampleTimeSlots = () => {
    // Generate sample time slots for the selected date
    const slots = [];
    const startHour = 9; // 9 AM
    const endHour = 17; // 5 PM
    
    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minutes of ['00', '30']) {
        slots.push({
          time: `${hour}:${minutes}`,
          available: Math.random() > 0.3, // Randomly mark some slots as unavailable
        });
      }
    }
    
    return slots;
  };

  const handleNextStep = () => {
    let canProceed = false;
    
    // Validation logic for each step
    switch (currentStep) {
      case 1: // Service selection
        canProceed = selectedServices.length > 0;
        if (!canProceed) {
          showToast("Please select at least one service", "error");
        }
        break;
      case 2: // Therapist selection
        canProceed = selectedTherapist !== null;
        if (!canProceed) {
          showToast("Please select a therapist", "error");
        }
        break;
      case 3: // Schedule selection
        canProceed = selectedDate && selectedTime;
        if (!canProceed) {
          showToast("Please select a date and time", "error");
        }
        break;
      case 4: // Payment and confirmation
        canProceed = paymentMethod !== null;
        if (!canProceed) {
          showToast("Please select a payment method", "error");
        }
        break;
      default:
        canProceed = true;
    }
    
    if (canProceed) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepIndicators = () => {
    return (
      <div className="step-indicators">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div 
            key={step} 
            className={`step-indicator ${currentStep >= step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}
          >
            <div className="step-indicator__number">
              {currentStep > step ? <FaCheck className="check-icon" /> : step}
            </div>
            <div className="step-indicator__label">
              {step === 1 && 'Select Services'}
              {step === 2 && 'Choose Therapist'}
              {step === 3 && 'Schedule'}
              {step === 4 && 'Payment'}
            </div>
            {step < totalSteps && (
              <div className="step-indicator__connector">
                <div className={`connector-line ${currentStep > step ? 'completed' : ''}`}></div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderStep = () => {
    // If authentication is required, show login prompt
    if (authRequired) {
      return renderAuthRequired();
    }
    
    switch (currentStep) {
      case 1:
        return (
          <ServiceSelection
            services={services}
            selectedServices={selectedServices}
            onSelectService={handleSelectService}
            onNext={handleNextStep}
            loading={servicesLoading}
            error={servicesError}
          />
        );
      case 2:
        return (
          <TherapistSelection
            therapists={therapists}
            selectedTherapist={selectedTherapist}
            onSelectTherapist={handleSelectTherapist}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
            loading={bookingLoading}
            error={bookingError}
          />
        );
      case 3:
        return (
          <ScheduleSelection
            selectedTherapist={selectedTherapist}
            availableDates={availableSlots}
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            availableTimes={availableTimes}
            selectedTime={selectedTime}
            onTimeSelect={handleTimeSelect}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
          />
        );
      case 4:
        return (
          <PaymentConfirmation
            selectedTherapist={selectedTherapist}
            selectedServices={selectedServices}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            paymentMethods={paymentMethods}
            selectedPaymentMethod={paymentMethod}
            onPaymentMethodSelect={handlePaymentMethodSelect}
            customerNotes={customerNotes}
            onCustomerNotesChange={setCustomerNotes}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
            isPending={isPending}
          />
        );
      default:
        return <div>Unknown step</div>;
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    try {
      setIsPending(true);
      
      // Calculate total price
      const totalPrice = selectedServices.reduce((total, service) => total + (service.price || 0), 0);
      
      // Build booking details object
      const bookingData = {
        therapistId: selectedTherapist.id,
        serviceIds: selectedServices.map(service => service.id),
        date: selectedDate,
        time: selectedTime,
        paymentMethod: paymentMethod.id,
        customerNotes,
        totalPrice
      };
      
      console.log("Submitting booking:", bookingData);
      
      // In a real application, this would send the booking data to the API
      // For now, simulate a successful booking
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Set booking details for confirmation
      setBookingDetails({
        ...bookingData,
        appointmentDateTime: `${selectedDate} ${selectedTime}`,
        therapistName: selectedTherapist.fullName || selectedTherapist.name,
        serviceNames: selectedServices.map(service => service.name).join(", "),
        bookingId: `BK-${Math.floor(Math.random() * 1000000)}`
      });
      
      // Show success message
      showToast("Booking successful! Your appointment has been confirmed.", "success");
      
      // Redirect to confirmation page
      router.push({
        pathname: "/booking/confirmation",
        query: { bookingId: bookingDetails.bookingId }
      });
      
    } catch (error) {
      console.error("Error submitting booking:", error);
      showToast("Failed to submit booking. Please try again.", "error");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="booking-container">
      {renderStepIndicators()}
      {renderStep()}
    </div>
  );
};

export default BookingServiceForm;