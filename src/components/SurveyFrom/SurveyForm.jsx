import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight, FaCheck, FaClipboardList, FaClock } from "react-icons/fa";
import { showToast } from "@/utils/toast"; // Adjust path as needed
import useListAllServices from "@/auth/hook/useListAllServices";
import { useRouter } from "next/router";


// Enhanced survey questions with more details
const surveyQuestions = [
  {
    id: 1,
    title: "Skincare Routine",
    text: "How would you describe your current skincare routine?",
    type: "radio",
    options: [
      { 
        id: "basic", 
        value: "Basic", 
        description: "Cleansing and occasional moisturizing",
        serviceId: 1
      },
      { 
        id: "regular", 
        value: "Regular", 
        description: "Daily cleansing, toning, and moisturizing",
        serviceId: 1
      },
      { 
        id: "advanced", 
        value: "Advanced", 
        description: "Complete routine with specialized products and treatments",
        serviceId: 1
      }
    ],
    validation: (value) => value !== "",
    name: "skincare_routine",
    icon: "🧴"
  },
  {
    id: 2,
    title: "Skin Condition",
    text: "How would you rate your current skin condition?",
    type: "radio",
    options: [
      { 
        id: "mild", 
        value: "Mild", 
        description: "Occasional breakouts, minor concerns",
        serviceId: 2
      },
      { 
        id: "moderate", 
        value: "Moderate", 
        description: "Regular breakouts, visible concerns",
        serviceId: 2
      },
      { 
        id: "severe", 
        value: "Severe", 
        description: "Persistent breakouts, significant concerns",
        serviceId: 2
      }
    ],
    validation: (value) => value !== "",
    name: "skin_condition",
    icon: "🔍"
  },
  {
    id: 3,
    title: "Skin Type",
    text: "What is your skin type?",
    type: "radio",
    options: [
      { 
        id: "dry", 
        value: "Dry", 
        description: "Feels tight, may have flaky patches",
        serviceId: 3
      },
      { 
        id: "oily", 
        value: "Oily", 
        description: "Shiny appearance, especially in T-zone",
        serviceId: 4
      },
      { 
        id: "combination", 
        value: "Combination", 
        description: "Oily in some areas, dry in others",
        serviceId: 5
      },
      { 
        id: "normal", 
        value: "Normal", 
        description: "Well-balanced, neither too oily nor too dry",
        serviceId: 6
      },
      { 
        id: "sensitive", 
        value: "Sensitive", 
        description: "Easily irritated, may redden or sting with products",
        serviceId: 7
      }
    ],
    validation: (value) => value !== "",
    name: "skin_type",
    icon: "💧"
  },
  {
    id: 4,
    title: "Skin Concerns",
    text: "What are your primary skin concerns? (Select all that apply)",
    type: "checkbox",
    options: [
      { id: "acne", value: "Acne", description: "Breakouts and blemishes", serviceId: 2 },
      { id: "aging", value: "Aging", description: "Fine lines and wrinkles", serviceId: 3 },
      { id: "pigmentation", value: "Pigmentation", description: "Dark spots or uneven tone", serviceId: 4 },
      { id: "dryness", value: "Dryness", description: "Flaky or tight feeling skin", serviceId: 5 },
      { id: "sensitivity", value: "Sensitivity", description: "Easily irritated skin", serviceId: 6 }
    ],
    validation: (value) => Array.isArray(value) && value.length > 0,
    name: "skin_concerns",
    icon: "⚠️"
  }
];

function SurveyForm() {
  // Step tracking
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = surveyQuestions.length + 1; // Questions + Results

  // Form state
  const [formData, setFormData] = useState({});
  const [isPending, setIsPending] = useState(false);
  const [surveyCompleted, setSurveyCompleted] = useState(false);
  const [recommendedServices, setRecommendedServices] = useState([]);
  
  // Service data
  const { loading: servicesLoading, error: servicesError, data: services, getAllServices } = useListAllServices();
  const router = useRouter();

  // Fetch services when form is completed
  useEffect(() => {
    if (surveyCompleted) {
      getAllServices().then((fetchedServices) => {
        const recommendations = getServiceRecommendations(formData, fetchedServices);
        setRecommendedServices(recommendations);
      });
    }
  }, [surveyCompleted]);

  // Get service recommendations based on survey answers
  const getServiceRecommendations = (answers, availableServices) => {
    if (!availableServices || availableServices.length === 0) {
      return [];
    }

    // Track recommended service IDs
    const recommendedServiceIds = new Set();

    // Map survey answers to service IDs
    Object.entries(answers).forEach(([questionName, answer]) => {
      // Find the question
      const question = surveyQuestions.find(q => q.name === questionName);
      
      if (!question) return;
      
      if (question.type === "radio") {
        // For radio questions, find the selected option
        const selectedOption = question.options.find(opt => opt.value === answer);
        if (selectedOption && selectedOption.serviceId) {
          recommendedServiceIds.add(selectedOption.serviceId);
        }
      } 
      else if (question.type === "checkbox" && Array.isArray(answer)) {
        // For checkbox questions, add service IDs for all selected options
        answer.forEach(selectedValue => {
          const option = question.options.find(opt => opt.value === selectedValue);
          if (option && option.serviceId) {
            recommendedServiceIds.add(option.serviceId);
          }
        });
      }
    });

    // Filter available services to only include recommended ones
    const recommendations = availableServices.filter(service => 
      recommendedServiceIds.has(service.id)
    );

    // If no specific recommendations, return top 3 services
    if (recommendations.length === 0 && availableServices.length > 0) {
      return availableServices.slice(0, 3);
    }

    return recommendations;
  };

  // Navigate to service details
  const navigateToService = (serviceId) => {
    router.push(`/service/${serviceId}`);
  };

  // Book a service directly
  const bookService = (service) => {
    // Store selected service in localStorage
    localStorage.setItem('selectedService', JSON.stringify(service));
    // Redirect to booking page
    router.push('/booking?step=2');
    showToast(`Booking ${service.name}...`, "success");
  };

  // Book the featured LED Light Therapy service
  const bookFeaturedService = () => {
    // Create a mock service object for LED Light Therapy
    const ledTherapyService = {
      id: 101,
      name: "LED Light Therapy",
      description: "The Dermalux LED machine uses clinically proven RED, BLUE and Near Infrared Light that penetrates into different layers of the skin to target multiple skin concerns.",
      price: 122222,
      duration: "1:00:00",
      category: "General"
    };
    
    // Store the service and redirect
    localStorage.setItem('selectedService', JSON.stringify(ledTherapyService));
    router.push('/booking?step=2');
    showToast("Booking LED Light Therapy...", "success");
  };

  // Handle radio input change
  const handleRadioChange = (questionName, value) => {
    setFormData(prev => ({
      ...prev,
      [questionName]: value
    }));
  };

  // Handle checkbox input change
  const handleCheckboxChange = (questionName, value) => {
    setFormData(prev => {
      const currentValues = prev[questionName] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      
      return {
        ...prev,
        [questionName]: newValues
      };
    });
  };

  // Handle textarea input change
  const handleTextareaChange = (questionName, value) => {
    setFormData(prev => ({
      ...prev,
      [questionName]: value
    }));
  };

  // Navigate to next step
  const nextStep = () => {
    const currentQuestion = surveyQuestions[currentStep - 1];
    
    // If we're on a question step, validate before proceeding
    if (currentStep <= surveyQuestions.length) {
      if (!currentQuestion.validation(formData[currentQuestion.name])) {
        showToast("Please answer the question before proceeding", "error");
        return;
      }
    }
    
    if (currentStep < totalSteps) {
      // If moving to results step, mark survey as completed and fetch recommendations
      if (currentStep === surveyQuestions.length) {
        setSurveyCompleted(true);
        console.log("Survey completed with answers:", formData);
        
        // Start loading service recommendations
        getAllServices().then((fetchedServices) => {
          console.log("Fetched services for recommendations:", fetchedServices?.length || 0);
          const recommendations = getServiceRecommendations(formData, fetchedServices);
          console.log("Generated recommendations:", recommendations);
          setRecommendedServices(recommendations);
        }).catch(err => {
          console.error("Failed to fetch service recommendations:", err);
        });
      }
      
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  // Navigate to previous step
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  // Submit the survey
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    setIsPending(true);
    try {
      // Simulate API call to submit survey
      setTimeout(() => {
        showToast.success("Survey submitted successfully!");
        setIsPending(false);
      }, 1500);
    } catch (error) {
      showToast.error("Error submitting survey");
      setIsPending(false);
    }
  };

  // Restart the survey
  const restartSurvey = () => {
    setFormData({});
    setCurrentStep(1);
    setSurveyCompleted(false);
    window.scrollTo(0, 0);
  };

  // Render step indicators
  const renderStepIndicators = () => {
    const steps = surveyQuestions.map(q => ({ 
      number: q.id, 
      label: q.title,
      icon: q.icon
    }));
    
    // Add results step
    steps.push({ 
      number: surveyQuestions.length + 1, 
      label: "Results",
      icon: "🎯"
    });

    return (
      <div className="survey-steps">
        {steps.map((step) => (
          <div 
            key={step.number} 
            className={`survey-step ${currentStep === step.number ? 'active' : ''} ${currentStep > step.number ? 'completed' : ''}`}
          >
            <div className="step-number">
              {currentStep > step.number ? <FaCheck /> : <span>{step.icon}</span>}
            </div>
            <div className="step-label">{step.label}</div>
          </div>
        ))}
      </div>
    );
  };

  // Render radio question
  const renderRadioQuestion = (question) => {
    return (
      <div className="survey-question">
        <h4>{question.text}</h4>
        <div className="options-grid">
          {question.options.map((option) => (
            <div
              key={option.id}
              className={`option-card ${
                formData[question.name] === option.value ? "selected" : ""
              }`}
              onClick={() => handleRadioChange(question.name, option.value)}
            >
              <div className="option-content">
                <h5>{option.value}</h5>
                <p className="option-description">{option.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render checkbox question
  const renderCheckboxQuestion = (question) => {
    const selectedValues = formData[question.name] || [];
    
    return (
      <div className="survey-question">
        <h4>{question.text}</h4>
        <div className="options-grid">
          {question.options.map((option) => (
            <div
              key={option.id}
              className={`option-card ${
                selectedValues.includes(option.value) ? "selected" : ""
              }`}
              onClick={() => handleCheckboxChange(question.name, option.value)}
            >
              <div className="option-content">
                <h5>{option.value}</h5>
                <p className="option-description">{option.description}</p>
              </div>
              {selectedValues.includes(option.value) && (
                <div className="checkbox-indicator">
                  <FaCheck />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render textarea question
  const renderTextareaQuestion = (question) => {
    return (
      <div className="survey-question">
        <h4>{question.text}</h4>
        <textarea
          placeholder={question.placeholder}
          value={formData[question.name] || ""}
          onChange={(e) => handleTextareaChange(question.name, e.target.value)}
          rows={5}
          className="survey-textarea"
        />
      </div>
    );
  };

  // Render current question based on type
  const renderCurrentQuestion = () => {
    if (currentStep > surveyQuestions.length) {
      return null; // We're on the results step
    }
    
    const question = surveyQuestions[currentStep - 1];
    
    switch (question.type) {
      case "radio":
        return renderRadioQuestion(question);
      case "checkbox":
        return renderCheckboxQuestion(question);
      default:
        return null;
    }
  };

  // Render results
  const renderResults = () => {
    return (
      <div className="survey-results">
        <div className="results-header">
          <h4>Your Skin Analysis Results</h4>
        </div>
        
        <div className="results-summary">
          <h5>Your Survey Responses</h5>
          
          {surveyQuestions.map((question) => {
            let answerDisplay;
            
            if (question.type === "checkbox" && formData[question.name]) {
              answerDisplay = formData[question.name].join(", ");
            } else if (question.type === "textarea") {
              answerDisplay = formData[question.name] || "No additional information provided";
            } else {
              answerDisplay = formData[question.name] || "Not answered";
            }
            
            return (
              <div key={question.id} className="summary-item">
                <div className="question">
                  <span className="question-icon">{question.icon}</span>
                  <span>{question.text}</span>
                </div>
                <div className="answer">{answerDisplay}</div>
              </div>
            );
          })}
        </div>
        
        <div className="recommended-services">
          <h5>Recommended Services Based On Your Answers</h5>
          
          {servicesLoading ? (
            <div className="loading-indicator">
              <div className="spinner"></div>
              <p>Loading recommendations...</p>
            </div>
          ) : servicesError ? (
            <div className="error-message">
              <p>Unable to load recommendations. Please try again later.</p>
              <button 
                className="btn btn-secondary"
                onClick={() => getAllServices()}
              >
                Retry
              </button>
            </div>
          ) : recommendedServices.length === 0 ? (
            <div className="no-recommendations">
              <p>No specific recommendations found based on your answers.</p>
              <p>Browse our services to find the perfect treatment for you.</p>
              <button 
                className="btn btn-primary"
                onClick={() => router.push('/service')}
              >
                Browse All Services
              </button>
            </div>
          ) : (
            <div className="service-recommendations">
              {recommendedServices.slice(0, 2).map((service, index) => (
                <div className="service-item" key={service.id || index}>
                  <div className="service-image">
                  <img 
          src={service.imgUrl || "/assets/img/services/placeholder.jpg"} 
          alt={service.name || "Service"} 
          onError={(e) => {
            e.target.src = "/assets/img/services/placeholder.jpg";
          }}
        />
                  </div>
                  <div className="service-content">
                    <div className="service-name">{service.name}</div>
                    <div className="service-category">{service.category}</div>
                    <div className="service-description">{service.description}</div>
                    <div className="service-meta">
                      <div className="service-price">{service.price?.toLocaleString('vi-VN')} ₫</div>
                      <div className="service-duration">
                        <FaClock className="icon-clock" /> {service.duration?.replace(/:\d+$/, '').replace(':', 'h ')}m
                      </div>
                    </div>
                    <button 
                      className="book-now-btn"
                      onClick={() => bookService(service)}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
              
              {recommendedServices.length > 2 && (
                <div className="additional-services">
                  <h6>Additional Recommended Services</h6>
                  
                  {recommendedServices.slice(2).map((service, index) => (
                    <div className="service-item" key={service.id || `additional-${index}`}>
                       <div className="service-image">
                  <img 
          src={service.imgUrl || "/assets/img/services/placeholder.jpg"} 
          alt={service.name || "Service"} 
          onError={(e) => {
            e.target.src = "/assets/img/services/placeholder.jpg";
          }}
        />
                  </div>
                      <div className="service-content">
                        <div className="service-name">{service.name}</div>
                        <div className="service-category">{service.category}</div>
                        <div className="service-description">{service.description}</div>
                        <div className="service-meta">
                          <div className="service-price">{service.price?.toLocaleString('vi-VN')} ₫</div>
                          <div className="service-duration">
                            <FaClock className="icon-clock" /> {service.duration?.replace(/:\d+$/, '').replace(':', 'h ')}m
                          </div>
                        </div>
                        <button 
                          className="book-now-btn"
                          onClick={() => bookService(service)}
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="next-steps">
          <div className="action-buttons">
            <button 
              className="btn btn-primary"
              onClick={() => window.location.href = '/booking'}
            >
              Book a Consultation
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="survey-service">
      <div className="wrapper">
        <div className="survey-form">
          <form onSubmit={(e) => e.preventDefault()}>
            <h3>Skin Assessment Survey</h3>
            
            {/* Step indicators */}
            {renderStepIndicators()}
            
            {/* Current step content */}
            <div className="survey-content">
              {currentStep <= surveyQuestions.length ? (
                renderCurrentQuestion()
              ) : (
                renderResults()
              )}
            </div>
            
            {/* Navigation buttons */}
            <div className="survey-navigation">
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
                  type="button"
                  className="btn btn-success"
                  onClick={restartSurvey}
                  disabled={isPending}
                >
                  Take Survey Again
                </button>
              )}
            </div>

            <div className="survey-form__bottom">
              <a onClick={() => window.location.href = "/"}>Cancel and return to Home</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SurveyForm;