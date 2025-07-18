import React, { useContext, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContent } from "../context/appContext";
import axios from "axios";
import { toast } from "react-toastify";

function ResetPassword() {
  const { backendUrl } = useContext(AppContent);
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  // Form states
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otp, setOtp] = useState(0);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // OTP Input refs
  const inputRefs = useRef([]);

  // Cooldown effect hook for resend button
  useEffect(() => {
    let interval;
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) clearInterval(interval);
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCooldown]);

  // Handle input auto focus
  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Handle paste event across OTP inputs
  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").trim().slice(0, 6);
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  // Send reset OTP
  const onSubmitEmail = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const { data } = await axios.post(
        backendUrl + "/api/auth/send-reset-otp",
        { email }
      );
      if (data.success) {
        toast.success(data.message);
        setIsEmailSent(true);
        setResendCooldown(60);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Resend OTP function
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const { data } = await axios.post(
        backendUrl + "/api/auth/send-reset-otp",
        { email }
      );
      if (data.success) {
        toast.success("OTP resent to your email.");
        setResendCooldown(60);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to resend OTP.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle OTP form submission
  const onSubmitOTP = async (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map((el) => el.value);
    const fullOtp = otpArray.join("");
    setOtp(fullOtp);
    setIsOtpSubmitted(true);
  };

  // Final password reset submission
  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        backendUrl + "/api/auth/reset-password",
        {
          email,
          otp,
          newPassword,
        }
      );
      if (data.success) {
        toast.success(data.message);
        navigate("/login");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-[#f4f4f5]">
  <img
    onClick={() => navigate("/")}
    src={assets.logo}
    alt=""
    className="absolute left-3 sm:left-10 top-3 w-16 sm:w-24 cursor-pointer"
  />

  {/* Email Form */}
  {!isEmailSent && (
    <form
      onSubmit={onSubmitEmail}
      className="bg-slate-200 px-4 py-8 sm:p-8 rounded-lg shadow-lg w-96 text-sm"
    >
      <h1 className="text-slate-900 text-2xl font-semibold text-center mb-4">
        Reset <span className="text-primary">Password</span>
      </h1>
      <p className="text-center mb-6 text-slate-500">
        Enter your registered email id.
      </p>
      <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-gray-300">
        <img src={assets.mail_icon} alt="" />
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          name="email"
          className="bg-transparent outline-none text-gray-600 font-semibold"
          type="email"
          placeholder="Email id"
          required
        />
      </div>
      <button
        disabled={isSubmitting}
        className={`w-full py-3 text-white rounded-full transition-all cursor-pointer hover:text-slate-800 ${
          isSubmitting
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-600 to-blue-800"
        }`}
      >
        {isSubmitting ? `Sending...` : "Submit"}
      </button>
    </form>
  )}

  {/* OTP Form */}
  {isEmailSent && !isOtpSubmitted && (
    <form
      onSubmit={onSubmitOTP}
      className="bg-slate-950 px-8 py-8 sm:p-8 rounded-lg shadow-md w-96 text-sm"
    >
      <h1 className="text-white text-2xl font-semibold text-center mb-4">
        Reset Password OTP
      </h1>
      <p className="text-center mb-6 text-blue-300">
        Enter the 6-digit code sent to your email.
      </p>
      <div
        className="grid grid-cols-6 gap-2 sm:gap-3 justify-center mb-6 max-w-xs mx-auto"
        onPaste={handlePaste}
      >
        {Array(6)
          .fill(0)
          .map((_, index) => (
            <input
              type="text"
              maxLength="1"
              key={index}
              required
              className="w-10 sm:w-12 h-10 sm:h-12 bg-blue-600 text-white text-center text-xl rounded-md"
              ref={(el) => (inputRefs.current[index] = el)}
              onInput={(e) => handleInput(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ))}
      </div>
      <button className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-full">
        Submit
      </button>
      <div className="text-center mt-4">
        <button
          type="button"
          onClick={handleResendOtp}
          disabled={resendCooldown > 0 || isSubmitting}
          className={`text-blue-300 hover:underline text-sm ${
            resendCooldown > 0 ? "cursor-not-allowed text-gray-400" : ""
          }`}
        >
          {resendCooldown > 0
            ? `Resend OTP in ${resendCooldown}s`
            : "Resend OTP"}
        </button>
      </div>
    </form>
  )}

  {/* New Password Form */}
  {isEmailSent && isOtpSubmitted && (
    <form
      onSubmit={onSubmitNewPassword}
      className="bg-slate-950 px-4 py-8 sm:p-8 rounded-lg shadow-md w-96 text-sm"
    >
      <h1 className="text-white text-2xl font-semibold text-center mb-4">
        New Password
      </h1>
      <p className="text-center mb-6 text-blue-300">
        Enter your new password below.
      </p>
      <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-blue-500">
        <img src={assets.lock_icon} alt="" />
        <input
          onChange={(e) => setNewPassword(e.target.value)}
          value={newPassword}
          name="password"
          className="bg-transparent outline-none text-white font-semibold"
          type="password"
          placeholder="Enter New Password"
          required
        />
      </div>
      <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-full">
        Submit
      </button>
    </form>
  )}
</div>
  );
}

export default ResetPassword;
