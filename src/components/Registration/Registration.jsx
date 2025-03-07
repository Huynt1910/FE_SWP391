import { SocialLogin } from "@components/shared/SocialLogin/SocialLogin";
import { useState } from "react";
import router from "next/router";
<<<<<<< HEAD
import { useSignUp } from "@auth/hook/useSingupHook"; // Adjust the import path accordingly
=======
import { useSignUp } from "@/auth/hook/useSingupHook";
>>>>>>> 036e585c0a1989822418855a48b6b136afee7f46

export const Registration = () => {
  const { signUp, isPending } = useSignUp();
  const [formData, setFormData] = useState({
<<<<<<< HEAD
=======
    username: "",
>>>>>>> 036e585c0a1989822418855a48b6b136afee7f46
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
<<<<<<< HEAD
    password: "",
    confirmPassword: "",
    gender: "", // Add gender field
=======
    address: "",
    password: "",
    confirmPassword: "",
    gender: "",
    birthDate: "", // Add birthDate field
>>>>>>> 036e585c0a1989822418855a48b6b136afee7f46
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

<<<<<<< HEAD
  const handleSubmit = async (e) => {
=======
  const handleSubmit = (e) => {
>>>>>>> 036e585c0a1989822418855a48b6b136afee7f46
    e.preventDefault();

    // Validate that passwords match
    if (formData.password !== formData.confirmPassword) {
      return alert("Passwords do not match!");
    }

<<<<<<< HEAD
    try {
      await signUp({
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
        gender: formData.gender, // Include gender in the sign-up data
      });
      alert("Please check your email to verify your account."); // Notify user
    } catch (error) {
      console.error("Sign up error:", error);
    }
=======
    const payload = { ...formData };
    delete payload.confirmPassword;
    signUp(payload);
>>>>>>> 036e585c0a1989822418855a48b6b136afee7f46
  };

  return (
    <>
      {/* <!-- BEGIN REGISTRATION --> */}
      <div className="login registration">
        <div className="wrapper">
          <div className="login-form js-img">
            <form onSubmit={handleSubmit}>
              <h3>Register Now</h3>
              <SocialLogin />

              <div className="box-field__row">
                <div className="box-field">
                  <input
                    type="text"
                    className="form-control"
<<<<<<< HEAD
                    name="firstName"
                    placeholder="Enter your username"
=======
                    name="username"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="box-field">
                  <input
                    type="text"
                    className="form-control"
                    name="firstName"
                    placeholder="Enter your first name"
>>>>>>> 036e585c0a1989822418855a48b6b136afee7f46
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="box-field">
                  <input
                    type="text"
                    className="form-control"
                    name="lastName"
                    placeholder="Enter your last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
<<<<<<< HEAD
=======
                <div className="box-field">
                  <input
                    type="text"
                    className="form-control"
                    name="address"
                    placeholder="Enter your address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>
>>>>>>> 036e585c0a1989822418855a48b6b136afee7f46
              </div>
              <div className="box-field__row">
                <div className="box-field">
                  <input
                    type="tel"
                    className="form-control"
                    name="phone"
                    placeholder="Enter your phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="box-field">
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="box-field__row">
                <span>Password</span>
                <div className="box-field">
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="box-field">
                  <input
                    type="password"
                    className="form-control"
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Gender Selection as a Dropdown */}
              <div className="box-field__row">
                <span>Gender</span>
                <div className="box-field">
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    className="form-control"
                  >
                    <option value="" aria-disabled>
                      Select your gender ?
                    </option>
<<<<<<< HEAD

                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
=======
                    <option value="Male">Male</option>
                    <option value="Memale">Female</option>
                    <option value="Other">Other</option>
>>>>>>> 036e585c0a1989822418855a48b6b136afee7f46
                  </select>
                </div>
              </div>

<<<<<<< HEAD
=======
              {/* Birth Date Field */}
              <div className="box-field__row">
                <div className="box-field">
                  <input
                    type="date"
                    className="form-control"
                    name="birthDate"
                    placeholder="Enter your birth date"
                    value={formData.birthDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

>>>>>>> 036e585c0a1989822418855a48b6b136afee7f46
              <button className="btn" type="submit" disabled={isPending}>
                {isPending ? "Registering..." : "Register"}
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
