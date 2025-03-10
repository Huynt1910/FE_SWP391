import { useState } from "react";
import { showToast } from "@utils/toast";
import router from "next/router";
import { useForgotPassword } from "@auth/hook/useForgotPasswordHook";

export const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  
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

  const handleRepasswordChange = (e) => {
    setRepassword(e.target.value);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
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
    
    if (password !== repassword) {
      showToast.error("Passwords do not match");
      return;
    }
    
    try {
      const result = await changePassword({ email, password, repassword });
      if (result.success) {
        showToast.success("Password reset successful");
        router.push("/login");
      }
    } catch (error) {
      showToast.error("Failed to reset password. Please try again.");
    }
  };

  const renderEmailForm = () => (
    <form onSubmit={handleEmailSubmit}>
      <h3>Forgot Password</h3>
      <p className="mb-4">Enter your email to receive a verification code</p>
      <div className="box-field">
        <input
          type="email"
          name="email"
          className="form-control"
          placeholder="Enter your email"
          value={email}
          onChange={handleEmailChange}
          required
        />
      </div>
      <button className="btn" type="submit" disabled={isVerifyingEmail}>
        {isVerifyingEmail ? "Sending..." : "Send Verification Code"}
      </button>
      <div className="forgot-password-form__bottom">
        Remembered your password?{" "}
        <a onClick={() => router.push("/login")}>Log in</a>
      </div>
    </form>
  );

  const renderOtpForm = () => (
    <form onSubmit={handleOtpSubmit}>
      <h3>Verify OTP</h3>
      <p className="mb-4">Enter the verification code sent to your email</p>
      <div className="box-field">
        <input
          type="text"
          name="otp"
          className="form-control"
          placeholder="Enter verification code"
          value={otp}
          onChange={handleOtpChange}
          required
        />
      </div>
      <button className="btn" type="submit" disabled={isVerifyingOtp}>
        {isVerifyingOtp ? "Verifying..." : "Verify Code"}
      </button>
      <div className="forgot-password-form__bottom">
        <a onClick={() => setStep(1)}>Back to Email</a>
      </div>
    </form>
  );

  const renderPasswordForm = () => (
    <form onSubmit={handlePasswordSubmit}>
      <h3>Reset Password</h3>
      <p className="mb-4">Enter your new password</p>
      <div className="box-field">
        <input
          type="password"
          name="password"
          className="form-control"
          placeholder="New password"
          value={password}
          onChange={handlePasswordChange}
          required
        />
      </div>
      <div className="box-field">
        <input
          type="password"
          name="repassword"
          className="form-control"
          placeholder="Confirm new password"
          value={repassword}
          onChange={handleRepasswordChange}
          required
        />
      </div>
      <button className="btn" type="submit" disabled={isChangingPassword}>
        {isChangingPassword ? "Resetting..." : "Reset Password"}
      </button>
      <div className="forgot-password-form__bottom">
        <a onClick={() => setStep(2)}>Back to Verification</a>
      </div>
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
