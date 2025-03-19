import { SocialLogin } from "@components/shared/SocialLogin/SocialLogin";
import { useState } from "react";
import router from "next/router";
import { useSignUp } from "@/auth/hook/useSingupHook";
import { showToast } from "@utils/toast";
import { FaEye, FaEyeSlash, FaCalendarAlt } from "react-icons/fa";

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
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    
    // Terms validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast("Please fix the errors in the form", "error");
      return;
    }

    try {
      // Format the data according to the API requirements
      const payload = {
        username: formData.username,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        gender: formData.gender,
        birthDate: formData.birthDate // API expects YYYY-MM-DD format
      };
      
      const result = await signUp(payload);
      
      if (result.success) {
        // Show success message
        showToast("Registration successful! Please log in.", "success");
        
        // Short delay before redirect to ensure toast is seen
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } else {
        // Handle specific field errors
        if (result.field) {
          setErrors(prev => ({
            ...prev,
            [result.field]: result.error
          }));
          
          // Scroll to the field with error
          const element = document.querySelector(`[name="${result.field}"]`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.focus();
          }
        } else {
          // General error
          showToast(result.error || "Registration failed. Please try again.", "error");
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      showToast("An unexpected error occurred. Please try again.", "error");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <>
      {/* <!-- BEGIN REGISTRATION --> */}
      <div className="login registration">
        <div className="wrapper">
          <div className="login-form">
            <form onSubmit={handleSubmit}>
              <h3 className="form-title">Register Now</h3>
              <SocialLogin />

              {/* Username field - Full width */}
              <div className="box-field__row full-width">
                <div className="box-field full-width">
                  <input
                    type="text"
                    className={`form-control ${errors.username ? "is-invalid" : ""}`}
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                  {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                </div>
              </div>

              {/* Name fields */}
              <div className="box-field__row two-fields">
                <div className="box-field">
                  <input
                    type="text"
                    className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                  {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                </div>
                <div className="box-field">
                  <input
                    type="text"
                    className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                  {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                </div>
              </div>

              {/* Address field */}
              <div className="box-field__row full-width">
                <div className="box-field full-width">
                  <input
                    type="text"
                    className={`form-control ${errors.address ? "is-invalid" : ""}`}
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                  {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                </div>
              </div>

              {/* Contact fields */}
              <div className="box-field__row two-fields">
                <div className="box-field">
                  <input
                    type="tel"
                    className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                  {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                </div>
                <div className="box-field">
                  <input
                    type="email"
                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
              </div>

              {/* Password section */}
              <div className="form-section">
                <div className="section-label">Password</div>
                <div className="box-field__row full-width">
                  <div className="box-field password-field full-width">
                    <input
                      type={showPassword ? "text" : "password"}
                      className={`form-control ${errors.password ? "is-invalid" : ""}`}
                      name="password"
                      placeholder="Enter your password"
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
                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                    {formData.password && (
                      <div className={`password-strength ${passwordStrength.message.toLowerCase()}`}>
                        Password strength: {passwordStrength.message}
                      </div>
                    )}
                  </div>
                </div>
                <div className="box-field__row full-width">
                  <div className="box-field password-field full-width">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                      name="confirmPassword"
                      placeholder="Confirm password"
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
                    {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                  </div>
                </div>
              </div>

              {/* Gender Selection */}
              <div className="form-section">
                <div className="section-label">Gender</div>
                <div className="box-field__row full-width">
                  <div className="box-field full-width">
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      required
                      className={`form-control ${errors.gender ? "is-invalid" : ""}`}
                    >
                      <option value="" disabled>
                        Select your gender
                      </option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.gender && <div className="invalid-feedback">{errors.gender}</div>}
                  </div>
                </div>
              </div>

              {/* Birth Date Field */}
              <div className="form-section">
                <div className="section-label">Birth Date</div>
                <div className="box-field__row full-width">
                  <div className="box-field date-field full-width">
                    <input
                      type="date"
                      className={`form-control ${errors.birthDate ? "is-invalid" : ""}`}
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleChange}
                      required
                      placeholder="dd/mm/yyyy"
                    />
                    <span className="date-icon"><FaCalendarAlt /></span>
                    {errors.birthDate && <div className="invalid-feedback">{errors.birthDate}</div>}
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="box-field__row">
                <div className="box-field checkbox-field">
                  <label className={errors.agreeToTerms ? "has-error" : ""}>
                    <input
                      type="checkbox"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleChange}
                    />
                    <span>I Agree To The Terms And Conditions</span>
                  </label>
                  {errors.agreeToTerms && <div className="invalid-feedback">{errors.agreeToTerms}</div>}
                </div>
              </div>

              <button className="register-btn" type="submit" disabled={isPending}>
                {isPending ? "REGISTERING..." : "REGISTER"}
              </button>
              <div className="login-form__bottom">
                <span>
                  Already have an account?{" "}
                  <a onClick={() => router.push("/login")}>Log in</a>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* <!-- REGISTRATION EOF --> */}
    </>
  );
};