import React, { useState } from "react";
import axios from "axios";

const AccessPatientRecords = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const showAlert = async (config) => {
    const Swal = (await import("sweetalert2")).default;
    return Swal.fire(config);
  };

  const handleSendOTP = async () => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:4000/doctor/send-patient-otp', 
        { mobileNumber },
        { withCredentials: true }
      );

      if (response.data.success) {
        await showAlert({
          title: "Success",
          text: "OTP sent successfully!",
          icon: "success",
          confirmButtonColor: "#0e606e",
        });
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send OTP';
      
      let alertConfig = {
        confirmButtonColor: "#0e606e",
        background: "#ffffff",
      };

      if (message.includes("Verifying")) {
        alertConfig = {
          ...alertConfig,
          title: "Verification Pending",
          text: message,
          icon: "info",
          iconColor: "#ff9700",
        };
      } else if (message.includes("rejected")) {
        alertConfig = {
          ...alertConfig,
          title: "License Rejected",
          text: message,
          icon: "error",
          iconColor: "#ef4444",
        };
      } else {
        alertConfig = {
          ...alertConfig,
          title: "Error",
          text: message,
          icon: "error",
          confirmButtonColor: "#ef4444",
        };
      }

      await showAlert(alertConfig);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:4000/doctor/verify-patient-otp', 
        { mobileNumber, otp },
        { withCredentials: true }
      );

      if (response.data.success) {
        await showAlert({
          title: "Success",
          text: "Access granted successfully!",
          icon: "success",
          confirmButtonColor: "#0e606e",
        });
        window.location.reload();
      }
    } catch (error) {
      await showAlert({
        title: "Error",
        text: error.response?.data?.message || 'Failed to verify OTP',
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-10 rounded-lg shadow-sm my-4">
      <h3 className="text-lg font-semibold text-[#0e606e] mb-4">Access Patient Records</h3>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Enter Mobile Number <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            placeholder="+91-94260-24009"
            className="flex-1 border border-gray-300 rounded p-2"
          />
          <button 
            onClick={handleSendOTP}
            disabled={loading}
            className="bg-[#0e606e] text-white px-6 rounded whitespace-nowrap w-28 disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Enter OTP <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP From SMS"
            className="flex-1 border border-gray-300 rounded p-2"
          />
          <button 
            onClick={handleVerifyOTP}
            disabled={loading}
            className="bg-[#ff9700] text-white px-6 py-2 rounded whitespace-nowrap w-28 disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccessPatientRecords;