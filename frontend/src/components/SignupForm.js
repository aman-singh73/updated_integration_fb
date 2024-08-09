import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import axios from 'axios';

const SignupForm = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [userdata, setUserData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmpassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const changeHandler = (event) => {
    const { name, value } = event.target;
    setUserData({ ...userdata, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!userdata.email.trim()) {
      newErrors.email = "Please enter an email";
    } else if (!userdata.email.includes("@") || !userdata.email.includes(".")) {
      newErrors.email = "Invalid email format";
    }
    if (!userdata.password.trim()) {
      newErrors.password = "Please enter a password";
    } else if (userdata.password.length < 8) {
      newErrors.password = "Password should be at least 8 characters long";
    }
    if (!userdata.confirmpassword.trim()) {
      newErrors.confirmpassword = "Please confirm your password";
    } else if (userdata.password !== userdata.confirmpassword) {
      newErrors.confirmpassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (validateForm()) {
      const signupData = {
        firstname: userdata.firstname,
        lastname: userdata.lastname,
        email: userdata.email,
        password: userdata.password
      };
      axios.post('http://localhost:5000/api/signup', signupData)
        .then(response => {
          setIsLoggedIn(true);
          toast.success("Account created successfully");
          navigate("/dashboard");
        })
        .catch(error => {
          if (error.response && error.response.data && error.response.data.error) {
            toast.error(error.response.data.error);
          } else {
            toast.error("Signup failed");
          }
        });
    }
  };

return (
  <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
    <h2 className="text-2xl font-bold mb-6 text-center">Create an Account</h2>
    <form onSubmit={submitHandler} className="space-y-4">
      <div className="flex space-x-4">
        <label className="w-1/2 block">
          <p className="mb-1 text-sm font-medium">First name <sup className="text-red-500">*</sup></p>
          <input
            type="text"
            placeholder="Enter your first name"
            onChange={changeHandler}
            name="firstname"
            value={userdata.firstname}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.firstname && <p className="text-red-500 text-xs mt-1">{errors.firstname}</p>}
        </label>
        <label className="w-1/2 block">
          <p className="mb-1 text-sm font-medium">Last name <sup className="text-red-500">*</sup></p>
          <input
            type="text"
            placeholder="Enter your last name"
            onChange={changeHandler}
            name="lastname"
            value={userdata.lastname}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.lastname && <p className="text-red-500 text-xs mt-1">{errors.lastname}</p>}
        </label>
      </div>
      <label className="block">
        <p className="mb-1 text-sm font-medium">Email Address <sup className="text-red-500">*</sup></p>
        <input
          type="email"
          placeholder="Enter your email"
          onChange={changeHandler}
          name="email"
          value={userdata.email}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </label>
      <div className="flex space-x-4">
        <label className="w-1/2 block">
          <p className="mb-1 text-sm font-medium">Set Password <sup className="text-red-500">*</sup></p>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              onChange={changeHandler}
              name="password"
              value={userdata.password}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-3 cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </label>
        <label className="w-1/2 block">
          <p className="mb-1 text-sm font-medium">Confirm Password <sup className="text-red-500">*</sup></p>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm password"
              onChange={changeHandler}
              name="confirmpassword"
              value={userdata.confirmpassword}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-3 cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>
          {errors.confirmpassword && <p className="text-red-500 text-xs mt-1">{errors.confirmpassword}</p>}
        </label>
      </div>
      <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300">
        Create Account
      </button>
    </form>
    <ToastContainer />
  </div>
);
};

export default SignupForm;
