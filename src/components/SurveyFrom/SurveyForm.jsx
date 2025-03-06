// src/components/SurveyForm.jsx
// This is my updated to-do list style survey! Removing Finish button and Completed status as requested :)
import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  TextField,
  Button,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form"; // Learned from a tutorial for form handling

// Assuming Recommendation is a separate component (placeholder)
const Recommendation = ({ answers }) => {
  // Determine recommendation based on answers
  const feedback = answers.feedback || "Mild"; // Radio choice
  const skincareStatus = answers.skincareStatus || "Mild";
  const severity =
    feedback === "Advanced" && skincareStatus === "Severe"
      ? "severe"
      : feedback === "Regular" && skincareStatus === "Moderate"
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
        Details: You described your routine as {feedback} and rated your
        condition as {skincareStatus}.
      </Typography>
    </div>
  );
};

function SurveyForm() {
  const { control, handleSubmit } = useForm(); // Using react-hook-form for state management
  const [formData, setFormData] = useState({
    feedback: "",
    skincareStatus: "",
  }); // Track answers for each question
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Current task/question
  const [isPending, setIsPending] = useState(false); // Submission status
  const [isSubmitted, setIsSubmitted] = useState(false); // Show results
  const [showReview, setShowReview] = useState(false); // Show review screen
  const [progress, setProgress] = useState(0); // Track progress

  // Define questions as a to-do list
  const questions = [
    {
      id: 1,
      text: "How would you describe your current skincare routine?",
      type: "radio",
      options: ["Basic", "Regular", "Advanced"],
      validation: (value) => value !== "",
      name: "feedback",
    },
    {
      id: 2,
      text: "How would you rate your skincare condition?",
      type: "radio",
      options: ["Mild", "Moderate", "Severe"],
      validation: (value) => value !== "",
      name: "skincareStatus",
    },
  ];

  // Calculate isCompleted based on all questions
  const isCompleted = questions.every((q) => q.validation(formData[q.name]));

  // Update progress based on completed questions
  useEffect(() => {
    const totalQuestions = questions.length;
    const completedQuestions = questions.filter((q) =>
      q.validation(formData[q.name])
    ).length;
    setProgress((completedQuestions / totalQuestions) * 100);
  }, [formData, questions]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Move to next question
  const handleNextQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion.validation(formData[currentQuestion.name])) {
      if (currentQuestionIndex + 1 < questions.length) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else if (isCompleted) {
        handleSubmitForm(); // Automatically submit when all questions are done
      }
    } else {
      alert(`Please complete the "${currentQuestion.text}" task fully!`);
    }
  };

  // Move to previous question
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Handle form submission (all questions done)
  const handleSubmitForm = (e) => {
    e?.preventDefault(); // Handle both button and programmatic call
    setIsPending(true);
    if (isCompleted) {
      setIsPending(false);
      setIsSubmitted(true); // Set isSubmitted only when all tasks are done
    } else {
      alert("Please complete all questions before submitting!");
      setIsPending(false);
    }
  };

  // Show review of answers
  const handleReview = () => {
    setShowReview(true);
  };

  // Retry the survey
  const handleRetry = () => {
    setFormData({ feedback: "", skincareStatus: "" });
    setCurrentQuestionIndex(0);
    setIsSubmitted(false);
    setShowReview(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Box
      className="survey-container"
      role="region"
      aria-label="Acne Evaluation Survey"
    >
      <Typography variant="h4" gutterBottom component="h1">
        Acne Condition Evaluation 🎓
      </Typography>
      <LinearProgress variant="determinate" value={progress} sx={{ mb: 2 }} />
      {showReview ? (
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h5" gutterBottom>
            Survey Review
          </Typography>
          <TableContainer
            component={Paper}
            sx={{ mt: 2, maxWidth: 600, margin: "0 auto" }}
          >
            <Table aria-label="survey review table">
              <TableBody>
                {questions.map((question) => (
                  <TableRow key={question.id}>
                    <TableCell sx={{ width: "50%" }}>
                      <Typography variant="body1">{question.text}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Your Answer: {formData[question.name] || "Not provided"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        Answer: {formData[question.name] || "Not provided"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button
            variant="contained"
            color="primary"
            onClick={handleRetry}
            sx={{ mt: 2 }}
          >
            Try Again!
          </Button>
        </Box>
      ) : isSubmitted ? (
        <Box sx={{ textAlign: "center" }}>
          <Recommendation answers={formData} />
          <Button
            variant="contained"
            color="primary"
            onClick={handleReview}
            sx={{ mt: 2, mr: 1 }}
          >
            Review Answers
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleRetry}
            sx={{ mt: 2 }}
          >
            Try Again!
          </Button>
        </Box>
      ) : (
        <>
          <Typography variant="h6" gutterBottom>
            Task {currentQuestionIndex + 1} of {questions.length}:{" "}
            {questions[currentQuestionIndex].text}
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmitForm}
            noValidate
            sx={{ mt: 2 }}
          >
            {questions[currentQuestionIndex].type === "textarea" ? (
              <Controller
                name="feedback"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={questions[currentQuestionIndex].text}
                    margin="normal"
                    variant="outlined"
                    multiline
                    rows={4}
                    placeholder={questions[currentQuestionIndex].placeholder}
                    aria-required="true"
                    autoComplete="off"
                    onChange={(e) => handleChange(e)}
                  />
                )}
              />
            ) : (
              <FormControl component="fieldset" sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  {questions[currentQuestionIndex].text}
                </Typography>
                <RadioGroup
                  value={formData[questions[currentQuestionIndex].name]}
                  onChange={handleChange}
                  name={questions[currentQuestionIndex].name}
                  aria-label={questions[currentQuestionIndex].text}
                >
                  {questions[currentQuestionIndex].options.map((option) => (
                    <FormControlLabel
                      key={option}
                      value={option}
                      control={<Radio />}
                      label={option}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            )}
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNextQuestion}
                disabled={
                  !questions[currentQuestionIndex].validation(
                    formData[questions[currentQuestionIndex].name]
                  )
                }
              >
                Next
              </Button>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}

export default SurveyForm;
