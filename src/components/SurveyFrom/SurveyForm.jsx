import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight, FaCheck, FaClipboardList } from "react-icons/fa";
import { showToast } from "@/utils/toast"; // Adjust path as needed


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
        description: "Cleansing and occasional moisturizing" 
      },
      { 
        id: "regular", 
        value: "Regular", 
        description: "Daily cleansing, toning, and moisturizing" 
      },
      { 
        id: "advanced", 
        value: "Advanced", 
        description: "Complete routine with specialized products and treatments" 
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
        description: "Occasional breakouts, minor concerns" 
      },
      { 
        id: "moderate", 
        value: "Moderate", 
        description: "Regular breakouts, visible concerns" 
      },
      { 
        id: "severe", 
        value: "Severe", 
        description: "Persistent breakouts, significant concerns" 
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
        description: "Feels tight, may have flaky patches" 
      },
      { 
        id: "oily", 
        value: "Oily", 
        description: "Shiny appearance, especially in T-zone" 
      },
      { 
        id: "combination", 
        value: "Combination", 
        description: "Oily in some areas, dry in others" 
      },
      { 
        id: "normal", 
        value: "Normal", 
        description: "Well-balanced, neither too oily nor too dry" 
      },
      { 
        id: "sensitive", 
        value: "Sensitive", 
        description: "Easily irritated, may redden or sting with products" 
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
      { id: "acne", value: "Acne", description: "Breakouts and blemishes" },
      { id: "aging", value: "Aging", description: "Fine lines and wrinkles" },
      { id: "pigmentation", value: "Pigmentation", description: "Dark spots or uneven tone" },
      { id: "dryness", value: "Dryness", description: "Flaky or tight feeling skin" },
      { id: "sensitivity", value: "Sensitivity", description: "Easily irritated skin" }
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
        showToast.error(`Please answer the question before proceeding`);
        return;
      }
    }
    
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
      
      // If moving to results step, mark survey as completed
      if (currentStep === surveyQuestions.length) {
        setSurveyCompleted(true);
      }
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
          <div className="survey-id">Survey ID: SV{Math.floor(100000 + Math.random() * 900000)}</div>
        </div>
        
        {/* <Recommendation answers={formData} /> */}
        
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
        
        <div className="next-steps">
          <h5>Recommended Next Steps</h5>
          <ul>
            <li>Book a consultation with one of our skincare specialists</li>
            <li>Explore our recommended products for your skin type</li>
            <li>Learn more about treatments for your specific concerns</li>
          </ul>
          
          <div className="action-buttons">
            <button 
              className="btn btn-primary"
              onClick={() => window.location.href = '/booking'}
            >
              Book a Consultation
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => window.location.href = '/shop'}
            >
              Shop Recommended Products
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="survey-service">
        <div className="wrapper">
          <div
            className="survey-form js-img"
            style={{
              backgroundImage: `url('/assets/img/survey-form__bg.png')`,
            }}
          >
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
    </>
  );
}

export default SurveyForm;