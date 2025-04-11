import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight, FaCheck, FaClipboardList, FaClock } from "react-icons/fa";
import { showToast } from "@/utils/toast"; // Adjust path as needed
import useListAllServices from "@/auth/hook/useListAllServices";
import { useRouter } from "next/router";


// Enhanced survey questions with more details
const skincareSurveyQuestions = [
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
        serviceId: 1001
      },
      { 
        id: "regular", 
        value: "Regular", 
        description: "Daily cleansing, toning, and moisturizing",
        serviceId: 1002
      },
      { 
        id: "advanced", 
        value: "Advanced", 
        description: "Complete routine with specialized products and treatments",
        serviceId: 1003
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
        serviceId: 1004
      },
      { 
        id: "moderate", 
        value: "Moderate", 
        description: "Regular breakouts, visible concerns",
        serviceId: 1005
      },
      { 
        id: "severe", 
        value: "Severe", 
        description: "Persistent breakouts, significant concerns",
        serviceId: 1006
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
        serviceId: 1007
      },
      { 
        id: "oily", 
        value: "Oily", 
        description: "Shiny appearance, especially in T-zone",
        serviceId: 1008
      },
      { 
        id: "combination", 
        value: "Combination", 
        description: "Oily in some areas, dry in others",
        serviceId: 1009
      },
      { 
        id: "normal", 
        value: "Normal", 
        description: "Well-balanced, neither too oily nor too dry",
        serviceId: 1010
      },
      { 
        id: "sensitive", 
        value: "Sensitive", 
        description: "Easily irritated, may redden or sting with products",
        serviceId: 1011
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
      { id: "acne", value: "Acne", description: "Breakouts and blemishes", serviceId: 1012 },
      { id: "aging", value: "Aging", description: "Fine lines and wrinkles", serviceId: 1013 },
      { id: "pigmentation", value: "Pigmentation", description: "Dark spots or uneven tone", serviceId: 1014 },
      { id: "dryness", value: "Dryness", description: "Flaky or tight feeling skin", serviceId: 1015 },
      { id: "sensitivity", value: "Sensitivity", description: "Easily irritated skin", serviceId: 1016 }
    ],
    validation: (value) => Array.isArray(value) && value.length > 0,
    name: "skin_concerns",
    icon: "⚠️"
  }
];

// New spa survey questions
const spaSurveyQuestions = [
  {
    id: 1,
    title: "Spa Experience",
    text: "How often do you visit spas?",
    type: "radio",
    options: [
      { 
        id: "never", 
        value: "Never", 
        description: "First-time spa visitor",
        serviceId: 2001
      },
      { 
        id: "occasionally", 
        value: "Occasionally", 
        description: "A few times per year",
        serviceId: 2002
      },
      { 
        id: "regularly", 
        value: "Regularly", 
        description: "Monthly spa visits",
        serviceId: 2003
      }
    ],
    validation: (value) => value !== "",
    name: "spa_experience",
    icon: "🧖"
  },
  {
    id: 2,
    title: "Treatment Preference",
    text: "What type of spa treatments do you prefer?",
    type: "checkbox",
    options: [
      { 
        id: "massage", 
        value: "Massage", 
        description: "Relaxing and therapeutic body massage",
        serviceId: 2004
      },
      { 
        id: "facial", 
        value: "Facial", 
        description: "Skin care treatments for the face",
        serviceId: 2005
      },
      { 
        id: "bodyTreatment", 
        value: "Body Treatment", 
        description: "Scrubs, wraps, and other body treatments",
        serviceId: 2006
      },
      { 
        id: "nailCare", 
        value: "Nail Care", 
        description: "Manicures and pedicures",
        serviceId: 2007
      }
    ],
    validation: (value) => Array.isArray(value) && value.length > 0,
    name: "treatment_preference",
    icon: "✨"
  },
  {
    id: 3,
    title: "Stress Level",
    text: "How would you rate your current stress level?",
    type: "radio",
    options: [
      { 
        id: "low", 
        value: "Low", 
        description: "Minimal stress, generally relaxed",
        serviceId: 2008
      },
      { 
        id: "medium", 
        value: "Medium", 
        description: "Moderate stress levels",
        serviceId: 2009
      },
      { 
        id: "high", 
        value: "High", 
        description: "High stress, feeling tense or overwhelmed",
        serviceId: 2010
      }
    ],
    validation: (value) => value !== "",
    name: "stress_level",
    icon: "😌"
  },
  {
    id: 4,
    title: "Treatment Goals",
    text: "What are your primary goals for spa treatments?",
    type: "checkbox",
    options: [
      { 
        id: "relaxation", 
        value: "Relaxation", 
        description: "Reduce stress and promote relaxation",
        serviceId: 2011
      },
      { 
        id: "painRelief", 
        value: "Pain Relief", 
        description: "Alleviate muscle pain or tension",
        serviceId: 2012
      },
      { 
        id: "beautification", 
        value: "Beautification", 
        description: "Enhance appearance and beauty",
        serviceId: 2013
      },
      { 
        id: "detox", 
        value: "Detoxification", 
        description: "Remove toxins and promote wellness",
        serviceId: 2014
      }
    ],
    validation: (value) => Array.isArray(value) && value.length > 0,
    name: "treatment_goals",
    icon: "🎯"
  }
];

function SurveyForm() {
  // Survey type
  const [surveyType, setSurveyType] = useState(null); // null, 'skincare', or 'spa'
  const [surveyQuestions, setSurveyQuestions] = useState([]);
  
  // Step tracking
  const [currentStep, setCurrentStep] = useState(0); // Start at survey selection screen
  const [totalSteps, setTotalSteps] = useState(2); // Initial value for selection screen + minimum one step

  // Form state
  const [formData, setFormData] = useState({});
  const [isPending, setIsPending] = useState(false);
  const [surveyCompleted, setSurveyCompleted] = useState(false);
  const [recommendedServices, setRecommendedServices] = useState([]);
  
  // Service data
  const { loading: servicesLoading, error: servicesError, data: services, getAllServices } = useListAllServices();
  const router = useRouter();

  // Set the survey questions based on type
  useEffect(() => {
    if (surveyType === 'skincare') {
      setSurveyQuestions(skincareSurveyQuestions);
      setTotalSteps(skincareSurveyQuestions.length + 2); // +2 for selection screen and results
    } else if (surveyType === 'spa') {
      setSurveyQuestions(spaSurveyQuestions);
      setTotalSteps(spaSurveyQuestions.length + 2); // +2 for selection screen and results
    }
  }, [surveyType]);

  // Fetch services when form is completed
  useEffect(() => {
    if (surveyCompleted) {
      getAllServices().then((fetchedServices) => {
        const recommendations = getServiceRecommendations(formData, fetchedServices);
        setRecommendedServices(recommendations);
      });
    }
  }, [surveyCompleted]);

  // Handle survey type selection
  const selectSurveyType = (type) => {
    setSurveyType(type);
    setFormData({}); // Reset form data when changing survey type
    setCurrentStep(1); // Move to first question after selection
    window.scrollTo(0, 0);
  };

  // Get service recommendations based on survey answers
  const getServiceRecommendations = (answers, availableServices) => {
    if (!availableServices || availableServices.length === 0) {
      return [];
    }

    // Filter services based on survey type first
    let categoryFilteredServices = availableServices;
    
    // For skincare survey, only recommend "Facial Treatments"
    if (surveyType === 'skincare') {
      categoryFilteredServices = availableServices.filter(service => 
        service.category === "Facial Treatments"
      );
    } 
    // For spa survey, only recommend "Full-Body Massage" and "Packages"
    else if (surveyType === 'spa') {
      categoryFilteredServices = availableServices.filter(service => 
        service.category === "Full-Body Massage" || service.category === "Packages"
      );
    }

    // If no services match the category filter, return empty
    if (categoryFilteredServices.length === 0) {
      return [];
    }

    // Track recommended service IDs
    const recommendedServiceIds = new Set();

    // Map survey answers to service IDs
    Object.entries(answers).forEach(([questionName, answer]) => {
      // Find the question from the current survey type
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

    // First try to filter by both category and recommended IDs
    let recommendations = categoryFilteredServices.filter(service => 
      recommendedServiceIds.has(service.id)
    );

    // If no specific recommendations within category, return top services from the category
    if (recommendations.length === 0) {
      console.log(`No specific service recommendations found for ${surveyType} survey. Returning top services from appropriate categories.`);
      
      // Sort by price (higher price first) and return top 3
      return categoryFilteredServices
        .sort((a, b) => parseFloat(b.price || 0) - parseFloat(a.price || 0))
        .slice(0, 3);
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
    // showToast(`Booking ${service.name}...`, "success");
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
    // showToast("Booking LED Light Therapy...", "success");
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
    // If we're on the survey type selection screen and no survey type is selected
    if (currentStep === 0 && !surveyType) {
      // showToast("Please select a survey type", "error");
      return;
    }

    // If we're on a question step, validate before proceeding
    if (currentStep >= 1 && currentStep <= surveyQuestions.length) {
      const currentQuestion = surveyQuestions[currentStep - 1];
      if (!currentQuestion.validation(formData[currentQuestion.name])) {
        // showToast("Please answer the question before proceeding", "error");
        return;
      }
    }
    
    if (currentStep < totalSteps - 1) {
      // If moving to results step, mark survey as completed and fetch recommendations
      if (currentStep === surveyQuestions.length) {
        setSurveyCompleted(true);
        console.log(`${surveyType} survey completed with answers:`, formData);
        
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
    if (currentStep > 0) {
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
        // showToast.success("Survey submitted successfully!");
        setIsPending(false);
      }, 1500);
    } catch (error) {
      // showToast.error("Error submitting survey");
      setIsPending(false);
    }
  };

  // Restart the survey
  const restartSurvey = () => {
    setFormData({});
    setSurveyType(null);
    setCurrentStep(0);
    setSurveyCompleted(false);
    window.scrollTo(0, 0);
  };

  // Render step indicators
  const renderStepIndicators = () => {
    if (currentStep === 0) {
      return null; // Don't show step indicators on the selection screen
    }

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

  // Render survey type selection
  const renderSurveyTypeSelection = () => {
    return (
      <div className="survey-type-selection">
        <h4>Choose a Survey Type</h4>
        <div className="options-grid">
          <div
            className={`option-card ${surveyType === 'skincare' ? 'selected' : ''}`}
            onClick={() => selectSurveyType('skincare')}
          >
            <div className="option-content">
              <h5>Skincare Assessment</h5>
              <div className="option-icon">🧴</div>
              <p className="option-description">
                Evaluate your skin type, concerns, and get personalized skincare recommendations.
              </p>
            </div>
          </div>
          
          <div
            className={`option-card ${surveyType === 'spa' ? 'selected' : ''}`}
            onClick={() => selectSurveyType('spa')}
          >
            <div className="option-content">
              <h5>Spa Treatment Assessment</h5>
              <div className="option-icon">🧖</div>
              <p className="option-description">
                Discover the perfect spa treatments based on your preferences and needs.
              </p>
            </div>
          </div>
        </div>
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

  // Render current question based on type
  const renderCurrentQuestion = () => {
    if (currentStep === 0) {
      return renderSurveyTypeSelection();
    }
    
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

  // Determine the primary category of recommendations
  const determinePrimaryCategory = (services) => {
    if (!services || services.length === 0) return "Treatments";
    
    // Count occurrences of each category
    const categoryCounts = {};
    services.forEach(service => {
      const category = service.category || 
        (service.name?.toLowerCase().includes('massage') ? 'Body Treatments' : 
         service.name?.toLowerCase().includes('therapy') ? 'Therapy' :
         'Facial Treatments');
      
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
    
    // Find the most common category
    let maxCount = 0;
    let primaryCategory = "Treatments";
    
    Object.entries(categoryCounts).forEach(([category, count]) => {
      if (count > maxCount) {
        maxCount = count;
        primaryCategory = category;
      }
    });
    
    return primaryCategory;
  };

  // Render results
  const renderResults = () => {
    const surveyTitle = surveyType === 'skincare' ? 'Skin Analysis' : 'Spa Treatment Analysis';
    const categoryText = surveyType === 'skincare' 
      ? "Facial Treatments" 
      : "Full-Body Massage and Packages";
    
    return (
      <div className="survey-results">
        <div className="results-header">
          <h4>Your {surveyTitle} Results</h4>
          <p className="category-filter-info">Showing recommendations from <strong>{categoryText}</strong> category</p>
        </div>
        
        <div className="results-summary">
          <h5>Your Survey Responses</h5>
          
          {surveyQuestions.map((question) => {
            let answerDisplay;
            
            if (question.type === "checkbox" && formData[question.name]) {
              answerDisplay = formData[question.name].join(", ");
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
          <h5>Recommended {determinePrimaryCategory(recommendedServices)} Based On Your Answers</h5>
          
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
              <p>No specific {surveyType === 'skincare' ? 'Facial Treatments' : 'Massage or Package'} recommendations found based on your answers.</p>
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
              {recommendedServices.slice(0, 2).map((service, index) => {
                // Determine the service category
                const categoryName = service.category || 
                  (service.name?.toLowerCase().includes('massage') ? 'Body Treatments' : 
                   service.name?.toLowerCase().includes('therapy') ? 'Therapy' :
                   'Facial Treatments');
                 
                // Determine category class for styling  
                const categoryClass = 
                  categoryName.toLowerCase().includes('body') ? 'category-body' :
                  categoryName.toLowerCase().includes('massage') ? 'category-massage' :
                  categoryName.toLowerCase().includes('therapy') ? 'category-therapy' :
                  'category-facial';
                
                return (
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
                      <div className={`service-category ${categoryClass}`}>{categoryName}</div>
                      <div className="service-name">{service.name}</div>
                      <div className="service-description">{service.description}</div>
                      <div className="service-meta">
                        <div className="service-price">{service.price?.toLocaleString('vi-VN', {maximumFractionDigits: 0})} ₫</div>
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
                );
              })}
              
              {recommendedServices.length > 2 && (
                <div className="additional-services">
                  <h6>Additional Recommended Services</h6>
                  
                  {recommendedServices.slice(2).map((service, index) => {
                    // Determine the service category
                    const categoryName = service.category || 
                      (service.name?.toLowerCase().includes('massage') ? 'Body Treatments' : 
                       service.name?.toLowerCase().includes('therapy') ? 'Therapy' :
                       'Facial Treatments');
                     
                    // Determine category class for styling  
                    const categoryClass = 
                      categoryName.toLowerCase().includes('body') ? 'category-body' :
                      categoryName.toLowerCase().includes('massage') ? 'category-massage' :
                      categoryName.toLowerCase().includes('therapy') ? 'category-therapy' :
                      'category-facial';
                    
                    return (
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
                          <div className={`service-category ${categoryClass}`}>{categoryName}</div>
                          <div className="service-name">{service.name}</div>
                          <div className="service-description">{service.description}</div>
                          <div className="service-meta">
                            <div className="service-price">{service.price?.toLocaleString('vi-VN', {maximumFractionDigits: 0})} ₫</div>
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
                    );
                  })}
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
              Book Services
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
            <h3>{currentStep === 0 ? "Assessment Surveys" : surveyType === 'skincare' ? "Skin Assessment Survey" : "Spa Treatment Survey"}</h3>
            
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
              {currentStep > 0 && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={prevStep}
                >
                  <FaArrowLeft /> Back
                </button>
              )}
              
              {currentStep === 0 ? (
                // Selection screen - show just "Start Survey" button (disabled until a survey type is selected)
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={nextStep}
                  disabled={!surveyType}
                  style={{
                    opacity: surveyType ? 1 : 0.7,
                    position: 'relative',
                    left: '50%', 
                    transform: 'translateX(-50%)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {!surveyType ? 'Please Select a Survey Type' : 'Start Survey'}
                </button>
              ) : currentStep < totalSteps - 1 ? (
                // Question screens - show "Next" button
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={nextStep}
                >
                  Next <FaArrowRight />
                </button>
              ) : (
                // Results screen - show "Take Another Survey" button
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={restartSurvey}
                  disabled={isPending}
                >
                  Take Another Survey
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