// UserProfile.jsx
import React from 'react';

const UserProfile = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center mb-6">
      <div className="flex items-center">
        <div className="bg-gray-100 rounded-full p-2 mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#0e606e]" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        </div>
        <div>
          <div className="flex items-center">
            <p className="text-[#0e606e] font-medium text-lg">Welcome, </p>
            <p className="text-[#ff9700] font-medium text-lg ml-1">Anilkumar Rathod</p>
          </div>
          <p className="text-gray-500 text-xs">Last login: Today at 09:00 AM</p>
        </div>
      </div>
      <button className="flex items-center text-[#0e606e]">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 24 24">
          <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
        Profile
      </button>
    </div>
  );
};

export default UserProfile;
