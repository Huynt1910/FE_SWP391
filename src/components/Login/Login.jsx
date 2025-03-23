import { useSignIn } from "@/auth/hook/useSinginHook";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";
import { ROLES } from "@/lib/api-client/constant";
import { setAuthData } from "@/utils/auth";
import { SocialLogin } from "../shared/SocialLogin/SocialLogin";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting login form:", formData); // Debug log

    try {
      const response = await signIn({
        username: formData.username.trim(),
        password: formData.password,
      });

      console.log("Login response:", response); // Debug log

      if (response?.result?.token) {
        // Store auth data using the utility function
        setAuthData(
          response.result.token,
          response.result.role,
          formData.rememberMe ? 30 : 1
        );

        toast.success("Login successful!");

        // Redirect based on role
        switch (response.result.role.toUpperCase()) {
          case ROLES.ADMIN:
            router.push("/admin/dashboard");
            break;
          case ROLES.STAFF:
            router.push("/admin/bookings");
            break;
          case ROLES.THERAPIST:
            router.push("/admin/schedules");
            break;
          case ROLES.CUSTOMER:
            router.push("/");
            break;
          default:
            console.error("Unknown role:", response.result.role);
            router.push("/");
        }
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Login failed. Please try again."
      );
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
              <SocialLogin />

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
                <span className="checkmark"></span>
                Remember me
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
