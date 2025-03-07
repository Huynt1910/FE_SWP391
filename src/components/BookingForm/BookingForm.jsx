import React, { useState } from "react";
import {
  Button,
  Stepper,
  Step,
  StepLabel,
  Card,
  TextField,
  MenuItem,
  Select,
  Box,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  Typography,
  FormHelperText,
  Divider,
  Paper,
  Grid,
  InputAdornment,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useForm, Controller } from "react-hook-form";
import {
  DatePicker,
  TimePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

// Custom styled TextField to fix label positioning issues
const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  "& .MuiInputLabel-root": {
    transform: "translate(14px, -9px) scale(0.75)",
    background: "#fff",
    padding: "0 5px",
  },
  "& .MuiOutlinedInput-root": {
    "&.Mui-error fieldset": {
      borderColor: theme.palette.error.main,
    },
  },
}));

// Available services with pricing
const services = [
  {
    id: "consultation",
    name: "Non-surgical consultation (Online)",
    price: 120,
  },
  { id: "therapy", name: "Therapy session (Online)", price: 150 },
  { id: "assessment", name: "Initial assessment (Online)", price: 200 },
];

// Therapist data with specialties
const therapists = [
  {
    id: 1,
    name: "Dr. Emily Johnson",
    specialty: "Cognitive Behavioral Therapy",
    availability: ["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"],
  },
  {
    id: 2,
    name: "Dr. Michael Smith",
    specialty: "Psychodynamic Therapy",
    availability: ["10:00 AM", "1:00 PM", "3:00 PM", "5:00 PM"],
  },
  {
    id: 3,
    name: "Dr. Sarah Lee",
    specialty: "Family Therapy",
    availability: ["8:00 AM", "12:00 PM", "2:00 PM", "4:00 PM"],
  },
];

const steps = [
  "Service Selection",
  "Therapist Selection",
  "Date & Time",
  "Your Information",
  "Payment",
  "Confirmation",
];

const BookingForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      service: "",
      therapist: "",
      date: null,
      time: null,
      name: "",
      email: "",
      phone: "",
      coupon: "",
    },
  });
  const [bookingData, setBookingData] = useState({});
  const [bookingId] = useState(
    "BK" + Math.floor(10000 + Math.random() * 90000)
  );

  const selectedService = watch("service");
  const selectedTherapist = watch("therapist");

  // Get service price
  const getServicePrice = () => {
    const service = services.find((s) => s.id === selectedService);
    return service?.price || 0;
  };

  // Get selected therapist details
  const getTherapistDetails = () => {
    return therapists.find((t) => t.name === selectedTherapist) || {};
  };

  const onNext = (data) => {
    setBookingData({ ...bookingData, ...data });
    setCurrentStep((prev) => prev + 1);
  };

  const onBack = () => setCurrentStep((prev) => prev - 1);

  const onFinish = () => {
    alert("Booking Confirmed! Your appointment ID is " + bookingId);
  };

  // Form validation rules
  const isNextDisabled = () => {
    switch (currentStep) {
      case 0:
        return !selectedService;
      case 1:
        return !selectedTherapist;
      case 2:
        return !watch("date") || !watch("time");
      case 3:
        return !watch("name") || !watch("email") || !watch("phone");
      default:
        return false;
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ maxWidth: 800, margin: "0 auto", p: 3, borderRadius: 2 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Schedule Your Appointment
        </Typography>

        <Stepper activeStep={currentStep} alternativeLabel sx={{ my: 4 }}>
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ my: 4 }}>
          {currentStep === 0 && (
            <>
              <Typography variant="h6" gutterBottom>
                Select a Service
              </Typography>
              <Controller
                name="service"
                control={control}
                rules={{ required: "Please select a service" }}
                render={({ field }) => (
                  <Grid container spacing={2}>
                    {services.map((service) => (
                      <Grid item xs={12} key={service.id}>
                        <Paper
                          sx={{
                            p: 2,
                            cursor: "pointer",
                            border:
                              field.value === service.id
                                ? "2px solid #1976d2"
                                : "1px solid #e0e0e0",
                            "&:hover": { boxShadow: 2 },
                          }}
                          onClick={() => field.onChange(service.id)}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography variant="subtitle1">
                              {service.name}
                            </Typography>
                            <Typography variant="subtitle1" color="primary">
                              ${service.price}
                            </Typography>
                          </Box>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                )}
              />
              {errors.service && (
                <FormHelperText error>{errors.service.message}</FormHelperText>
              )}
            </>
          )}

          {currentStep === 1 && (
            <>
              <Typography variant="h6" gutterBottom>
                Select a Therapist
              </Typography>
              <Controller
                name="therapist"
                control={control}
                rules={{ required: "Please select a therapist" }}
                render={({ field }) => (
                  <Grid container spacing={2}>
                    {therapists.map((therapist) => (
                      <Grid item xs={12} key={therapist.id}>
                        <Paper
                          sx={{
                            p: 2,
                            cursor: "pointer",
                            border:
                              field.value === therapist.name
                                ? "2px solid #1976d2"
                                : "1px solid #e0e0e0",
                            "&:hover": { boxShadow: 2 },
                          }}
                          onClick={() => field.onChange(therapist.name)}
                        >
                          <Typography variant="subtitle1">
                            {therapist.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Specialty: {therapist.specialty}
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                )}
              />
              {errors.therapist && (
                <FormHelperText error>
                  {errors.therapist.message}
                </FormHelperText>
              )}
            </>
          )}

          {currentStep === 2 && (
            <>
              <Typography variant="h6" gutterBottom>
                Select Date & Time
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="date"
                    control={control}
                    rules={{ required: "Date is required" }}
                    render={({ field }) => (
                      <DatePicker
                        label="Select Date"
                        {...field}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!errors.date,
                            helperText: errors.date?.message,
                            InputLabelProps: { shrink: true },
                          },
                        }}
                        disablePast
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="time"
                    control={control}
                    rules={{ required: "Time is required" }}
                    render={({ field }) => (
                      <TimePicker
                        label="Select Time"
                        {...field}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!errors.time,
                            helperText: errors.time?.message,
                            InputLabelProps: { shrink: true },
                          },
                        }}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              {selectedTherapist && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Available time slots for {selectedTherapist}:
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {getTherapistDetails().availability?.map((time) => (
                      <Button
                        key={time}
                        variant="outlined"
                        size="small"
                        sx={{ m: 0.5 }}
                        onClick={() => {
                          // Convert time string to dayjs object
                          const [hours, minutes] = time.split(":");
                          const period = time.includes("PM");
                          let hour = parseInt(hours);
                          if (period && hour !== 12) hour += 12;
                          if (!period && hour === 12) hour = 0;
                          const timeObj = dayjs()
                            .hour(hour)
                            .minute(parseInt(minutes) || 0);
                        }}
                      >
                        {time}
                      </Button>
                    ))}
                  </Box>
                </Box>
              )}
            </>
          )}

          {currentStep === 3 && (
            <>
              <Typography variant="h6" gutterBottom>
                Your Information
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Controller
                    name="name"
                    control={control}
                    rules={{ required: "Full name is required" }}
                    render={({ field }) => (
                      <StyledTextField
                        {...field}
                        label="Full Name"
                        fullWidth
                        error={!!errors.name}
                        helperText={errors.name?.message}
                        InputLabelProps={{ shrink: true }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="email"
                    control={control}
                    rules={{
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    }}
                    render={({ field }) => (
                      <StyledTextField
                        {...field}
                        label="Email"
                        fullWidth
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        InputLabelProps={{ shrink: true }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="phone"
                    control={control}
                    rules={{
                      required: "Phone number is required",
                      pattern: {
                        value: /^[0-9()-\s]{10,15}$/,
                        message: "Invalid phone number",
                      },
                    }}
                    render={({ field }) => (
                      <StyledTextField
                        {...field}
                        label="Phone Number"
                        fullWidth
                        error={!!errors.phone}
                        helperText={errors.phone?.message}
                        InputLabelProps={{ shrink: true }}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </>
          )}

          {currentStep === 4 && (
            <>
              <Typography variant="h6" gutterBottom>
                Payment Details
              </Typography>
              <Box
                sx={{
                  bgcolor: "background.paper",
                  p: 2,
                  borderRadius: 1,
                  mb: 3,
                }}
              >
                <Typography variant="subtitle1" gutterBottom>
                  Order Summary
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography>
                    {services.find((s) => s.id === selectedService)?.name ||
                      "Selected service"}
                  </Typography>
                  <Typography>${getServicePrice()}</Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="subtitle1">Total</Typography>
                  <Typography variant="subtitle1" color="primary">
                    ${getServicePrice()}
                  </Typography>
                </Box>
              </Box>

              <Controller
                name="coupon"
                control={control}
                render={({ field }) => (
                  <StyledTextField
                    {...field}
                    label="Coupon Code (Optional)"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => alert("Coupon applied!")}
                          >
                            Apply
                          </Button>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </>
          )}

          {currentStep === 5 && (
            <Box sx={{ bgcolor: "background.paper", p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom color="primary">
                Booking Confirmed!
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Appointment ID: {bookingId}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Service:</Typography>
                  <Typography>
                    {services.find((s) => s.id === bookingData.service)?.name ||
                      "Selected service"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Therapist:</Typography>
                  <Typography>{bookingData.therapist}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Date:</Typography>
                  <Typography>
                    {bookingData.date
                      ? dayjs(bookingData.date).format("MMMM DD, YYYY")
                      : ""}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Time:</Typography>
                  <Typography>
                    {bookingData.time
                      ? dayjs(bookingData.time).format("hh:mm A")
                      : ""}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Patient:</Typography>
                  <Typography>{bookingData.name}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Contact:</Typography>
                  <Typography>
                    {bookingData.email} | {bookingData.phone}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Total Amount:</Typography>
                  <Typography color="primary">${getServicePrice()}</Typography>
                </Grid>
              </Grid>
              <Typography variant="body2" sx={{ mt: 3 }} color="text.secondary">
                A confirmation email has been sent to {bookingData.email} with
                all appointment details.
              </Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          {currentStep > 0 && (
            <Button variant="outlined" onClick={onBack}>
              Back
            </Button>
          )}
          {currentStep === 0 && <Box />}

          {currentStep < steps.length - 1 && (
            <Button
              variant="contained"
              onClick={handleSubmit(onNext)}
              disabled={isNextDisabled()}
            >
              Next
            </Button>
          )}

          {currentStep === steps.length - 1 && (
            <Button variant="contained" color="success" onClick={onFinish}>
              Close
            </Button>
          )}
        </Box>
      </Card>
    </LocalizationProvider>
  );
};

export default BookingForm;
