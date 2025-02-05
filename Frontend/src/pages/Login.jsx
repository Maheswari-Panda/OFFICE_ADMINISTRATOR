import React, { useContext, useState } from "react";
import Button from "../components/Button";
import userContext from "../context/user/userContext";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";

function Login() {
  const context = useContext(userContext);
  const navigate = useNavigate();
  const generatedCaptcha = Math.random().toString(36).slice(8);
  const [captcha, setCaptcha] = useState(generatedCaptcha);

  const { login } = context;

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      enteredCaptcha: "",
    },
    validate: (values) => {
      const errors = {};
      
      // Email Validation
      if (!values.email) {
        errors.email = "Email is required!";
      }

      // Password Validation
      if (!values.password) {
        errors.password = "Password is required!";
      } else if (values.password.length < 6) {
        errors.password = "Password must be at least 6 characters!";
      } else if (!/[A-Z]/.test(values.password)) {
        errors.password = "Password must contain at least one uppercase letter!";
      } else if (!/[a-z]/.test(values.password)) {
        errors.password = "Password must contain at least one lowercase letter!";
      } else if (!/\d/.test(values.password)) {
        errors.password = "Password must contain at least one number!";
      } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(values.password)) {
        errors.password = "Password must contain at least one special character!";
      }

      // Captcha Validation
      if (values.enteredCaptcha !== captcha) {
        errors.enteredCaptcha = "Invalid Captcha!";
      }

      return errors;
    },
    onSubmit: async (values) => {
      const response = await login(values.email, values.password);
      if (response) {
        navigate("/dashboard");
      } else {
        alert("Invalid email or password");
      }
    },
  });

  const refreshCaptcha = () => {
    setCaptcha(Math.random().toString(36).slice(8));
  };

  return (
    <div className="bg-no-repeat bg-cover bg-center relative">
      <div className="absolute bg-gradient-to-b from-blue-700 to-blue-700 opacity-75 inset-0 z-0"></div>
      <div className="min-h-screen flex flex-col sm:flex-row mx-0 justify-center">
        <div className="flex-col flex self-center p-6 sm:p-10 sm:max-w-5xl xl:max-w-2xl z-10">
          <div className="self-start hidden lg:flex flex-col text-white">
            <div className="flex items-start mb-3">
              <img
                src="src/assets/msu_logo_white.png"
                className="w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] mx-5"
                alt="Logo"
              />
              <div>
                <h1 className="mb-3 font-bold text-4xl sm:text-5xl">
                  Office Administrator
                </h1>
                <p className="pr-3 text-sm sm:text-base">
                  Get started with the office Administrator, which helps to
                  manage the inward and outward documents easily.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center self-center z-10 px-4 sm:px-6">
          <div className="p-6 sm:p-8 bg-white mx-auto rounded-2xl w-full sm:w-[280px] md:w-[300px] lg:w-[400px]">
            <div className="mb-4">
              <h3 className="font-semibold text-2xl text-gray-800">
                Welcome Back!
              </h3>
              <p className="text-gray-500">Login here to get started.</p>
            </div>
            <form onSubmit={formik.handleSubmit}>
              <div className="space-y-5">
                {/* Email Input */}
                <div className="space-y-2">
                  <label className="flex justify-between text-sm font-medium text-gray-700 tracking-wide">
                    Email
                    {formik.errors.email && formik.touched.email && (
                      <span className="label-text-alt text-red-500">
                        {formik.errors.email}
                      </span>
                    )}
                  </label>
                  <input
                    className="w-full text-base px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                    type="email"
                    name="email"
                    placeholder="mail@gmail.com"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                  />
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <label className="flex justify-between text-sm font-medium text-gray-700 tracking-wide">
                    Password
                    {formik.errors.password && formik.touched.password && (
                      <span className="label-text-alt text-red-500">
                        {formik.errors.password}
                      </span>
                    )}
                  </label>
                  <input
                    className="w-full content-center text-base px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                  />
                </div>

                {/* Captcha Section */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <label className="input input-bordered w-32 sm:w-40 flex bg-blue-100 items-center mx-1">
                      <input
                        type="text"
                        value={captcha}
                        className="w-20 sm:w-32"
                        readOnly
                      />
                      <i
                        className="fa-solid fa-rotate-right text-blue-500"
                        onClick={refreshCaptcha}
                      ></i>
                    </label>
                  </div>
                  <div className="text-sm">
                    <input
                      type="text"
                      name="enteredCaptcha"
                      placeholder="Enter Captcha"
                      className="input input-bordered w-32 sm:w-40 mx-1"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.enteredCaptcha}
                    />
                  </div>
                </div>
                {formik.errors.enteredCaptcha &&
                  formik.touched.enteredCaptcha && (
                    <span className="text-red-500 text-sm">
                      {formik.errors.enteredCaptcha}
                    </span>
                  )}

                {/* Forgot Password Link */}
                <div className="flex items-center justify-center">
                  <div className="text-sm">
                    <a
                      href="/"
                      className="text-blue-400 hover:text-blue-500"
                    >
                      Forgot your password?
                    </a>
                  </div>
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center bg-blue-400 hover:bg-blue-500 text-gray-100 p-3 rounded-full tracking-wide font-semibold shadow-lg cursor-pointer transition ease-in duration-500"
                  >
                    Login
                  </button>
                </div>
              </div>
            </form>

            {/* Footer Text */}
            <div className="pt-5 text-center text-gray-400 text-xs sm:text-sm">
              <span>Copyright © 2024-2025 created by Maheswari</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
