import React from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Navbar({ isLoggedIn, setIsLoggedIn }) {
  return (
    <div className='flex justify-between items-center p-4 bg-gray-800 text-white'>
      {/* Logo Section */}
      <div className="flex items-center">
        <div className="h-10 mr-4">
          </div>
        <span className="text-xl font-bold">SolarEstimate</span>
      </div>

      <nav className='flex-grow'>
        <ul className='flex justify-center gap-4'>
          <li>
            <Link to="/" className="px-4 py-2 bg-blue-400 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 shadow-md font-normal">
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" className="px-4 py-2 bg-blue-400 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 shadow-md font-normal">
              About us
            </Link>
          </li>
          <li>
            <Link to="/contact" className="px-4 py-2 bg-blue-400 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 shadow-md font-normal">
              Contact
            </Link>
          </li>
        </ul>
      </nav>
      
      <div className='flex gap-x-3'>
        {!isLoggedIn &&
          <>
            <Link to="/login">
              <button className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600">
                Login
              </button>
            </Link>
            <Link to="/signup">
              <button className="bg-green-500 px-4 py-2 rounded hover:bg-green-600">
                Sign up
              </button>
            </Link>
          </>
        }
        {isLoggedIn &&
          <>
            <button onClick={() => { setIsLoggedIn(false); toast.success("Logged out"); }} className="bg-red-500 px-4 py-2 rounded hover:bg-red-600">
              Log out
            </button>
            <Link to="/dashboard">
              <button className="bg-yellow-500 px-4 py-2 rounded hover:bg-yellow-600">
                Dashboard
              </button>
            </Link>
          </>
        }
      </div>
      <ToastContainer />
    </div>
  );
}