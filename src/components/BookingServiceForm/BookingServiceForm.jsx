import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FaArrowLeft, FaArrowRight, FaCheck, FaCreditCard, FaMoneyBill, FaLock } from "react-icons/fa";
import useBookingHook from "@/auth/hook/useBookingHook";
import useListAllServices from "@/auth/hook/useListAllServices";
import TherapistSelection from "./TherapistSelection";
import ScheduleSelection from "./ScheduleSelection";
import PaymentConfirmation from "./PaymentConfirmation";
import ServiceSelection from "./ServiceSelection";
import { showToast } from "@/utils/toast";
import { isAuthenticated } from "@/utils/auth";

// Payment methods
const paymentMethods = [
  { id: 1, name: "Credit Card", icon: <FaCreditCard /> },
  { id: 2, name: "Cash", icon: <FaMoneyBill /> },
];

export const BookingServiceForm = () => {
  // Initialize router and hooks
  const router = useRouter();
  const { therapistId, step } = router.query;
  const { 
    loading: bookingLoading, 
    error: bookingError, 
    data: therapistsData, 
    availableSlots,
    getActiveTherapists,
    getAvailableSlots,
    getTherapistScheduleForMonth,
    submitBooking,
    getAvailableVouchers,
    checkAuthentication
  } = useBookingHook();
  const { loading: servicesLoading, error: servicesError, data: services, getAllServices } = useListAllServices();
  
  // Authentication state
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  
  // Step tracking - initialize from URL query parameter if available
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4; // 4 steps: Service, Therapist, Schedule, Payment/Confirm

  // Form state
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [customerNotes, setCustomerNotes] = useState("");
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  // API data state
  const [therapists, setTherapists] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Initial auth check on mount
  useEffect(() => {
    const isUserAuthenticated = isAuthenticated();
    console.log("User authentication status:", isUserAuthenticated);
    setIsAuthChecked(isUserAuthenticated);
  }, []);

  // Watch for authentication status changes
  useEffect(() => {
    if (isAuthChecked) {
      // User is authenticated, fetch data if needed
      if (services?.length === 0) {
        fetchServices();
      }
      
      if (therapistsData?.length === 0 && selectedServices.length > 0) {
        fetchTherapists();
      }
      
      // Fetch vouchers when authenticated
      fetchVouchers();
    }
  }, [isAuthChecked]);
  
  // Fetch active therapists when service selection changes
  useEffect(() => {
    if (isAuthChecked && selectedServices.length > 0) {
      console.log("Service selection changed, fetching therapists for services:", 
        selectedServices.map(s => `${s.name} (ID: ${s.id})`).join(", "));
      fetchTherapists();
    }
  }, [selectedServices, isAuthChecked]);

  // Fetch available vouchers
  const fetchVouchers = async () => {
    if (!isAuthChecked) return; // Don't fetch if not authenticated
    
    try {
      console.log("Fetching available vouchers...");
      const vouchers = await getAvailableVouchers();
      console.log("Vouchers fetched:", vouchers?.length || 0);
      // Note: The vouchers will be handled by the PaymentConfirmation component
    } catch (error) {
      console.error("Error fetching vouchers:", error);
      showToast("Error loading vouchers", "error");
    }
  };

  // Fetch services
  const fetchServices = async () => {
    if (!isAuthChecked) return; // Don't fetch if not authenticated
    
    try {
      console.log("Fetching services...");
      const servicesData = await getAllServices();
      console.log("Services fetched:", servicesData?.length || 0);
    } catch (error) {
      console.error("Error fetching services:", error);
      showToast("Error loading services", "error");
    }
  };

  // Fetch therapists based on selected services
    const fetchTherapists = async () => {
    if (!isAuthChecked) return; // Don't fetch if not authenticated
    
      try {
      if (selectedServices.length > 0) {
        setLoading(true);
        const serviceIds = selectedServices.map(service => service.id);
        const data = await getActiveTherapists(serviceIds);
        
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

  // Fetch available dates when therapist is selected
  useEffect(() => {
    const fetchAvailableDates = async () => {
      if (selectedTherapist) {
        try {
          setLoading(true);
          
          // Skip using the problematic API call for now
          console.log(`Skip API call for therapist ${selectedTherapist.id}, using direct dates`);
          
          // Generate dates for the next 14 days as a workaround
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
                available: true,
                shifts: [1],
                therapistName: selectedTherapist.fullName || selectedTherapist.name || "Therapist"
              });
            }
          }
          
          console.log(`Generated ${dates.length} available dates for therapist ${selectedTherapist.id}`);
          setAvailableDates(dates);
          
          // Clear any previously selected date and time
          setSelectedDate("");
          setSelectedTime("");
          setSelectedSlot(null);
          
        } catch (err) {
          console.error("Error setting up available dates:", err);
          setError(err.message || "Failed to set up available dates");
          setAvailableDates([]);
      } finally {
        setLoading(false);
        }
      }
    };
    
    if (selectedTherapist) {
      fetchAvailableDates();
    }
  }, [selectedTherapist]);

  // Fetch available slots when therapist and date are selected
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (selectedTherapist && selectedDate) {
        try {
          setLoading(true);
          const serviceIds = selectedServices.map(service => service.id);
          const slots = await getAvailableSlots(selectedTherapist.id, serviceIds, selectedDate);
          
          if (slots && slots.length > 0) {
            console.log("Available slots:", slots);
            // Filter out deleted/invalid slots and map to UI format
            const validSlots = slots
              .filter(slot => !slot.deleted) // Only include non-deleted slots
              .map(slot => ({
                id: slot.slotid,
                time: slot.slottime,
                available: true // All non-deleted slots are available
              }));
            
            setAvailableTimeSlots(validSlots);
            
            // Reset time selection if previously selected slot is no longer available
            if (selectedTime && !validSlots.some(slot => slot.time === selectedTime)) {
              setSelectedTime("");
              setSelectedSlot(null);
            }
            
            console.log("Valid time slots:", validSlots);
          } else {
            setAvailableTimeSlots([]);
          }
        } catch (err) {
          console.error("Error fetching available slots:", err);
          setError(err.message || "Failed to fetch available time slots");
          setAvailableTimeSlots([]);
        } finally {
          setLoading(false);
        }
      }
    };
    
    if (selectedTherapist && selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedTherapist, selectedDate]);

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

  // const renderAuthRequired = () => {
  //   return (
  //     <div className="auth-required booking-service">
  //       <div className="auth-required__content">
  //         <div className="auth-required__icon">
  //           <FaLock size={50} color="#007bff" />
  //         </div>
        
  //         <div className="service-preview">
  //           <h3>Login Requireds</h3>
  //           <div className="service-preview__items">
  //             {services && services.length > 0 ? (
  //               services.slice(0, 3).map((service) => (
  //                 <div key={service.id} className="service-preview__item">
  //                   <img 
  //                     src={service.imageUrl || "https://via.placeholder.com/100"} 
  //                     alt={service.name} 
  //                     className="service-preview__image" 
  //                   />
  //                   <h4>{service.name}</h4>
  //                   <p>{service.shortDescription || service.description?.substring(0, 80) + "..."}</p>
  //                 </div>
  //               ))
  //             ) : (
  //               <p>Our services will be displayed after login.</p>
  //             )}
  //           </div>
  //         </div>
  //         <div className="auth-required__actions">
  //           <button 
  //             className="btn-primary"
  //             onClick={handleLogin}
  //           >
  //             Log In to Book Services
  //           </button>
  //           <button 
  //             className="btn-secondary"
  //             onClick={() => router.push("/registration")}
  //           >
  //             Create Account
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };
  if (!isAuthChecked) {
    return (
      <div className="service">
        <div className="wrapper">
          <div className="service-list__error">
            <div className="error-icon">
              <FaLock size={24} color="white" />
        </div>
            <h3>Login Requireds</h3>
            <p>You need to be logged in to view our services.</p>
        <button 
              className="login-button"
              onClick={() => router.push('/login')}
        >
              Log In
        </button>
          </div>
        </div>
      </div>
    );
  }

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
    // Reset date and time selection when therapist changes
    setSelectedDate("");
    setSelectedTime("");
    setSelectedSlot(null);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    // Reset time selection when date changes
    setSelectedTime("");
    setSelectedSlot(null);
  };

  const handleTimeSelect = (time, slotId) => {
    setSelectedTime(time);
    setSelectedSlot(slotId);
  };

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
  };

  const handleVoucherSelect = (voucher) => {
    setSelectedVoucher(voucher);
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
        // Auto-select a therapist if none is selected and therapists are available
        if (selectedTherapist === null && therapists && therapists.length > 0) {
          // Randomly select a therapist
          const randomIndex = Math.floor(Math.random() * therapists.length);
          const randomTherapist = therapists[randomIndex];
          
          setSelectedTherapist(randomTherapist);
          showToast(`Auto-selected random therapist: ${randomTherapist.fullName || randomTherapist.name}`, "info");
          canProceed = true;
        } else {
          canProceed = selectedTherapist !== null;
          if (!canProceed) {
            showToast("Please select a therapist", "error");
          }
        }
        break;
      case 3: // Schedule selection
        canProceed = selectedDate && selectedTime && selectedSlot;
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
    // Check authentication first
    if (!isAuthChecked) {
      return renderAuthRequired();
    }
    
    // Display loading/error states
    if (loading || bookingLoading || servicesLoading) {
      return (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading booking information...</p>
        </div>
      );
    }
    
    if (error || bookingError || servicesError) {
      return (
        <div className="error-container">
          <h3>Something went wrong</h3>
          <p>{error || bookingError || servicesError}</p>
          <button className="btn-primary" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      );
    }
    
    switch (currentStep) {
      case 1:
        return (
          <ServiceSelection
            services={services}
            selectedServices={selectedServices}
            onSelectService={handleSelectService}
            onNext={handleNextStep}
            loading={false}
            error={null}
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
            availableDates={availableDates}
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            availableTimes={availableTimeSlots}
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
            selectedVoucher={selectedVoucher}
            onVoucherSelect={handleVoucherSelect}
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
      
      // Get user ID with priority: cookies > localStorage > default
      let userId = null;
      
      // Try to get from cookies first
      const userIdCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('userId='));
      
      if (userIdCookie) {
        userId = parseInt(userIdCookie.split('=')[1], 10); // Convert to number
        console.log("Found user ID in cookies:", userId, typeof userId);
      } 
      // Then try localStorage
      else {
        // Direct userId from localStorage
        const directUserId = localStorage.getItem('userId');
        if (directUserId) {
          userId = parseInt(directUserId, 10); // Convert to number
          console.log("Found user ID directly in localStorage:", userId, typeof userId);
        } else {
          // Try from user object in localStorage
          const userString = localStorage.getItem('user');
          if (userString) {
            try {
              const user = JSON.parse(userString);
              if (user && user.id) {
                userId = parseInt(user.id, 10); // Convert to number
                console.log("Found user ID from user object in localStorage:", userId, typeof userId);
              }
            } catch (error) {
              console.error("Error parsing user from localStorage:", error);
            }
          }
        }
      }
      
      console.log("Final userId before sending to API:", userId, typeof userId);
      
      // // If still no user ID, use default with warning
      // if (!userId) {
      //   userId = 1; // Default ID
      //   console.warn("USING DEFAULT USER ID (1). This is only for development!");
      //   showToast("Using default account. For your own bookings, please log in.", "warning");
      // }
      
      // Build booking data based on API requirements
      const bookingData = {
        userId: userId ,// || 1,  Ensure a valid userId (use 1 as fallback)
        slotId: Number(selectedSlot),
        bookingDate: selectedDate,
        serviceId: selectedServices.map(service => service.id),
        therapistId: Number(selectedTherapist.id),
        voucherId: selectedVoucher ? Number(selectedVoucher.voucherId) : null,
        email: "customer@example.com" // Add a default email to ensure the booking goes through
      };
      
      // Try to get real email if possible
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.email) {
          bookingData.email = user.email;
        }
      } catch (err) {
        console.warn("Using default email for booking");
      }
      
      // Log the exact data being sent
      console.log("Submitting booking with data:", JSON.stringify(bookingData));
      console.log("User ID type:", typeof bookingData.userId);
      console.log("SlotId type:", typeof bookingData.slotId);
      console.log("TherapistId type:", typeof bookingData.therapistId);
      
      // Submit booking to API
      const result = await submitBooking(bookingData);
      
      if (result) {
        // Set booking details for display on confirmation page
        const bookingDetails = {
          ...bookingData,
          appointmentDateTime: `${selectedDate} ${selectedTime}`,
          therapistName: selectedTherapist.fullName || selectedTherapist.name,
          serviceNames: selectedServices.map(service => service.name).join(", "),
          voucherName: selectedVoucher?.voucherName || null,
          voucherDiscount: selectedVoucher?.percentDiscount || 0,
          
        };
        
        // Store booking details in localStorage for access if needed
        localStorage.setItem('lastBookingDetails', JSON.stringify(bookingDetails));
        
        // Show success message with booking confirmation
        showToast("Booking successful! Your appointment has been confirmed.", "success");
        
        // Redirect to booking confirmation page
        router.push({
          pathname: "/booking/confirmation",
          query: { 
            success: true,
            bookingId: bookingDetails.bookingId
          }
        });
      } else {
        console.error("Booking submission failed - result was falsy");
        showToast("Failed to submit booking. Please check your selections and try again.", "error");
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
      
      // Show more detailed error message to help diagnose the issue
      let errorMessage = "Failed to submit booking.";
      
      if (error.response) {
        // Server responded with an error
        errorMessage += ` Server error: ${error.response.status}`;
        console.error("Server response:", error.response.data);
      } else if (error.request) {
        // Request was made but no response received
        errorMessage += " No response from server. Please check your internet connection.";
      } else {
        // Error in setting up the request
        errorMessage += ` ${error.message || "Unknown error"}`;
      }
      
      showToast(errorMessage, "error");
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