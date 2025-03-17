import React from "react";

const DoctorProfile = () => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm flex justify-between items-center my-4">
        <div className="flex items-center">
        <div className="h-16 w-16 rounded-full bg-[#ff9700] flex items-center justify-center text-white">
            <i className="ri-user-line text-2xl"></i>
          </div>
          <div className="ml-4">
            <div className="flex items-center">
              <h2 className="text-xl font-semibold">Welcome, <span className="text-[#ff9700]">Dr. Manoj Shah</span></h2>
              <i className="ri-verified-badge-fill text-[#0e606e] ml-2"></i>
            </div>
            <p className="text-gray-500 text-sm">Last login: Today at 09:00 AM</p>
          </div>
        </div>
        <button className="flex items-center text-[#0e606e]">
          <i className="ri-user-line mr-1"></i> Profile
        </button>
      </div>
    );
  };

  export default DoctorProfile;