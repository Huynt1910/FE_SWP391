import { useStaffSignIn } from "@auth/hook/useStaffSignInHook";
import { showToast } from "@utils/toast";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export const StaffLogin = () => {
  const router = useRouter();
  
  useEffect(() => {
    console.log("StaffLogin component mounted");
    // Clear any existing auth tokens to prevent redirect loops
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "userRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }, []);
  
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });

  const { staffSignIn, isPending } = useStaffSignIn();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await staffSignIn({
        username: formData.username,
        password: formData.password,
      });
    } catch (error) {
      showToast.error("An error occurred during login. Please try again.");
      console.error("Staff login error:", error);
    }
  };

  return (
    <>
      {/* <!-- BEGIN STAFF LOGIN --> */}
      <div className="login">
        <div className="wrapper">
          <div
            className="login-form js-img"
            style={{ backgroundImage: `url('/assets/img/login-form__bg.png')` }}
          >
            <form onSubmit={handleSubmit}>
              <h3>Staff Login</h3>
              
              <div className="box-field">
                <input
                  type="text"
                  name="username"
                  className="form-control"
                  placeholder="Enter your staff username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="box-field">
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <label className="checkbox-box checkbox-box__sm">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                />
                <span className="checkmark"></span>
                Remember me
              </label>
              <button className="btn" type="submit" disabled={isPending}>
                {isPending ? "Logging in..." : "Staff Log in"}
              </button>
              <div className="login-form__bottom">
                <span>
                  <a href="/login-selection">Back to role selection</a>
                </span>
                <a href="/forgot-password">
                  Lost your password?
                </a>
              </div>
            </form>
          </div>
        </div>
        <img
          className="promo-video__decor js-img"
          src="/assets/img/promo-video__decor.jpg"
          alt=""
        />
      </div>
      {/* <!-- STAFF LOGIN EOF   --> */}
    </>
  );
}; 