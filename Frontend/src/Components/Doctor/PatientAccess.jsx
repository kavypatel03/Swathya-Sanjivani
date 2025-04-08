import React from 'react';

const AccessPatientRecords = () => {
  return (
    <div className="bg-white p-10 rounded-lg shadow-sm mx-5">
      <h2 className="text-xl font-semibold text-[#0e606e] mb-4">Access Patient Records</h2>
      
      <div className="mb-4">
        <label className="block mb-2">
          Enter Mobile Number <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-4">
          <input 
            type="text" 
            className="p-2 border border-gray-300 rounded w-full" 
            placeholder="+91-94260-24009"
          />
          <button className="bg-[#0e606e] text-white px-4 py-2 rounded">Send OTP</button>
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block mb-2">
          Enter OTP <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-4">
          <input 
            type="text" 
            className="p-2 border border-gray-300 rounded w-full" 
            placeholder="Enter OTP From SMS"
          />
          <button className="bg-[#ff9700] text-white px-4 py-2 rounded">Verify</button>
        </div>
      </div>
    </div>
  );
};

export default AccessPatientRecords;
// The component is styled using Tailwind CSS classes for a clean and modern look.