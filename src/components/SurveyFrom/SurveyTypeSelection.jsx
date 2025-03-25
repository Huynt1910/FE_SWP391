import React from "react";
import { motion } from "framer-motion"; // If you have framer-motion installed

const SurveyTypeSelection = ({ onSelectType, selectedType }) => {
  // Animation variants for cards
  const cardVariants = {
    hover: {
      y: -5,
      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
      borderColor: "#dda5a5",
      transition: { duration: 0.3 }
    },
    selected: {
      borderColor: "#e2879d",
      backgroundColor: "rgba(226, 135, 157, 0.05)",
      boxShadow: "0 5px 15px rgba(226, 135, 157, 0.2)",
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="survey-type-selection">
      <h4>Choose a Survey Type</h4>
      <div className="options-grid">
        {/* Skincare Survey Option */}
        <motion.div
          className={`option-card ${selectedType === 'skincare' ? 'selected' : ''}`}
          onClick={() => onSelectType('skincare')}
          whileHover="hover"
          variants={cardVariants}
          animate={selectedType === 'skincare' ? "selected" : ""}
        >
          <div className="option-content">
            <h5>Skincare Assessment</h5>
            <div className="option-icon">🧴</div>
            <p className="option-description">
              Evaluate your skin type, concerns, and get personalized skincare recommendations.
            </p>
          </div>
        </motion.div>
        
        {/* Spa Treatment Survey Option */}
        <motion.div
          className={`option-card ${selectedType === 'spa' ? 'selected' : ''}`}
          onClick={() => onSelectType('spa')}
          whileHover="hover"
          variants={cardVariants}
          animate={selectedType === 'spa' ? "selected" : ""}
        >
          <div className="option-content">
            <h5>Spa Treatment Assessment</h5>
            <div className="option-icon">🧖</div>
            <p className="option-description">
              Discover the perfect spa treatments based on your preferences and needs.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SurveyTypeSelection; 