import React from 'react';

const PatientAddNewFamilyMember = () => {
  return (
    <>
      <h2 className="text-2xl font-semibold text-[#0e606e] mb-6">Modify Family Member Details</h2>
      
      <form className="space-y-6">
        {/* Full Name */}
        <div className="space-y-2">
          <label className="block font-medium">
            Enter Full Name <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="First Name"
              className="border rounded-md p-2 flex-1"
            />
            <input
              type="text"
              placeholder="Your Name"
              className="border rounded-md p-2 flex-1"
            />
            <input
              type="text"
              placeholder="Father/Husband Name"
              className="border rounded-md p-2 flex-1"
            />
          </div>
        </div>
        
        {/* Birth Date */}
        <div className="space-y-2">
          <label className="block font-medium">
            Enter Birth Date <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="DD / MM / YYYY"
              className="border rounded-md p-2 w-full"
            />
            <i className="ri-calendar-line absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          </div>
        </div>
        
        {/* Age */}
        <div className="space-y-2">
          <label className="block font-medium">
            Enter Age <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter Only Numeric Value"
            className="border rounded-md p-2 w-full"
          />
        </div>
        
        {/* Relation */}
        <div className="space-y-2">
          <label className="block font-medium">
            Select Relation With Main Person Of Family <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select className="border rounded-md p-2 w-full appearance-none bg-white">
              <option>Select Relation With Account Holder</option>
              <option>Self</option>
              <option>Wife</option>
              <option>Husband</option>
              <option>Son</option>
              <option>Daughter</option>
              <option>Father</option>
              <option>Mother</option>
            </select>
            <i className="ri-arrow-down-s-line absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          </div>
        </div>
        
        {/* Gender */}
        <div className="space-y-2">
          <label className="block font-medium">
            Select Gender <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-6">
            <label className="flex items-center">
              <input type="radio" name="gender" className="mr-2" />
              <span>Male</span>
            </label>
            <label className="flex items-center">
              <input type="radio" name="gender" className="mr-2" />
              <span>Female</span>
            </label>
          </div>
        </div>
        
        {/* Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <button type="button" className="border border-gray-300 bg-white text-gray-700 px-6 py-2 rounded-md">
            Clear
          </button>
          <button type="button" className="border border-gray-300 bg-white text-gray-700 px-6 py-2 rounded-md">
            Cancel
          </button>
          <button type="button" className="bg-[#0e606e] text-white px-6 py-2 rounded-md flex items-center">
            <i className="ri-user-add-line mr-2"></i>
            Add New Member
          </button>
        </div>
      </form>
    </>
  );
};

export default PatientAddNewFamilyMember;