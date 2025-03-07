// src/components/Recommendation.jsx
// This is a simple recommendation component for the survey! I made it based on the quiz example :)
import React from "react";
import { Typography } from "@mui/material";

const Recommendation = ({ answers }) => {
  // Determine recommendation based on answers
  const feedbackLength = answers.feedback?.trim().length || 0;
  const skincareStatus = answers.skincareStatus || "Mild";
  const severity =
    feedbackLength >= 10 && skincareStatus === "Severe"
      ? "severe"
      : feedbackLength >= 10
      ? "moderate"
      : "mild";
  const serviceRecommendation = {
    severe: "Advanced Dermatology Consultation",
    moderate: "Custom Skincare Plan",
    mild: "Basic Skincare Maintenance",
  }[severity];

  return (
    <div>
      <Typography variant="h6" color="success.main" gutterBottom>
        Evaluation Complete! 🌟
      </Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        Based on your input, your acne severity is {severity}. Recommended
        service: <strong>{serviceRecommendation}</strong>
      </Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>
        Details: You provided {feedbackLength} characters of feedback and rated
        your condition as {skincareStatus}.
      </Typography>
    </div>
  );
};

export default Recommendation;
