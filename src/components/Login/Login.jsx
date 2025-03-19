import { useSignIn } from "@auth/hook/useSinginHook";
import { SocialLogin } from "@components/shared/SocialLogin/SocialLogin";
import { showToast } from "@utils/toast";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { setCookie } from "cookies-next";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

    try {
      const response = await signIn({
        username: formData.username,
        password: formData.password,
      });

      if (response.success) {
        showToast("Login successful!", "success");

        // Redirect based on role
        if (response.role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/");
        }
      }
    } catch (error) {
      showToast("Invalid username or password", "error");
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
