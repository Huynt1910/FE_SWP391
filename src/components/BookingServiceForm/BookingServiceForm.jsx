import { useState } from "react";
import router from "next/router";
import { showToast } from "@/utils/toast"; // Adjust path as needed

// Sample data (replace with API calls in a real app)
const servicePackages = [
  { id: 1, name: "Basic Massage", duration: "30 mins", price: 50 },
  { id: 2, name: "Deep Tissue", duration: "60 mins", price: 80 },
  { id: 3, name: "Aromatherapy", duration: "90 mins", price: 120 },
];

const therapists = [
  { id: 1, name: "Dr. Alice Smith" },
  { id: 2, name: "Dr. Bob Johnson" },
  { id: 3, name: "Dr. Clara Lee" },
];

const availableTimes = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
];

export const BookingServiceForm = () => {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [isPending, setIsPending] = useState(false);

  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg);
    setSelectedTime(""); // Reset time when package changes
    setSelectedTherapist(null); // Reset therapist when package changes
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleTherapistSelect = (therapist) => {
    setSelectedTherapist(therapist);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPackage || !selectedTime || !selectedTherapist) {
      showToast.error("Please select a package, time, and therapist");
      return;
    }

    setIsPending(true);
    try {
      // Simulate API call to book appointment
      setTimeout(() => {
        showToast.success(
          `Appointment booked: ${selectedPackage.name} with ${selectedTherapist.name} at ${selectedTime}`
        );
        setIsPending(false);
        // Redirect to confirmation page or reset form
        router.push("/booking-confirmation");
      }, 1000);
    } catch (error) {
      showToast.error("Error booking appointment");
      setIsPending(false);
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

              {/* Step 1: Select Package */}
              <div className="booking-section">
                <h4>Choose a Service Package</h4>
                <div className="options-grid">
                  {servicePackages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className={`option-card ${
                        selectedPackage?.id === pkg.id ? "selected" : ""
                      }`}
                      onClick={() => handlePackageSelect(pkg)}
                    >
                      <h5>{pkg.name}</h5>
                      <p>
                        {pkg.duration} - ${pkg.price}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 2: Select Time */}
              {selectedPackage && (
                <div className="booking-section">
                  <h4>Select a Time</h4>
                  <div className="options-grid">
                    {availableTimes.map((time) => (
                      <div
                        key={time}
                        className={`option-card ${
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

              {/* Step 3: Select Therapist */}
              {selectedTime && (
                <div className="booking-section">
                  <h4>Choose Your Therapist</h4>
                  <div className="options-grid">
                    {therapists.map((therapist) => (
                      <div
                        key={therapist.id}
                        className={`option-card ${
                          selectedTherapist?.id === therapist.id
                            ? "selected"
                            : ""
                        }`}
                        onClick={() => handleTherapistSelect(therapist)}
                      >
                        <p>{therapist.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                className="btn"
                type="submit"
                disabled={
                  isPending ||
                  !selectedPackage ||
                  !selectedTime ||
                  !selectedTherapist
                }
              >
                {isPending ? "Booking..." : "Confirm Booking"}
              </button>

              <div className="booking-service-form__bottom">
                <a onClick={() => router.push("/home")}>Back to Home</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingServiceForm;
