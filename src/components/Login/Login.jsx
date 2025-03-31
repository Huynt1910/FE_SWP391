import { useSignIn } from "@auth/hook/useSinginHook";
import { SocialLogin } from "@components/shared/SocialLogin/SocialLogin";
import { showToast } from "@utils/toast";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";
import { ROLES, ACTIONS } from "@/lib/api-client/constant";
import { setAuthData } from "@/utils/auth";

export const Login = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });

  const { signIn, isPending } = useSignIn();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSuccessfulAuth = (response) => {
    // console.log("Authentication response:", response);
    
    // If we have a response with a token, proceed with login
    if (response?.result?.token) {
      // Lưu token và role
      setAuthData(
        response.result.token,
        response.result.role,
        formData.rememberMe ? 30 : 1
      );

      // Get return URL from query parameters or default to a route based on role
      const returnUrl = router.query.returnUrl;
      
      if (returnUrl) {
        router.push(returnUrl);
      } else {
        // Chuyển hướng dựa trên role
        switch (response.result.role.toUpperCase()) {
          case ROLES.ADMIN:
            router.push("/admin/dashboard");
            break;
          case ROLES.STAFF:
            router.push("/admin/dashboard");
            break;
          case ROLES.THERAPIST:
            router.push("/admin/therapist-schedule");
            break;
          case ROLES.CUSTOMER:
            router.push("/");
            break;
          default:
            console.error("Unknown role:", response.result.role);
            router.push("/");
        }
      }
    } else {
      console.error("Invalid response format - missing token");
      showToast("Login failed - invalid response from server", "error");
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    console.log("Submitting login form:", {
      username: formData.username.trim(),
      password: "********", // Hide password in logs
    });

    try {
      const response = await signIn({
        username: formData.username.trim(),
        password: formData.password,
      });

      // If login failed, display a specific toast message for incorrect credentials
      if (!response.success) {
        // showToast("Wrong username or password. Please try again.", "error");
        return;
      }

      handleSuccessfulAuth(response);
    } catch (error) {
      console.error("Login error:", error);
      // All error handling is now in the hook
    }
  };

  return (
    <>
      {/* <!-- BEGIN LOGIN --> */}
      <div className="login">
        <div className="wrapper">
          <div
            className="login-form js-img"
            style={{ backgroundImage: `url('/assets/img/login-form__bg.png')` }}
          >
            <form onSubmit={handleSubmit}>
              <h3>Login</h3>
              <SocialLogin onAuthSuccess={handleSuccessfulAuth} />

              <div className="box-field">
                <input
                  type="text"
                  name="username"
                  className="form-control"
                  placeholder="Enter your username"
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
                {/* <span className="checkmark"></span>
                Remember me */}
              </label>
              <button className="btn" type="submit" disabled={isPending}>
                {isPending ? "Logging in..." : "Log in"}
              </button>
              <div className="login-form__bottom">
                <span>
                  No account? <a href="/registration">Register</a>
                </span>
                <a href="/forgot-password">Lost your password?</a>
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
      {/* <!-- LOGIN EOF   --> */}
    </>
  );
};
