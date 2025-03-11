import { useRouter } from "next/router";
import { useState } from "react";

export const LoginSelection = () => {
  return (
    <>
      {/* <!-- BEGIN LOGIN SELECTION --> */}
      <div className="login">
        <div className="wrapper">
          <div
            className="login-form js-img"
            style={{ backgroundImage: `url('/assets/img/login-form__bg.png')` }}
          >
            <div className="login-selection">
              <h3>Choose Your Role</h3>
              <p className="text-center mb-4">Please select your role to access the appropriate login page</p>
              
              <div className="login-options">
                <a href="/login" className="btn btn-primary mb-4 w-100">
                  <i className="icon-user mr-2"></i>
                  Customer Login
                </a>
                
                <a href="/staff-login" className="btn btn-secondary mb-4 w-100">
                  <i className="icon-briefcase mr-2"></i>
                  Staff Login
                </a>
                
                <a href="/therapist-login" className="btn btn-tertiary w-100">
                  <i className="icon-medical mr-2"></i>
                  Therapist Login
                </a>
              </div>
              
              <div className="login-form__bottom mt-4">
                <span>
                  No account? <a href="/registration">Register</a>
                </span>
              </div>
            </div>
          </div>
        </div>
        <img
          className="promo-video__decor js-img"
          src="/assets/img/promo-video__decor.jpg"
          alt=""
        />
      </div>
      {/* <!-- LOGIN SELECTION EOF   --> */}
    </>
  );
}; 