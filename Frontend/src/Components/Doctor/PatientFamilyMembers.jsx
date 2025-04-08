import React from 'react';

// Family Members Component
const FamilyMembers = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-1">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#0e606e]">Patient Family Members</h2>
        <button className="text-[#0e606e] font-medium">See All</button>
      </div>
      
      {[
        { name: 'Rashmiben S. Gohil', age: 32 },
        { name: 'Param S. Gohil', age: 8 },
        { name: 'Babubhai M. Gohil', age: 88 },
        { name: 'Shardaben B. Gohil', age: 80 }
      ].map((member, index) => (
        <div key={index} className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-200 rounded-full mr-3 overflow-hidden">
              <div className="bg-[#0e606e] text-white flex items-center justify-center h-full">
                {member.name.charAt(0)}
              </div>
            </div>
            <div>
              <h3 className="font-medium">{member.name}</h3>
              <p className="text-sm text-gray-500">Age: {member.age}</p>
            </div>
          </div>
          <button className="text-[#0e606e] font-medium">Details</button>
        </div>
      ))}
    </div>
  );
};


export default FamilyMembers;
// This component displays a list of family members with their names and ages. Each member has a button to view more details. The styling is done using Tailwind CSS for a clean and modern look.