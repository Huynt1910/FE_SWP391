import React, { useState } from "react";


import { showToast } from "@utils/toast";
import router from "next/router";
import { useForgotPassword } from "@auth/hook/useForgotPasswordHook";
import { FaEye, FaEyeSlash, FaArrowLeft, FaSpinner } from "react-icons/fa";

export const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  
  const { 
    verifyEmail, 
    isVerifyingEmail, 
    verifyOtp, 
    isVerifyingOtp, 
    changePassword, 
    isChangingPassword 
  } = useForgotPassword();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

 


  const handleResendOtp = async () => {
    try {
      setIsResendingOtp(true);
      showToast.loading("Sending new verification code...");
      
      const result = await verifyEmail(email);
      if (result.success) {
        showToast.success("New verification code sent successfully!");
        setOtp(""); // Clear the previous OTP input
      }
    } catch (error) {
      showToast.error("Failed to send verification code. Please try again.");
    } finally {
      setIsResendingOtp(false);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      showToast.error("Please enter your email address");
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      showToast.error("Please enter a valid email address");
      return;
    }
    
    try {
      const result = await verifyEmail(email);
      if (result.success) {
        setStep(2);
      }
    } catch (error) {
      showToast.error("Failed to send OTP. Please try again.");
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    
    if (!otp) {
      showToast.error("Please enter the verification code");
      return;
    }
    
    try {
      const result = await verifyOtp({ email, otp });
      if (result.success) {
        setStep(3);
      }
    } catch (error) {
      showToast.error("Failed to verify OTP. Please try again.");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      showToast.error("Please enter and confirm your new password");
      return;
    }
    
    if (password.length < 8) {
      showToast.error("Password must be at least 8 characters long");
      return;
    }
    
    if (password !== confirmPassword) {
      showToast.error("Passwords do not match");
      return;
    }
    
    try {
      const result = await changePassword({ 
        email, 
        password, 
        repassword: confirmPassword 
      });
      
      if (result.success) {
        showToast.success("Password reset successful");
        router.push("/login");
      }
    } catch (error) {
      showToast.error("Failed to reset password. Please try again.");
    }
  };

  const renderEmailForm = () => (
    <form onSubmit={handleEmailSubmit} className="forgot-password-form">
      <h3 className="form-title">Forgot Password</h3>
      <p className="form-subtitle">Enter your email to receive a verification code</p>
      
      <div className="box-field">
        <input
          type="email"
          className="form-control"
          placeholder="Email Address"
          value={email}
          onChange={handleEmailChange}
          required
        />
      </div>
      
      <button className="btn" type="submit" disabled={isVerifyingEmail}>
        {isVerifyingEmail ? (
          <>
            <FaSpinner className="icon-spinner spin" /> Sending...
          </>
        ) : (
          "Send Verification Code"
        )}
      </button>
      
      <div className="forgot-password-form__bottom">
        <span>
          Remembered your password?{" "}
          <a onClick={() => router.push("/login")}>Log in</a>
        </span>
      </div>
    </form>
  );

  const renderOtpForm = () => (
    <form onSubmit={handleOtpSubmit} className="forgot-password-form">
      
      <h3 className="form-title">Verify OTP</h3>
      <p className="form-subtitle">Enter the verification code sent to {email}</p>
      
      <div className="box-field">
        <input
          type="text"
          className="form-control"
          placeholder="Verification Code"
          value={otp}
          onChange={handleOtpChange}
          required
        />
      </div>
      
      <button className="btn" type="submit" disabled={isVerifyingOtp}>
        {isVerifyingOtp ? (
          <>
            <FaSpinner className="icon-spinner spin" /> Verifying...
          </>
        ) : (
          "Verify Code"
        )}
      </button>
      
      <div className="resend-otp">
        <span>
          Didn't receive the code?{" "}
          <button
            type="button"
            className="resend-button"
            onClick={handleResendOtp}
            disabled={isResendingOtp}
          >
            {isResendingOtp ? (
              <>
                <FaSpinner className="icon-spinner spin" /> Sending...
              </>
            ) : (
              "Resend Code"
            )}
          </button>
        </span>
        <p className="resend-tip">
          Click 'Resend Code' to get a new verification code in your email
        </p>
      </div>
    </form>
  );

  const renderPasswordForm = () => (
    <form onSubmit={handlePasswordSubmit} className="forgot-password-form">
      
      <h3 className="form-title">Reset Password</h3>
      <p className="form-subtitle">Create a new password for your account</p>
      
      <div className="box-field password-field">
        <input
          type={showPassword ? "text" : "password"}
          className="form-control"
          placeholder="New Password"
          value={password}
          onChange={handlePasswordChange}
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
      </div>
      
      <div className="box-field password-field">
        <input
          type={showConfirmPassword ? "text" : "password"}
          className="form-control"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
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
      </div>
      
      <button className="btn" type="submit" disabled={isChangingPassword}>
        {isChangingPassword ? (
          <>
            <FaSpinner className="icon-spinner spin" /> Resetting...
          </>
        ) : (
          "Reset Password"
        )}
      </button>
    </form>
  );

  return (
    <>
      {/* <!-- BEGIN FORGOT PASSWORD --> */}
      <div className="forgot-password">
        <div className="wrapper">
          <div
            className="forgot-password-form js-img"
            style={{
              backgroundImage: `url('/assets/img/forgot-password-form__bg.png')`,
            }}
          >
            {step === 1 && renderEmailForm()}
            {step === 2 && renderOtpForm()}
            {step === 3 && renderPasswordForm()}
          </div>
        </div>
      </div>
      {/* <!-- FORGOT PASSWORD EOF --> */}
    </>
  );
};