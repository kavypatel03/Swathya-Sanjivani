import React from 'react';
import { Link } from 'react-router-dom';

function UserProfile() {
  return (
    <div className="bg-white rounded-lg shadow px-6 p-6 m-5">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="h-16 w-16 rounded-full bg-[#ff9700] flex items-center justify-center text-white">
            <i className="ri-user-line text-2xl"></i>
          </div>
          <div className="ml-4">
            <div className="text-xl font-medium">
              <span className="text-gray-700">Welcome, </span>
              <span className="text-[#ff9700]">Dr.Manoj Shah</span>
            </div>
            <div className="text-sm text-gray-500">Last login: Today</div>
          </div>
        </div>
        <Link to="/PatientFamilyPage" className="flex items-center text-[#0e606e] hover:text-[#0e606e]/80 font-bold">
          Profile
        </Link>
      </div>
    </div>
  );
}

export default UserProfile;