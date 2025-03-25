import { SocialLogin } from "@components/shared/SocialLogin/SocialLogin";
import { useState } from "react";
import router from "next/router";
import { useSignUp } from "@/auth/hook/useSingupHook";
import { showToast } from "@utils/toast";
import { FaEye, FaEyeSlash, FaCalendarAlt, FaSpinner } from "react-icons/fa";

export const Registration = () => {
  const { signUp, isPending } = useSignUp();
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    password: "",
    confirmPassword: "",
    gender: "",
    birthDate: "",
  });

  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Check password strength when password changes
    if (name === "password") {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password) => {
    let score = 0;
    let message = "";

    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    switch (score) {
      case 0:
      case 1:
        message = "Weak";
        break;
      case 2:
      case 3:
        message = "Medium";
        break;
      case 4:
      case 5:
        message = "Strong";
        break;
      default:
        message = "";
    }

    setPasswordStrength({ score, message });
  };

  const validateForm = () => {
    const newErrors = {};

    // Username validation
    if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    // Name validation
    if (formData.firstName.trim() === "") {
      newErrors.firstName = "First name is required";
    }

    if (formData.lastName.trim() === "") {
      newErrors.lastName = "Last name is required";
    }

    // Phone validation
    if (!/^\d{10,11}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number (10-11 digits)";
    }

    // Email validation
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Gender validation
    if (!formData.gender) {
      newErrors.gender = "Please select your gender";
    }

    // Birth date validation
    if (!formData.birthDate) {
      newErrors.birthDate = "Please enter your birth date";
    } else {
      const birthDate = new Date(formData.birthDate);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();

      if (age < 16) {
        newErrors.birthDate = "You must be at least 16 years old";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation before sending
    if (!validateForm()) {
      showToast("Please check the form for errors", "error");
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log("Submitting registration form with data:", { 
        ...formData, 
        password: '********' // Hide password in logs
      });
      
      // Format the data for the API with ALL required fields
      const userData = {
        username: formData.username,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone || "0000000000", // Include phone
        address: formData.address || "HCM", // Include address
        gender: formData.gender || "Male",
        birthDate: formData.birthDate || "2000-01-01"
      };
      
      const result = await signUp(userData);
      
      console.log("Registration result:", {
        success: result.success,
        error: result.error
      });
      
      if (!result.success) {
        // If we have a field-specific error, set it
        if (result.field) {
          setErrors({
            ...errors,
            [result.field]: result.error
          });
        } else {
          // Otherwise set it as a general error
          setError(result.error || "Registration failed. Please try again.");
          showToast(result.error || "Registration failed. Please try again.", "error");
        }
        setIsLoading(false);
        return;
      }
      
      // Reset errors
      setError("");
      setErrors({});
      
      // Registration successful - handled by the success handler in useSignUp
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || "An unexpected error occurred. Please try again.");
      showToast(err.message || "An unexpected error occurred. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="registration">
      <div className="wrapper">
        <div className="registration-form js-img">
          <h3 className="form-title">Create Your Account</h3>
          <p className="form-subtitle">Join us to start your journey</p>

          <form onSubmit={handleSubmit}>
            {/* Username field */}
            <div className="box-field">
              <input
                type="text"
                className={`form-control ${errors.username ? "error" : ""}`}
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
              />
              {errors.username && (
                <div className="error-message">{errors.username}</div>
              )}
            </div>

            {/* Name fields */}
            <div className="box-field__row">
              <div className="box-field">
                <input
                  type="text"
                  className={`form-control ${errors.firstName ? "error" : ""}`}
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                {errors.firstName && (
                  <div className="error-message">{errors.firstName}</div>
                )}
              </div>
              <div className="box-field">
                <input
                  type="text"
                  className={`form-control ${errors.lastName ? "error" : ""}`}
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
                {errors.lastName && (
                  <div className="error-message">{errors.lastName}</div>
                )}
              </div>
            </div>

            {/* Contact fields */}
            <div className="box-field__row">
              <div className="box-field">
                <input
                  type="tel"
                  className={`form-control ${errors.phone ? "error" : ""}`}
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
                {errors.phone && (
                  <div className="error-message">{errors.phone}</div>
                )}
              </div>
              <div className="box-field">
                <input
                  type="email"
                  className={`form-control ${errors.email ? "error" : ""}`}
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {errors.email && (
                  <div className="error-message">{errors.email}</div>
                )}
              </div>
            </div>

            {/* Address field */}
            <div className="box-field">
              <input
                type="text"
                className={`form-control ${errors.address ? "error" : ""}`}
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                required
              />
              {errors.address && (
                <div className="error-message">{errors.address}</div>
              )}
            </div>

            {/* Password fields */}
            <div className="box-field password-field">
              <input
                type={showPassword ? "text" : "password"}
                className={`form-control ${errors.password ? "error" : ""}`}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
                tabIndex="-1"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {errors.password && (
                <div className="error-message">{errors.password}</div>
              )}
              {formData.password && (
                <div
                  className={`password-strength ${passwordStrength.message.toLowerCase()}`}
                >
                  <div
                    className={`password-strength__indicator ${passwordStrength.message.toLowerCase()}`}
                  ></div>
                  <span
                    className={`password-strength__text ${passwordStrength.message.toLowerCase()}`}
                  >
                    {passwordStrength.message}
                  </span>
                </div>
              )}
            </div>

            <div className="box-field password-field">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className={`form-control ${
                  errors.confirmPassword ? "error" : ""
                }`}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={toggleConfirmPasswordVisibility}
                tabIndex="-1"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {errors.confirmPassword && (
                <div className="error-message">{errors.confirmPassword}</div>
              )}
            </div>

            {/* Gender field */}
            <div className="box-field">
              <select
                name="gender"
                className={`form-control ${errors.gender ? "error" : ""}`}
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select Gender
                </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && (
                <div className="error-message">{errors.gender}</div>
              )}
            </div>

            {/* Birth Date field */}
            <div className="box-field">
              <div className="date-field">
                <input
                  type="date"
                  className={`form-control ${errors.birthDate ? "error" : ""}`}
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  required
                />
                <span className="date-icon">
                  <FaCalendarAlt />
                </span>
              </div>
              {errors.birthDate && (
                <div className="error-message">{errors.birthDate}</div>
              )}
            </div>

            {/* Terms and Conditions
            <div className="checkbox-box">
              <label>
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                />
                <span>I agree to the Terms and Conditions</span>
              </label>
              {errors.agreeToTerms && <div className="error-message">{errors.agreeToTerms}</div>}
            </div> */}

            <button className="btn" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <FaSpinner className="icon-spinner" /> Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>

            <div className="registration-form__bottom">
              <span>
                Already have an account?{" "}
                <a onClick={() => router.push("/login")}>Log in</a>
              </span>
            </div>

            {/* <div className="registration-form__social">
              <div className="social-title">
                <span>Or sign up with</span>
              </div>
              <SocialLogin />
            </div> */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Registration;
//
