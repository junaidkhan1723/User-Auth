import React, { useContext, useEffect, useState, useRef } from "react";
import { assets } from "../assets/assets.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContent } from "../context/appContext";
import { toast } from "react-toastify";

function EmailVerify() {
  const { backendUrl, isLoggedin, userData, getUserData } = useContext(AppContent);
  const navigate = useNavigate();

  const inputRefs = useRef([]);
  const [isOtpComplete, setIsOtpComplete] = useState(false);
  const [cooldown, setCooldown] = useState(10);
  const [isSubmitting, setIsSubmitting] = useState(false);

  axios.defaults.withCredentials = true;

  //sends otp of email varification

  useEffect(() => {
    const sendInitialOtp = async () => {
      try {
        const { data } = await axios.post(backendUrl + "/api/auth/send-verify-otp", {
          userId: userData?._id,
        });
        if (data.success) {
          toast.success("OTP sent to your email.");
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error("Failed to send OTP.");
      }
    };

    if (isLoggedin && userData?._id && !userData.isAccountVerified) {
      sendInitialOtp();
    }
  }, [isLoggedin, userData, backendUrl]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    const checkOtpFilled = () => {
      const allFilled = inputRefs.current.every(
        (input) => input && input.value.length === 1
      );
      setIsOtpComplete(allFilled);
    };

    const inputs = inputRefs.current;
    inputs.forEach((input) => input?.addEventListener("input", checkOtpFilled));
    return () => {
      inputs.forEach((input) => input?.removeEventListener("input", checkOtpFilled));
    };
  }, []);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) clearInterval(timer);
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [cooldown]);

  const handleInput = (e, index) => {
    const value = e.target.value;
    if (value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").slice(0, 6);
    paste.split("").forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
    setIsOtpComplete(true);
    inputRefs.current[paste.length - 1]?.focus();
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    const otp = inputRefs.current.map((input) => input.value).join("");

    try {
      const { data } = await axios.post(backendUrl + "/api/auth/verify-account", {
        userId: userData?._id,
        otp,
      });

      if (data.success) {
        toast.success(data.message);
        await getUserData();
        navigate("/");
      } else {
        toast.error(data.message);
        inputRefs.current.forEach((input) => (input.value = ""));
        setIsOtpComplete(false);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      toast.error(error.message);
      inputRefs.current.forEach((input) => (input.value = ""));
      setIsOtpComplete(false);
      inputRefs.current[0]?.focus();
    }
    setIsSubmitting(false);
  };

  const handleResendOtp = async () => {
    try {
      const { data } = await axios.post(backendUrl + "/api/auth/send-verify-otp", {
        userId: userData?._id,
      });
      if (data.success) {
        toast.success("OTP resent to your email.");
        setCooldown(60);
        inputRefs.current.forEach((input) => (input.value = ""));
        setIsOtpComplete(false);
        inputRefs.current[0]?.focus();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to resend OTP.");
    }
  };

  useEffect(() => {
    if (isLoggedin && userData?.isAccountVerified) {
      navigate("/");
    }
  }, [isLoggedin, userData, navigate]);

  return (
    <div className='flex flex-col items-center justify-center min-h-screen px-4 bg-[url("/BlogBG.png")] bg-cover bg-center'>
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="logo"
        className="absolute left-3 sm:left-10 top-3 w-16 sm:w-24 cursor-pointer"
      />

      <form
        onSubmit={onSubmitHandler}
        className="bg-slate-900 w-full max-w-sm px-6 py-8 rounded-lg shadow-lg text-sm"
      >
        <h1 className="text-white text-2xl font-semibold text-center mb-4">
          Email Verify OTP
        </h1>
        <p className="text-center mb-6 text-indigo-200">
          Enter the 6-digit code sent to your email ID.
        </p>

       <div
  className="grid grid-cols-6 gap-2 sm:gap-3 justify-center mb-6 max-w-xs mx-auto"
  onPaste={handlePaste}
>
  {Array(6) 
    .fill(0)
    .map((_, index) => (
      <input
        key={index}
        type="text"
        maxLength="1"
        required
        className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br from-purple-400 to-blue-400 text-white text-center text-xl rounded-md"
        ref={(el) => (inputRefs.current[index] = el)}
        onInput={(e) => handleInput(e, index)}
        onKeyDown={(e) => handleKeyDown(e, index)}
      />
    ))}
</div>


        <button
          type="submit"
          disabled={!isOtpComplete || isSubmitting}
          className={`w-full py-3 rounded-full transition-all ${
            isOtpComplete && !isSubmitting
              ? "bg-gradient-to-br from-purple-400 to-indigo-900 text-white"
              : "bg-gray-400 text-gray-200 cursor-not-allowed"
          }`}
        >
          Verify Email
        </button>

        <div className="text-center mt-4">
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={cooldown > 0}
            className={`text-indigo-300 hover:underline text-sm ${
              cooldown > 0 ? "cursor-not-allowed text-gray-400" : ""
            }`}
          >
            {cooldown > 0 ? `Resend OTP in ${cooldown}s` : "Resend OTP"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EmailVerify;
