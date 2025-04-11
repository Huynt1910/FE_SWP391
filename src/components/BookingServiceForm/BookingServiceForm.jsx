import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FaArrowLeft, FaArrowRight, FaCheck, FaCreditCard, FaMoneyBill, FaLock } from "react-icons/fa";
import useBookingHook from "@/auth/hook/useBookingHook";
import useListAllServices from "@/auth/hook/useListAllServices";
import TherapistSelection from "./TherapistSelection";
import ScheduleSelection from "./ScheduleSelection";
import ConfirmBooking from "./ConfirmBooking";
import ServiceSelection from "./ServiceSelection";
import { showToast } from "@/utils/toast";
import { isAuthenticated } from "@/utils/auth";
import { getCookie } from "cookies-next";

// // Payment methods
// const paymentMethods = [
//   { id: 1, name: "Credit Card", icon: <FaCreditCard /> },
//   { id: 2, name: "Cash", icon: <FaMoneyBill /> },
// ];

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
  const totalSteps = 4; // 4 steps: Service, Therapist, Schedule, Confirm

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
      try {
        setLoading(true);
        
        // Generate dates for the next 7 days
        const dates = [];
        const today = new Date();
        const todayString = today.toISOString().split('T')[0]; // Get today's date as YYYY-MM-DD
        
        for (let i = 0; i <= 7; i++) { // Changed to include today (i = 0)
          const date = new Date(today);
          date.setDate(today.getDate() + i);
          
          dates.push({
            date: date.toISOString().split('T')[0],
            available: true,
            shifts: [1],
            therapistName: selectedTherapist ? 
              (selectedTherapist.fullName || selectedTherapist.name || "Therapist") : 
              "Available Therapist"
          });
        }
        
        console.log(`Generated ${dates.length} available dates${selectedTherapist ? ` for therapist ${selectedTherapist.id}` : ''}`);
        setAvailableDates(dates);
        
        // Auto-select today's date when a therapist is selected
        if (selectedTherapist) {
          console.log(`Auto-selecting today's date: ${todayString}`);
          setSelectedDate(todayString);
          
          // Clear any previously selected time
          setSelectedTime("");
          setSelectedSlot(null);
          
          // Immediately trigger fetch of available time slots for today
          if (selectedServices.length > 0) {
            console.log(`Auto-fetching available time slots for today (${todayString})`);
            const serviceIds = selectedServices.map(service => service.id);
            await getAvailableSlots(selectedTherapist.id, serviceIds, todayString);
          }
        } else if (!selectedDate) {
          // If no therapist is selected and no date is selected yet, pre-select today
          setSelectedDate(todayString);
          
          // Clear any previously selected time
          setSelectedTime("");
          setSelectedSlot(null);
        }
        
      } catch (err) {
        console.error("Error setting up available dates:", err);
        setError(err.message || "Failed to set up available dates");
        setAvailableDates([]);
      } finally {
        setLoading(false);
      }
    };
    
    // Call fetchAvailableDates regardless of therapist selection
    fetchAvailableDates();
  }, [selectedTherapist]);

  // Fetch available slots when therapist and date are selected
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (selectedDate) { // Remove therapist check to allow fetching slots without therapist
        try {
          setLoading(true);
          const serviceIds = selectedServices.map(service => service.id);
          const therapistId = selectedTherapist ? selectedTherapist.id : null;
          const slots = await getAvailableSlots(therapistId, serviceIds, selectedDate);
          
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
    
    if (selectedDate) { // Remove therapist check here too
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
            <h3>Login Required</h3>
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
        // Allow proceeding with either a selected therapist or null (spa choice)
        canProceed = true; // Always allow proceeding since null is a valid choice
        if (!selectedTherapist && therapists.length === 0) {
          showToast("No therapists available. Please try again later.", "error");
          canProceed = false;
        }
        break;
      case 3: // Schedule selection
        canProceed = selectedDate && selectedTime && selectedSlot;
        if (!canProceed) {
          showToast("Please select a date and time", "error");
        }
        break;
      case 4: // Confirmation
        canProceed = true; // No specific validation needed for confirmation
        break;
      default:
        canProceed = true;
    }
    
    if (canProceed) {
      setCurrentStep(currentStep + 1);
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
              {step === 4 && 'Confirm'}
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
          <ConfirmBooking
            selectedTherapist={selectedTherapist}
            selectedServices={selectedServices}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            selectedVoucher={selectedVoucher}
            onVoucherSelect={handleVoucherSelect}
            customerNotes={customerNotes}
            onCustomerNotesChange={setCustomerNotes}
            onNext={handleSubmitBooking}
            onPrev={handlePrevStep}
            isPending={isPending}
          />
        );
      case 5: // After confirmation, automatically redirect to confirmation page
        // If booking details are set in state, use them
        if (bookingDetails) {
          // Redirect to confirmation page if not already there
          if (router.pathname !== "/booking/confirmation") {
            router.push("/booking/confirmation");
          }
          
          return (
            <div className="redirect-container">
              <div className="spinner"></div>
              <p>Redirecting to booking confirmation...</p>
            </div>
          );
        } else {
          // Try to redirect if details are in localStorage
          const storedDetails = localStorage.getItem('bookingDetails');
          if (storedDetails) {
            if (router.pathname !== "/booking/confirmation") {
              router.push("/booking/confirmation");
            }
            
            return (
              <div className="redirect-container">
                <div className="spinner"></div>
                <p>Redirecting to booking confirmation...</p>
              </div>
            );
          }
          
          // If no details found, show error and option to start over
          return (
            <div className="error-container">
              <h3>Booking Information Missing</h3>
              <p>We couldn't find your booking information. Please try again.</p>
              <button 
                className="btn-primary" 
                onClick={() => setCurrentStep(1)}
              >
                Start New Booking
              </button>
            </div>
          );
        }
      default:
        return <div>Unknown step</div>;
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    if (isPending) {
      console.log("Submission already in progress, please wait...");
      return;
    }
    
    // Prevent double submission
    setIsPending(true);
    
    try {
      console.log("Starting booking submission process");
      
      // First, check if user is authenticated
      if (!isAuthenticated) {
        console.log("User not authenticated, redirecting to login");
        handleLogin();
        setIsPending(false);
        return;
      }
      
      // Get userId for booking
      let userId = null;
      try {
        const userInfo = JSON.parse(localStorage.getItem('user'));
        if (userInfo && userInfo.id) {
          userId = Number(userInfo.id);
          console.log("Retrieved user ID from localStorage:", userId);
        }
      } catch (err) {
        console.error("Error retrieving user info:", err);
      }
      
      // If userId is still null, try to get it from context or cookie
      if (!userId) {
        userId = Number(getCookie('userId') || 0);
        console.log("Retrieved user ID from cookie:", userId);
      }
      
      // Check userId validity
      if (!userId || userId === 0) {
        console.log("User ID not found, redirecting to login");
        handleLogin();
        setIsPending(false);
        return;
      }
      
      console.log("Final userId before sending to API:", userId, typeof userId);
      
      // Process voucher data if selected
      let voucherId = null;
      if (selectedVoucher) {
        console.log("Selected voucher before submission:", selectedVoucher);
        voucherId = Number(selectedVoucher.voucherId);
        console.log("Voucher ID to be used:", voucherId, typeof voucherId);
      }
      
      // Build booking data based on API requirements
      const bookingData = {
        userId: userId,
        slotId: Number(selectedSlot),
        bookingDate: selectedDate,
        serviceId: selectedServices.map(service => service.id),
        therapistId: selectedTherapist ? Number(selectedTherapist.id) : null,
        voucherId: voucherId,
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
      console.log("Voucher ID type and value:", typeof bookingData.voucherId, bookingData.voucherId);
      
      // Submit booking to API
      const result = await submitBooking(bookingData);
      
      if (result) {
        // Prepare booking details for confirmation page
        const bookingDetails = {
          bookingId: result.bookingId,
          therapistName: selectedTherapist ? (selectedTherapist.fullName || selectedTherapist.name) : "To be assigned by Spa",
          bookingDate: selectedDate,
          bookingTime: selectedTime,
          servicePrices: selectedServices.map(service => ({
            name: service.name,
            price: service.price
          })),
          subtotal: selectedServices.reduce((total, service) => total + service.price, 0),
          voucherName: selectedVoucher?.voucherName,
          voucherDiscount: selectedVoucher?.percentDiscount || 0,
          discountAmount: selectedVoucher ? 
            (selectedServices.reduce((total, service) => total + service.price, 0) * selectedVoucher.percentDiscount / 100) : 0,
          totalAmount: selectedVoucher ? 
            (selectedServices.reduce((total, service) => total + service.price, 0) * (1 - selectedVoucher.percentDiscount / 100)) :
            selectedServices.reduce((total, service) => total + service.price, 0),
          customerNotes: customerNotes
        };
        
        // Store booking details in localStorage
        localStorage.setItem('bookingDetails', JSON.stringify(bookingDetails));
        
        // Show success message
        showToast("Booking successful! Your appointment has been confirmed.", "success");
        
        // Redirect to confirmation page
        router.push({
          pathname: "/booking/confirmation",
          query: { 
            success: true,
            bookingId: result.bookingId
          }
        });
      } else {
        console.error("Booking submission failed - result was falsy");
        showToast("Failed to submit booking. Please check your selections and try again.", "error");
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
      
      let errorMessage = "Failed to submit booking.";
      
      if (error.response) {
        errorMessage += ` Server error: ${error.response.status}`;
        console.error("Server response:", error.response.data);
      } else if (error.request) {
        errorMessage += " No response from server. Please check your internet connection.";
      } else {
        errorMessage += ` ${error.message || "Unknown error"}`;
      }
      
      showToast(errorMessage, "error");
    } finally {
      setIsPending(false);
    }
  };

  // Version of handleSubmit that doesn't require an event parameter
  const handleSubmitBooking = async () => {
    await handleSubmit();
  };

  return (
    <div className="booking-container">
          {renderStepIndicators()}
          {renderStep()}
    </div>
  );
};

export default BookingServiceForm;