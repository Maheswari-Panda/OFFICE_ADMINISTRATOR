import React, { useContext, useState } from "react";
import Button from "../components/Button";
import Dashboard from "./Dashboard";
import userContext from "../context/user/userContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const context = useContext(userContext);
  const navigate = useNavigate();

  const {login}=context;

  const [user, setUser] = useState({ email: "", password: "" });

  const handleLogin = async () => {
    const response = await login(user.email, user.password); // Get the auth token or null
  
    if (response) {
      // If login was successful, navigate to the dashboard
      navigate("/dashboard");
    } else {
      // If login failed, show an alert
      alert("Invalid email or password");
    }
  };

  const onChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value }); // Fix spread syntax usage
    // console.log(e.target.name + ": " + e.target.value);

  };

  return (
    <>
      <div className="bg-no-repeat bg-cover bg-center relative">
        <div className="absolute bg-gradient-to-b from-blue-700 to-blue-700 opacity-75 inset-0 z-0"></div>
        <div className="min-h-screen sm:flex sm:flex-row mx-0 justify-center">
          <div className="flex-col flex self-center p-10 sm:max-w-5xl xl:max-w-2xl z-10">
            <div className="self-start hidden lg:flex flex-col text-white">
              <div className="flex items-start mb-3">
                <img
                  src="src/assets/msu_logo_white.png"
                  className="w-[150px] h-[150px] mx-5"
                  alt="Logo"
                />
                {/* <img src="/src/assets/msu_light_logo/android-chrome-512x512.png" className="mr-3 h-16 w-16" alt="Logo" style={{border: "none"}}/> */}
                <div>
                  <h1 className="mb-3 font-bold text-5xl">
                    Office Administrator
                  </h1>
                  <p className="pr-3">
                    Get started with the office Administartor which helps to manage the inward and outward documents easily
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center self-center  z-10">
            <div className="p-12 bg-white mx-auto rounded-2xl w-100 ">
              <div className="mb-4">
                <h3 className="font-semibold text-2xl text-gray-800">
                  Welcome Back!
                </h3>
                <p className="text-gray-500">Login here to get started.</p>
              </div>
              <form action="" onSubmit={(e)=>{e.preventDefault()}}>
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 tracking-wide">
                    Email
                  </label>
                  <input
                    className=" w-full text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                    type="email"
                    name="email"
                    id="email"
                    placeholder="mail@gmail.com"
                    onChange={onChange}
                  />
                </div>
                <div className="space-y-2">
                  <label className="mb-5 text-sm font-medium text-gray-700 tracking-wide">
                    Password
                  </label>
                  <input
                    className="w-full content-center text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Enter your password"
                    onChange={onChange}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember_me"
                      name="remember_me"
                      type="checkbox"
                      className="h-4 w-4 bg-blue-500 focus:ring-blue-400 border-gray-300 rounded"
                      onChange={onChange}
                    />
                    <label
                      htmlFor="remember_me"
                      className="ml-2 block text-sm text-gray-800"
                    >
                      Remember me
                    </label>
                  </div>
                  <div className="text-sm">
                    <a href="/" className="text-blue-400 hover:text-blue-500">
                      Forgot your password?
                    </a>
                  </div>
                </div>
                <div>
                <button
                  type="submit"
                  className="w-full flex justify-center bg-blue-400  hover:bg-blue-500 text-gray-100 p-3  rounded-full tracking-wide font-semibold  shadow-lg cursor-pointer transition ease-in duration-500"
                  onClick={handleLogin}
                >Login</button>
                </div>
              </div>
              </form>
              <div className="pt-5 text-center text-gray-400 text-xs">
                <span>
                  Copyright © 2024-2025 created by Maheswari
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
