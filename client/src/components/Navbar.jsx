import React, { useContext, useState, useEffect, useRef } from 'react';
import { assets } from '../assets/assets.js';
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../context/appContext.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';

function Navbar() {
  const navigate = useNavigate();
  const { userData, backendUrl, setUserData, setIsLoggedin } = useContext(AppContent);

  // State for drawer visibility
  const [menuOpen, setMenuOpen] = useState(false);

  // Reference to drawer menu (used for outside click detection)
  const menuRef = useRef(null);

  // OTP sending cooldown (in seconds)
  const [cooldown, setCooldown] = useState(0);
  const [isSending, setIsSending] = useState(false);

  // Function to send email verification OTP
  const sendVerificationOtp = async () => {
    if (cooldown > 0 || isSending) return;

    try {
      setIsSending(true);
      axios.defaults.withCredentials = true;

      const { data } = await axios.post(backendUrl + '/api/auth/send-verify-otp');

      if (data.success) {
        toast.success(data.message);
        navigate('/email-verify');
        setCooldown(10); // start cooldown
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSending(false);
    }
  };

  // Countdown logic for OTP cooldown
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  // Logout function
  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + '/api/auth/logout');

      if (data.success) {
        toast.success(data.message);
        setIsLoggedin(false);
        setUserData(null);
        setTimeout(() => navigate('/'), 100); // navigate after logout
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Close drawer if clicking outside of it
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : 'auto';
  }, [menuOpen]);

  return (
    <>
      {/* Navigation Container */}
      <div className="w-full flex justify-between items-center bg-transparent relative">
        {/* Left Side: Logo */}
        <img
          src={assets.logo}
          alt="Logo"
          className="w-16 sm:w-24 cursor-pointer ms-2 "
          onClick={() => navigate('/')}
        />
        {/* Right Side: User Profile / Login Button */}
        {userData ? (
          <div className="relative z-500">
            
            {/* Profile Initial (username first letter) Button */}
            <div
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-12 h-10 sm:w-16 sm:h-12 flex justify-center items-center
              text-gray-900  font-semibold rounded-lg bg-gray-100 hover:bg-zinc-300 transition-all cursor-pointer mb-3 me-4"
            >
              <span className="text-xl select-none">{userData.name[0].toUpperCase()}</span>
              {/*  Blue Tick if Verified */}
              {userData.isAccountVerified && (
                <sup className="text-blue-800 ml-1">
                  <i className="bi bi-patch-check-fill"></i>
                </sup>
              )}
            </div>

            {/* Background Blur (Overlay) */}
            {menuOpen && (
              <div
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                onClick={() => setMenuOpen(false)}
              ></div>
            )}

            {/* Sliding Drawer Panel */}
            <div
              ref={menuRef}
              className={`fixed top-0 right-0 h-screen w-48 sm:w-60 bg-white dark:bg-neutral-200 shadow-lg border-l border-gray-200 dark:border-gray-600 z-100 transform transition-transform duration-300 ease-in-out ${
                menuOpen ? 'translate-x-0' : 'translate-x-full'
              }`}
            >
              <div className="p-4 h-full flex flex-col">
                {/* Close (X) Button */}
                <div className="flex justify-end mb-4">
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="text-gray-700 dark:text-black hover:text-red-600 transition-all text-xl"
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>

                {/* Navigation Links */}
                <ul className="flex flex-col gap-4 text-[15px] font-medium">
                  {/* Optional Email Verification */}
                  {!userData.isAccountVerified && (
                    <li
                      onClick={sendVerificationOtp}
                      className={`py-2 px-4 flex items-center gap-2 rounded-md ${
                        cooldown > 0 || isSending
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'hover:bg-gray-100 cursor-pointer'
                      }`}
                    >
                      <i className="bi bi-patch-check-fill text-blue-600 text-lg"></i>
                      <span>
                        {isSending
                          ? 'Sending...'
                          : cooldown > 0
                          ? `Wait ${cooldown}s`
                          : `Verify Email`}
                      </span>
                    </li>
                  )}

                  {/* Home Link */}
                  <li
                    onClick={() => {
                      navigate('/');
                      setMenuOpen(false);
                    }}
                    className="py-2 px-4 flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-purple-600 cursor-pointer transition-all hover:scale-105"
                  >
                    <i className="bi bi-house text-lg"></i>
                    <span>Home</span>
                  </li>

                 

                  {/* Logout */}
                  <li
                    onClick={logout}
                    className="py-2 px-4 flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 cursor-pointer transition-all hover:scale-105"
                  >
                    <i className="bi bi-box-arrow-right text-lg"></i>
                    <span>Logout</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          //  If user not logged in, show login button
          <button
            onClick={() => navigate('/login')}
            className="flex items-center text-xl gap-2 bg-gray-100 border border-gray-300 rounded-full px-4 py-2 sm:px-6 sm:py-3 sm:me-5 me-2 text-gray-900 hover:bg-gray-300 transition-all select-none cursor-pointer"
          >
            <i className="bi bi-person-add"></i>
          </button>
        )}
      </div>
    </>
  );
}

export default Navbar;
