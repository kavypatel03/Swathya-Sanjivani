import React from "react";
// Note: You'll need to install remix icons with: npm install remixicon
// And include in your project: import 'remixicon/fonts/remixicon.css'
import "remixicon/fonts/remixicon.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";

const PatientRegistrationForm = () => {
  const [error, setError] = useState("");
  const [fullname, setfullname] = useState("");
  const [mobile, setmobile] = useState("");
  const [isMobileVerified, setisMobileVerified] = useState(false);
  const [otp, setotp] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [userType, setUserType] = useState(params.get("userType") || "Patient");

  const normalizeMobile = (mobile) => {
    if (!mobile) return "";
    let formatted = mobile.trim();
    if (formatted.startsWith('+')) return formatted;
    if (formatted.startsWith('91')) return `+${formatted}`;
    return `+91${formatted}`;
  };

  const sendOTP = async () => {
    if (!mobile) {
      toast.error("Please enter a mobile number");
      return;
    }

    try {
      const cleanMobile = mobile.replace(/^\+91|^91/, '').trim();

      const response = await axios.post(
        "http://localhost:4000/patient/send-otp",
        {
          mobile: cleanMobile,
          userType: "Patient"
        }
      );

      if (response?.data?.success) {
        if (response.data.fallback) {
          toast.info("Development mode: Check console for OTP");
        } else {
          toast.success("OTP sent successfully!");
        }
      } else {
        toast.error(response?.data?.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("OTP Error:", error?.response?.data || error);
      toast.error(error?.response?.data?.message || "Error sending OTP");
    }
  };

  const verifyOTP = async () => {
    if (!mobile || !otp) {
      toast.error("Please enter both Mobile Number and OTP.");
      return;
    }

    const formattedMobile = normalizeMobile(mobile);

    try {
      const response = await axios.post(
        "http://localhost:4000/patient/verify-otp",
        { mobile: formattedMobile, otp }
      );
      if (response?.data?.success) {
        toast.success("OTP verified successfully!");
        setIsOtpVerified(true);
        setisMobileVerified(true);
      } else {
        toast.error(response?.data?.message || "OTP verification failed.");
        setIsOtpVerified(false);
        setisMobileVerified(false);
      }
    } catch (error) {
      toast.error("Error verifying OTP.");
      setIsOtpVerified(false);
      setisMobileVerified(false);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isOtpVerified) {
      toast.error("Please verify OTP before registration.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:4000/patient/register",
        { fullname, mobile, email, password, userType }, // Add `userType` here
        { withCredentials: true }
      );

      if (response?.data?.success) {
        toast.success("Registration successful!");
        setTimeout(() => {
          navigate("/PatientLogin");
        }, 4000);
      } else {
        toast.error(response?.data?.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setisMobileVerified(false);
      setIsOtpVerified(false);
      setmobile("");
      setotp("");

      if (error.response) {
        toast.error(error.response.data.message || "Registration failed");
      } else if (error.request) {
        toast.error("No response from server. Please try again later.");
      } else {
        toast.error(`Error: ${error.message}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center pt-24">
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Register / Sign Up
          </h2>
        </div>

        <div className="flex justify-center mb-4">
          <div className="flex gap-4 w-[28rem]">
            <Link
              to={{
                pathname: "/PatientRegistration",
                search: "?userType=Patient",
              }}
              className="flex-1 bg-[#ff9700] hover:bg-[#e68a00] text-white py-2 text-sm rounded-md font-medium text-center"
            >
              Patient
            </Link>

            <Link
              to="/DoctorRegistration"
              className="flex-1 bg-[#0e606e] hover:bg-[#0b5058] text-white py-2 text-sm rounded-md font-medium text-center"
            >
              Doctor
            </Link>
            <Link to="/AssistantRegistration" className="flex-1 bg-[#0e606e] hover:bg-[#0b5058] text-white py-2 text-sm rounded-md font-medium text-center">
              Assistant
            </Link>
          </div>
        </div>

        <form method="post" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Enter Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fullname"
              placeholder="Enter your full name"
              className="w-full border border-gray-300 p-1 rounded text-sm"
              onChange={(e) => setfullname(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Enter Mobile Number <span className="text-red-500">*</span>
            </label>
            <div className="flex">
              <input
                type="text"
                name="mobile"
                placeholder="+91-94260-24009"
                className="flex-grow border border-gray-300 p-1 rounded-l text-sm"
                value={mobile}
                onChange={(e) => setmobile(e.target.value)}
                disabled={isMobileVerified} // ✅ Disable Mobile Number field on success
              />
              <button
                type="button"
                className={`bg-[#0e606e] hover:bg-[#0b5058] text-white px-2 py-1 text-sm rounded-r w-24
                ${isOtpVerified ? "bg-gray-400 cursor-not-allowed" : ""}`}
                onClick={sendOTP}
                disabled={isMobileVerified} // ✅ Disable Send OTP button on success
              >
                {isOtpVerified ? "Verified ✅" : "Send OTP"}
              </button>
            </div>
          </div>

          <div className="mb-3">
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Enter OTP <span className="text-red-500">*</span>
            </label>
            <div className="flex">
              <input
                type="text"
                name="otp"
                placeholder="Enter OTP From SMS"
                className="flex-grow border border-gray-300 p-1 rounded-l text-sm"
                value={otp} // Ensures value persists even after disabling
                onChange={(e) => setotp(e.target.value)}
                disabled={isOtpVerified} // ✅ Disable OTP field on success
              />
              <button
                type="button"
                className={`bg-[#0e606e] hover:bg-[#0b5058] text-white px-2 py-1 text-sm rounded-r w-24
                ${isOtpVerified ? "bg-gray-400 cursor-not-allowed" : ""}`}
                onClick={verifyOTP}
                disabled={isOtpVerified} // ✅ Disable Verify OTP button on success
              >
                {isOtpVerified ? "Verified ✅" : "Verify OTP"}
              </button>
            </div>
          </div>

          <div className="mb-3">
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Enter E-mail Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="Mahesh123@gmail.com"
              className="w-full border border-gray-300 p-1 rounded text-sm"
              onChange={(e) => setemail(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Create Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="A-Z, a-b, 1-9, Special character : @ # $ % & . _ !"
                className="w-full border border-gray-300 p-1 rounded pr-10 text-sm"
                onChange={(e) => setPassword(e.target.value)}
              />
              <div
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={showPassword ? "ri-eye-off-line text-gray-500" : "ri-eye-line text-gray-500"}></i>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-start">
              <input type="checkbox" id="terms" className="mt-1" />
              <label htmlFor="terms" className="ml-2 text-xs text-gray-600">
                Terms & Conditions
                <br />
                <span className="text-xs">
                  By registering, you agree to securely manage your account
                  credentials and ensure the accuracy of the information
                  provided.
                  <span className="text-blue-500"> Read More</span>.
                </span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className={`w-full py-1 rounded-md font-medium text-sm 
      ${isOtpVerified
                ? "bg-[#0e606e] hover:bg-[#0b5058] text-white"
                : "bg-gray-400 cursor-not-allowed"
              }`}
            disabled={!isOtpVerified} // ✅ Disabled until OTP is verified
          >
            Register / Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};
export default PatientRegistrationForm;