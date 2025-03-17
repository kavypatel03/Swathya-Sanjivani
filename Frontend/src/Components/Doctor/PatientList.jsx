import React from "react";

const PatientList = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm my-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-[#0e606e]">Your Patients List</h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search Your Patient"
            className="border border-gray-300 rounded px-3 py-2 w-64"
          />
          <button className="bg-[#0e606e] text-white px-4 py-2 rounded">Search</button>
        </div>
      </div>
      
      {/* Patient Entry 1 */}
      <div className="border border-gray-200 rounded-md p-4 mb-3">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-medium">Sanjaybhai B. Gohil</h4>
            <p className="text-sm text-gray-500">With 5 Family Members</p>
          </div>
          <div className="flex space-x-4">
            <button className="text-[#0e606e] hover:underline text-sm font-medium">Details</button>
            <button className="text-red-500 hover:underline text-sm font-medium">Remove</button>
          </div>
        </div>
      </div>
      
      {/* Patient Entry 2 */}
      <div className="border border-gray-200 rounded-md p-4 mb-3">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-medium">Bipinbhai M. Bhatt</h4>
            <p className="text-sm text-gray-500">With 4 Family Members</p>
          </div>
          <div className="flex space-x-4">
            <button className="text-[#0e606e] hover:underline text-sm font-medium">Details</button>
            <button className="text-red-500 hover:underline text-sm font-medium">Remove</button>
          </div>
        </div>
      </div>
      
      {/* View More Link */}
      <div className="text-right">
        <button className="text-blue-400 hover:underline text-sm font-medium">View More</button>
      </div>
    </div>
  );
};

export default PatientList;