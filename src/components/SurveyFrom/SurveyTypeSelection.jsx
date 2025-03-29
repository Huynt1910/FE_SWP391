import React from "react";
import { FaSpa, FaFaceSmile } from "react-icons/fa6";

const SurveyTypeSelection = ({ onSelectType, selectedType }) => {
  return (
    <div className="survey-type-selection">
      <h4>What type of assessment would you like to take?</h4>
      <div className="options-grid">
        {/* Skincare Survey Option */}
        <div
          className={`option-card ${selectedType === 'skincare' ? 'selected' : ''}`}
          onClick={() => onSelectType('skincare')}
        >
          <div className="option-content">
            <div className="option-icon">
              <FaFaceSmile />
            </div>
            <h5>Skin Assessment</h5>
            <p className="option-description">
              Get personalized skincare recommendations based on your skin type and concerns
            </p>
          </div>
        </div>
        
        {/* Spa Treatment Survey Option */}
        <div
          className={`option-card ${selectedType === 'spa' ? 'selected' : ''}`}
          onClick={() => onSelectType('spa')}
        >
          <div className="option-content">
            <div className="option-icon">
              <FaSpa />
            </div>
            <h5>Spa Treatment</h5>
            <p className="option-description">
              Find the perfect spa treatments to address your specific needs and preferences
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyTypeSelection; 