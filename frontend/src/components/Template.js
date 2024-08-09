import React from 'react';
import SignupForm from './SignupForm';
import LoginForm from './LoginForm';
import { FaGoogle } from "react-icons/fa";


export default function Template({ formtype, setIsLoggedIn }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded shadow-lg">
        {formtype === "signup" ? (
          <SignupForm setIsLoggedIn={setIsLoggedIn} />
        ) : (
          <LoginForm setIsLoggedIn={setIsLoggedIn} />
        )}
        <div className="text-center my-4">OR</div>
        <button className="w-full flex items-center justify-center bg-red-600 text-white py-2 rounded">
          <FaGoogle className="mr-2" />
          <p>Sign up with Google</p>
        </button>
      </div>
    </div>
  );
}