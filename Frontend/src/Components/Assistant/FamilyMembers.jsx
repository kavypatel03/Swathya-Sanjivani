import React from 'react';

const FamilyMembers = () => {
  const members = [
    { name: 'Sanjaybhai B. Gohil', dob: '15-1-1987', age: 38, relation: 'Self', selected: true },
    { name: 'Rashmiben S. Gohil', dob: '18-09-1985', age: 37, relation: 'Wife' },
    { name: 'Param S. Gohil', dob: '8-5-2010', age: 15, relation: 'Son' },
    { name: 'Babubhai M. Gohil', dob: '10-12-1937', age: 88, relation: 'Father' },
    { name: 'Shardaben B. Gohil', dob: '23-01-1945', age: 80, relation: 'Mother' }
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h2 className="text-[#0e606e] font-medium text-lg mb-4">Family Members</h2>
      {members.map((member, index) => (
        <div key={index} className="mb-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-gray-100 rounded-full p-2 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#0e606e]" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <div>
              <p className="font-medium">{member.name}</p>
              <p className="text-gray-500 text-xs">DOB: {member.dob}</p>
              <p className="text-gray-500 text-xs">Age: {member.age}</p>
              <p className="text-gray-500 text-xs">Relation: {member.relation}</p>
            </div>
          </div>
          {member.selected ? (
            <button className="bg-[#0e606e] text-white px-4 py-1 rounded-md">Selected</button>
          ) : (
            <button className="border border-[#0e606e] text-[#0e606e] px-4 py-1 rounded-md">Select</button>
          )}
        </div>
      ))}
    </div>
  );
};

export default FamilyMembers;