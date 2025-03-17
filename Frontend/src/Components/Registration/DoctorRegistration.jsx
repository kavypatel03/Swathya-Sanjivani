import React from 'react';
import { Link } from 'react-router-dom';
import 'remixicon/fonts/remixicon.css';

const DoctorRegistrationForm = () => {
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
            <button className="flex-1 bg-[#ff9700] hover:bg-[#e68a00] text-white py-2 text-sm rounded-md font-medium text-center">
              Doctor
            </button>
            <Link to={"/AssistantRegistration"} className="flex-1 bg-[#0e606e] hover:bg-[#0b5058] text-white py-2 text-sm rounded-md font-medium text-center">
              Assistant
            </Link>
          </div>
        </div>

        <div className="flex flex-col md:flex-row m-2">
          {/* Left Side */}
          <div className="w-full md:w-1/2 p-6  border-r border-gray-200">
            <h2 className="text-xl font-semibold text-[#0e606e] mb-6">Personal Information</h2>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-1">Add Full Name As Per License Degree</label>
              <input
                type="text"
                placeholder="Enter Your Full Name"
                className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0e606e]"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-1">Enter MCI Registration Number</label>
              <input
                type="text"
                placeholder="Ex. GJ403156"
                className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0e606e]"
              />
            </div>

            {/* Upload Medical Document Section */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-1">Upload your Medical Document</label>
              <div className="flex">
                <input
                  type="text"
                  placeholder='Formate.JPG,JPEG,PDF(Limit 1 MB)'
                  className="flex-grow p-1 border border-gray-300 rounded-l focus:outline-none focus:ring-1 focus:ring-[#0e606e]"
                />
                <label className="cursor-pointer bg-[#0e606e] hover:bg-[#0b5058] text-white px-4 py-1 rounded-r">
                  Upload
                </label>
                <input
                  type="file"
                  id="fileUpload"
                  className="hidden"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-1">Hospital Name</label>
              <input
                type="text"
                placeholder="Hospital Name"
                className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0e606e]"
              />
            </div>

            {/* Added Terms and Conditions Checkbox on Left Side */}
            <div className="mt-14">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2 h-4 w-4 text-[#0e606e]" />
                <span className="text-sm text-gray-700">I agree to the Terms & Conditions</span>
              </label>
            </div>

            {/* Terms and Conditions Text */}
            <div className=" mb-14">
              <p className="text-xs text-gray-600">
                By uploading your documents, you confirm that the information provided is accurate and genuine to the best of your knowledge. All documents submitted will be used solely for the purpose of verifying your credentials and registration as a medical practitioner.
                <a href="#" className="text-blue-500 ml-1">Read More</a>
              </p>
            </div>

            {/* Submit Details Button */}
            <button
              type="submit"
               className="w-full bg-[#0e606e] hover:bg-[#0b5058] text-white py-1 rounded-md font-medium text-sm"
            >
              Submit Details
            </button>
          </div>

          {/* Right Side - Updated spacing to match left side */}
          <div className="w-full md:w-1/2 p-6">
            <h2 className="text-xl font-semibold text-[#0e606e] mb-6">Contact Details</h2>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-1">Enter Your Full Name</label>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0e606e]"
              />
            </div>

            {/* Mobile Number with Send OTP button */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-1">Mobile Number</label>
              <div className="flex">
                <input
                  type="text"
                  placeholder="+91-XXXXX-XXXXX"
                  className="flex-grow p-1 border border-gray-300 rounded-l focus:outline-none focus:ring-1 focus:ring-[#0e606e]"
                />
                <button className="bg-[#0e606e] hover:bg-[#0b5058] text-white px-4 py-1 rounded-r">
                  Send OTP
                </button>
              </div>
            </div>

            {/* Enter OTP field with Verify button */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-1">Enter OTP</label>
              <div className="flex">
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  className="flex-grow p-1 border border-gray-300 rounded-l focus:outline-none focus:ring-1 focus:ring-[#0e606e]"
                />
                <button className="bg-[#0e606e] hover:bg-[#0b5058] text-white px-4 py-1 rounded-r">
                  Verify OTP
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-1">Email Address</label>
              <input
                type="email"
                placeholder="doctor@example.com"
                className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0e606e]"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-1">Create Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0e606e]"
              />
              <p className="text-xs text-gray-500 mt-1">Must contain at least 8 characters with letters, numbers & special characters</p>
            </div>

            <div className="">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2 h-4 w-4 text-[#0e606e]" />
                <span className="text-sm text-gray-700">I agree to the Terms & Conditions</span>
              </label>
              {/* Terms text with matching spacing */}
              <div className="mb-4">
                <p className="text-xs text-gray-600">
                  By registering, you agree to securely manage your account credentials and ensure the accuracy of the information provided.
                  <a href="#" className="text-blue-500 ml-1">Read More</a>
                </p>
              </div>
            </div>

            <button
              type="submit"
               className="w-full bg-[#0e606e] hover:bg-[#0b5058] text-white py-1 rounded-md font-medium text-sm"
            >
              Register/Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorRegistrationForm;