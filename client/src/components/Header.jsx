import React, { useContext } from "react";
import { AppContent } from "../context/appContext";
import { useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";
import { toast } from "react-toastify";

const Header = () => {
  const navigate = useNavigate();

  const { userData, backendUrl, setUserData, setIsLoggedin } =
    useContext(AppContent);

  // Logout function
  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + "/api/auth/logout");

      if (data.success) {
        toast.success(data.message);
        setIsLoggedin(false);
        setUserData(null);
        setTimeout(() => navigate("/"), 100); // navigate after logout
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <div className="mx-4 sm:mx-16 xl:mx-24 relative text-center text-white ">
        {/* Status Badge */}
        <div className="flex items-center justify-center mb-8 ">
          <div className="animate-bounceX hover:animate-wiggleX inline-flex items-center gap-2 bg-white backdrop-blur-sm border border-gray-200/60 rounded-full px-4 py-2 shadow-sm">
            <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse "></div>
            <span className="text-sm font-medium text-gray-900 ">
              {userData ? (
                <>
                  <i className="bi bi-stars text-yellow-500"></i> Authenticated
                </>
              ) : (
                <>
                  <i className="bi bi-person-lock text-red-500"></i>{" "}
                  Authentication Required
                </>
              )}{" "}
            </span>
          </div>
        </div>

        {/* Main Heading */}
        <div className="mb-6">
          <h1 className="text-4xl md:text-7xl font-bold text-white mb-4 tracking-tight">
            Hey{" "}
            <span className="relative inline-block shimmer-text">
              {userData?.name.split(" ")[0] || "Developer"}
            </span>{" "}
            !
          </h1>

          <div className="space-y-3">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-200">
              User Authentication
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mx-auto"></div>
          </div>
        </div>

        {/* Description */}
        <div className="max-w-3xl mx-auto mb-8">
          <p className="text-lg md:text-xl text-gray-100 mb-6 leading-relaxed">
            Professional-grade authentication system with modern security
            practices. Easily integrate secure user management into your
            projects.
          </p>

          <p className="text-gray-300 text-xs sm:text-lg leading-relaxed">
            <span className="text-lg">Built with </span>{" "}
            <br className="sm:hidden" />
            <span className="mx-2 my-2 inline-flex items-center gap-1  font-semibold text-purple-700 bg-purple-50 px-2 py-1 rounded-md">
              <i className="bi bi-person-plus text-xs sm:text-sm"></i>
              account creation
            </span>{" "}
            <span className=" mx-2 my-2 inline-flex items-center gap-1 font-semibold text-indigo-700 bg-indigo-50 px-2 py-1 rounded-md">
              <i className="bi bi-shield-lock text-sm"></i>
              JWT-based login
            </span>{" "}
            <span className="mx-2 my-2 inline-flex items-center gap-1 font-semibold text-green-700 bg-green-50 px-2 py-1 rounded-md">
              <i className="bi bi-envelope-check text-sm"></i>
              email verification
            </span>{" "}
            <span className="mx-2 my-2 inline-flex items-center gap-1 font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded-md">
              <i className="bi bi-lock text-sm"></i>
              secure password hashing
            </span>{" "}
            <span className="mx-2 my-2 inline-flex items-center gap-1 font-semibold text-yellow-700 bg-yellow-50 px-2 py-1 rounded-md">
              <i className="bi bi-cookie text-sm"></i>
              cookie sessions
            </span>
            <span className="mx-2 my-2 inline-flex items-center gap-1 font-semibold text-pink-700 bg-pink-50 px-2 py-1 rounded-md">
              <i className="bi bi-check-circle text-sm"></i>
              token validation
            </span>
          </p>
        </div>

        {/* Status Message */}
        <div className="mb-6">
          <p className="text-gray-600 text-lg">
            {userData ? (
              <span className="inline-flex items-center gap-2 text-green-700 font-medium">
                <i className="bi bi-check-circle-fill"></i>
                You're successfully logged in!
              </span>
            ) : (
              <span className="text-white">
                Please <strong className="text-purple-700">sign up</strong> or{" "}
                <strong className="text-blue-700">log in</strong> to continue
              </span>
            )}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {userData ? (
            <button
              onClick={logout}
              className="cursor-pointer group inline-flex items-center gap-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-full px-8 py-4 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
            >
              <span>Logout</span>
              <i className="bi bi-box-arrow-right text-lg group-hover:translate-x-1 transition-transform duration-300"></i>
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="cursor-pointer group inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-full px-8 py-4 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
            >
              <span>Get Started</span>
              <i className="bi bi-arrow-right group-hover:translate-x-1 transition-transform duration-300"></i>
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
