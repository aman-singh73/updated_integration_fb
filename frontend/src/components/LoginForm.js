import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import axios from 'axios';

export default function LoginForm({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  function changeHandler(event) {
    setFormData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }));
  }

  function submitHandler(event) {
    event.preventDefault();
    axios.post('http://127.0.0.1:5000/api/login', formData, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        setIsLoggedIn(true);
        toast.success("Logged in successfully");
        navigate("/dashboard");
      })
      .catch(error => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          toast.error(error.response.data.error || "Login failed");
        } else if (error.request) {
          // The request was made but no response was received
          toast.error("No response from server");
        } else {
          // Something happened in setting up the request that triggered an Error
          toast.error("Error in request setup");
        }
      });
  }


return (
  <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
    <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
    <form onSubmit={submitHandler} className="space-y-4">
      <label className="block">
        <p className="mb-1 text-sm font-medium">Email Address <sup className="text-red-500">*</sup></p>
        <input
          required
          type='email'
          onChange={changeHandler}
          placeholder='Enter your email'
          value={formData.email}
          name='email'
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </label>
      <label className="block">
        <p className="mb-1 text-sm font-medium">Password <sup className="text-red-500">*</sup></p>
        <div className="relative">
          <input
            required
            type={showPassword ? "text" : "password"}
            onChange={changeHandler}
            placeholder='Enter your password'
            value={formData.password}
            name='password'
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-3 cursor-pointer"
          >
            {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </span>
        </div>
        <Link to="#" className="text-blue-500 text-sm hover:underline">Forgot password?</Link>
      </label>
      <button className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300">
        Sign in
      </button>
    </form>
    <ToastContainer />
  </div>
);
}