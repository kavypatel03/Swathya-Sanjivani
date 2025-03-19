// ModifyDetails.jsx
import React from 'react';

const ModifyDetails = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-[#0e606e] mb-6">Modify Your Details</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div>
          <div className="mb-4">
            <label className="block mb-2">
              Enter Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2"
              defaultValue="Rathod        Anilkumar        Rameshbhai"
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-2">
              Enter Mobile Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              className="w-full border border-gray-300 rounded px-3 py-2"
              defaultValue="+91-94260-24009"
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-2">
              Enter E-mail Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded px-3 py-2"
              defaultValue="Anil804@gmail.com"
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-2">
              Enter Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="password"
                className="w-full border border-gray-300 rounded px-3 py-2"
                defaultValue="•••••••••"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2">
                <i className="ri-eye-off-line text-gray-400"></i>
              </button>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block mb-2">
              Select Gender <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="male"
                  name="gender"
                  defaultChecked
                  className="w-4 h-4 accent-[#0e606e]"
                />
                <label htmlFor="male" className="ml-2">Male</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="female"
                  name="gender"
                  className="w-4 h-4 accent-[#0e606e]"
                />
                <label htmlFor="female" className="ml-2">Female</label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column */}
        <div>
          <div className="mb-4">
            <label className="block mb-2">
              Select Your Post / Work <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select className="w-full border border-gray-300 rounded px-3 py-2 appearance-none">
                <option>Medical Assistant</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <i className="ri-arrow-down-s-line"></i>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block mb-2">
              Enter Birth Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2"
                defaultValue="15 / 01 / 1987"
              />
              <div className="absolute inset-y-0 right-0 flex items-center px-2">
                <i className="ri-calendar-line text-gray-400"></i>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block mb-2">
              Enter Age <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2"
              defaultValue="38"
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-2">
              Select Hospital <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select className="w-full border border-gray-300 rounded px-3 py-2 appearance-none">
                <option>BIMS Hospital</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <i className="ri-arrow-down-s-line"></i>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block mb-2">
              Enter Your Doctor Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2"
              defaultValue="Dr. Manoj Shah"
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end mt-6 space-x-4">
        <button className="px-6 py-2 border border-gray-300 rounded text-gray-700">
          Cancel
        </button>
        <button className="px-6 py-2 bg-[#0e606e] text-white rounded">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default ModifyDetails;