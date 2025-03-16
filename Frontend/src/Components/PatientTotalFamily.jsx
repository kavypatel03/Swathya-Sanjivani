// TotalFamilyMembers.jsx
import React from 'react';

const TotalFamilyMembers = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mt-6">
      <h2 className="text-xl font-semibold text-[#0e606e] mb-4">Total Family Members</h2>
      <div className="flex justify-between">
        <div>
          <p className="text-gray-600">Total Male: 3</p>
          <p className="text-gray-600">Total Female: 2</p>
          <p className="text-gray-600">Senior Citizen: 2</p>
          <p className="text-gray-600">Teen: 1</p>
        </div>
        <div className="flex items-center">
          <div className="text-7xl font-bold text-[#0e606e]">5</div>
          <div className="ml-2">
            <div className="text-lg font-semibold text-[#0e606e]">TOTAL</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalFamilyMembers;
