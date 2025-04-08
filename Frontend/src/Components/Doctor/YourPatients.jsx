import React from 'react';

// Your Patients List Component
const PatientsList = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#0e606e]">Your Patients List</h2>
        <div className="flex gap-2">
          <input 
            type="text"
            className="p-2 border border-gray-300 rounded"
            placeholder="Search Your Patient"
          />
          <button className="bg-[#0e606e] text-white px-4 py-2 rounded">Search</button>
        </div>
      </div>
      
      <div className="border border-gray-200 rounded-lg mb-2">
        <div className="flex justify-between items-center p-4 border-l-4 border-[#0e606e]">
          <div>
            <h3 className="font-medium">Sanjaybhai B. Gohil</h3>
            <p className="text-sm text-gray-500">With 5 Family Members</p>
          </div>
          <div className="flex gap-2">
            <button className="text-[#0e606e] font-medium">Details</button>
            <button className="text-red-500 font-medium">Remove</button>
          </div>
        </div>
      </div>
      
      <div className="border border-gray-200 rounded-lg mb-4">
        <div className="flex justify-between items-center p-4 border-l-4 border-[#0e606e]">
          <div>
            <h3 className="font-medium">Bipinbhai M. Bhatt</h3>
            <p className="text-sm text-gray-500">With 4 Family Members</p>
          </div>
          <div className="flex gap-2">
            <button className="text-[#0e606e] font-medium">Details</button>
            <button className="text-red-500 font-medium">Remove</button>
          </div>
        </div>
      </div>
      
      <div className="text-right">
        <button className="text-[#0e606e] font-medium">View More</button>
      </div>
    </div>
  );
};


export default PatientsList;
// This component displays a list of patients with their details and options to view more or remove them. The styling is done using Tailwind CSS for a clean and modern look.