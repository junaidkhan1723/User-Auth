import React, { useContext } from "react";
import { AppContent } from "../context/appContext";
import { useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from 'axios';
import { toast } from 'react-toastify';

const Header = () => {
  const navigate = useNavigate();

  const { userData, backendUrl, setUserData, setIsLoggedin } = useContext(AppContent);
  
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

  return (
    <>
      <div className="mx-4 sm:mx-16 xl:mx-24 relative text-center ">
        <h1 className=" flex items-center justify-center text-gray-900 gap-2 text-2xl sm:text-4xl font-semibold mb-2 sm:mb-2">
          Hey{" "}
          <span className="text-purple-800 font-semibold animate-bounceX hover:animate-wiggleX hover:text-purple-600 transition duration-300 ">
            {" "}
            {userData?.name.split(" ")[0] || "Developer"}!{" "}
          </span>{" "}
  
        </h1>
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-600 ">
          Welcome To User-Authentication page
        </h2>

       <p className="my-2 sm:my-4 max-w-2xl m-auto text-xs sm:text-sm text-gray-500">
  This project is a complete developer-friendly authentication setup built with modern best practices in mind.
</p>

<p className="text-gray-700 max-w-2xl mx-auto text-center text-sm sm:text-lg mt-4 mb-4">
  It includes features like{" "}
  <span className="font-medium text-purple-700">account creation</span>,{" "}
  <span className="font-medium text-indigo-700">JWT-based login</span>,{" "}
  <span className="font-medium text-green-700">email verification</span>,{" "}
  <span className="font-medium text-blue-700">secure password hashing</span>,{" "}
  <span className="font-medium text-yellow-700">cookie sessions</span>, and{" "}
  <span className="font-medium text-pink-700">token validation</span>.
</p>

        <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto mb-8">
          {userData ? (
            <>
               <strong>You're logged in!</strong>
              
            </>
          ) : (
            <>
             Please <strong>sign up</strong> or{" "}
              <strong>log in</strong>.

            </>
          )}
        </p>

        {userData ? (
          <button
            onClick={logout}
            className=" text-white font-semibold rounded-full px-8 py-2.5 bg-primary  hover:text-red-300 transition-all select-none cursor-pointer "
          >
           
                    <span>Logout</span>{''} <i className="bi bi-box-arrow-right text-lg"></i>
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className=" rounded-full px-8 py-2.5 bg-primary  hover:text-white transition-all select-none cursor-pointer"
          >
            Login <i class="bi bi-arrow-right"></i>
          </button>
        )}
      </div>
    </>
  );
};

export default Header;
