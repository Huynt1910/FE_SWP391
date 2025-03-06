import { useState } from "react";
import { showToast } from "@utils/toast";
import router from "next/router";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPending(true);
  };

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
            <form onSubmit={handleSubmit}>
              <h3>Forgot Password</h3>
              <div className="box-field">
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={email}
                  onChange={handleChange}
                  required
                />
              </div>
              <button className="btn" type="submit" disabled={isPending}>
                {isPending ? "Sending..." : "Submit"}
              </button>
              <div className="forgot-password-form__bottom">
                Remembered your password?{" "}
                <a onClick={() => router.push("/login")}>Log in</a>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* <!-- FORGOT PASSWORD EOF --> */}
    </>
  );
};
