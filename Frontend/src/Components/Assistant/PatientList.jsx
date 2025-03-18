import React from 'react';

const PatientList = () => {
  const patients = [
    { name: 'Sanjaybhai B. Gohil', members: 5 },
    { name: 'Bipinbhai M. Bhatt', members: 4 }
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <h2 className="text-[#0e606e] font-medium text-lg mb-4">Your Patients List</h2>
      <div className="flex mb-4">
        <input 
          type="text" 
          placeholder="Search Your Patient" 
          className="border border-gray-300 rounded-md px-3 py-2 mr-2 flex-grow"
        />
        <button className="bg-[#0e606e] text-white px-4 py-2 rounded-md">Search</button>
      </div>
      {patients.map((patient, index) => (
        <div key={index} className="border border-gray-200 rounded-md p-3 mb-2">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">{patient.name}</p>
              <p className="text-gray-500 text-xs">With {patient.members} Family Members</p>
            </div>
            <button className="text-[#0e606e] font-medium">Documents</button>
          </div>
        </div>
      ))}
      <div className="text-center mt-2">
        <button className="text-[#0e606e]">View More</button>
      </div>
    </div>
  );
};

export default PatientList;