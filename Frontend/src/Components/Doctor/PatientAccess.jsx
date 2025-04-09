import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AccessPatientRecords = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/doctor/send-patient-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ mobileNumber })
      });

      const data = await response.json();
      if (data.success) {
        toast.success('✅ OTP sent successfully!');
      } else {
        toast.error(data.message || 'Failed to send OTP');
      }
    } catch (err) {
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/doctor/verify-patient-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ mobileNumber, otp })
      });

      const data = await response.json();
      if (data.success) {
        toast.success('✅ Access granted successfully!');
        window.location.reload();
      } else {
        toast.error(data.message || 'Invalid OTP');
      }
    } catch (err) {
      toast.error('Failed to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-10 rounded-lg shadow-sm my-4">
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      
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