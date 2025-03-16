import React from 'react';
import { Link } from 'react-router-dom';

const AssistantRegistrationForm = () => {
  return (
    <div className="h-full bg-gray-100 flex items-center justify-center pt-24 mt-6">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-5xl overflow-hidden mb-8">
        {/* Form Header */}
        <div className="text-center m-4">
          <h2 className="text-2xl font-bold text-gray-800">Register / Sign Up</h2>
        </div>

        {/* Button container with fixed width */}
        <div className="flex justify-center">
          <div className="flex gap-4 w-[28rem]">
            <Link to="/PatientRegistration" className="flex-1 bg-[#0e606e] hover:bg-[#0b5058] text-white py-2 text-sm rounded-md font-medium text-center">
              Patient
            </Link>
            <Link to="/DoctorRegistration" className="flex-1 bg-[#0e606e] hover:bg-[#0b5058] text-white py-2 text-sm rounded-md font-medium text-center">
              Doctor
            </Link>
            <button className="flex-1 bg-[#ff9700] hover:bg-[#e68a00] text-white py-2 text-sm rounded-md font-medium text-center">
              Assistant
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row m-2">
          {/* Left Side */}
          <div className="w-full md:w-1/2 p-6 border-r border-gray-200">
            <div className="space-y-5">
              <div>
                <label className="block text-gray-700 font-medium">
                  Select Your Post / Work <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select className="block w-full p-1 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-1 focus:ring-[#0e606e]">
                    <option value="">Select your post / work</option>
                    <option value="receptionist">Receptionist</option>
                    <option value="nurse">Nurse</option>
                    <option value="lab-technician">Lab Technician</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <i className="ri-arrow-down-s-line text-gray-400"></i>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium">
                  Select The Doctor <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select className="block w-full p-1 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-1 focus:ring-[#0e606e]">
                    <option value="">Select that doctor with whom you are working</option>
                    <option value="dr-smith">Dr. Smith</option>
                    <option value="dr-patel">Dr. Patel</option>
                    <option value="dr-johnson">Dr. Johnson</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <i className="ri-arrow-down-s-line text-gray-400"></i>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1">
                  Upload Your Medical Identity Card (ID Card) <span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  <input 
                    type="text" 
                    className="flex-grow p-1 border border-gray-300 rounded-l focus:outline-none focus:ring-1 focus:ring-[#0e606e]" 
                    placeholder="Format: JPG, JPEG, PDF (Limit 1 MB)" 
                    readOnly
                  />
                  <button className="bg-[#0e606e] text-white px-4 py-1 rounded-r flex items-center">
                    Upload
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1">
                  Enter Your Hospital Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  className="w-full p-1 mb-8 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0e606e]" 
                  placeholder="Shalby Multispecialty Hospital"
                />
              </div>

              <div className="mt-1">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-2 h-4 w-4 text-[#0e606e]" 
                    defaultChecked
                  />
                  <span className="text-sm text-gray-700">I agree to the Terms & Conditions</span>
                </label>
                <div className="mb-9">
                  <p className="text-xs text-gray-600">
                    By uploading your documents, you confirm that the information provided is accurate and genuine to the best of your knowledge. All documents submitted will be used solely for the purpose of verifying your credentials and registration as a medical practitioner. 
                    <a href="#" className="text-blue-500 ml-1">Read More</a>
                  </p>
                </div>
              </div>

              <button className="w-full bg-[#0e606e] hover:bg-[#0b5058] text-white py-1 rounded-md font-medium text-sm">
                Submit Details
              </button>
            </div>
          </div>

          {/* Right Side */}
          <div className="w-full md:w-1/2 p-6">
            <div className="space-y-3">
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1">
                  Enter Full Name <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <input 
                    type="text" 
                    className="p-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0e606e]" 
                    placeholder="First Name"
                  />
                  <input 
                    type="text" 
                    className="p-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0e606e]" 
                    placeholder="Your Name"
                  />
                  <input 
                    type="text" 
                    className="p-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0e606e]" 
                    placeholder="Father/Husband Name"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1">
                  Enter Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  <input 
                    type="text" 
                    className="flex-grow p-1 border border-gray-300 rounded-l focus:outline-none focus:ring-1 focus:ring-[#0e606e]" 
                    placeholder="+91-94260-24009"
                  />
                  <button className="bg-[#0e606e] text-white px-4 py-1 rounded-r">
                    Send OTP
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1">
                  Enter OTP <span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  <input 
                    type="text" 
                    className="flex-grow p-1 border border-gray-300 rounded-l focus:outline-none focus:ring-1 focus:ring-[#0e606e]" 
                    placeholder="Enter OTP From SMS"
                  />
                  <button className="bg-[#0e606e] text-white px-4 py-1 rounded-r">
                    Verify OTP
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1">
                  Enter E-mail Address <span className="text-red-500">*</span>
                </label>
                <input 
                  type="email" 
                  className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0e606e]" 
                  placeholder="Mahesh123@gmail.com"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1">
                  Create Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input 
                    type="password" 
                    className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0e606e]" 
                    placeholder="A-Z, a-b, 1-9, Special character : @ # $ % & . _ !"
                  />
                  <p className="text-xs text-gray-500 mt-1">Must contain at least 8 characters with letters, numbers & special characters</p>
                </div>
              </div>

              <div className="">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-2 h-4 w-4 text-[#0e606e]" 
                    defaultChecked
                  />
                  <span className="text-sm text-gray-700">I agree to the Terms & Conditions</span>
                </label>
                <div className="mb-4">
                  <p className="text-xs text-gray-600">
                    By registering, you agree to securely manage your account credentials and ensure the accuracy of the information provided. 
                    <a href="#" className="text-blue-500 ml-1">Read More</a>
                  </p>
                </div>
              </div>

              <button className="w-full bg-[#0e606e] hover:bg-[#0b5058] text-white py-1 rounded-md font-medium text-sm">
                Register / Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistantRegistrationForm;