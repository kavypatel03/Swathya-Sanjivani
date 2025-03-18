import React from 'react';
import { Link } from 'react-router-dom';

function FamilyMembers() {
  const members = [
    { id: 1, name: 'Rashmiben S. Gohil', age: 32, color: 'bg-purple-200' },
    { id: 2, name: 'Param S. Gohil', age: 8, color: 'bg-pink-200' },
    { id: 3, name: 'Babubhai M. Gohil', age: 88, color: 'bg-blue-200' },
    { id: 4, name: 'Shardaben B. Gohil', age: 80, color: 'bg-green-200' },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-3">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-medium text-[#0e606e]">Family Members</h2>
        <Link to={'/PatientAddMemPage'} className="text-blue-500 hover:text-blue-700">
          Add New
        </Link>
      </div>
      
      <div className="space-y-4">
        {members.map(member => (
          <div key={member.id} className="flex justify-between items-center">
            <div className="flex items-center">
              <div className={`h-10 w-10 rounded-full ${member.color} flex items-center justify-center`}>
                <i className="ri-user-line text-gray-600"></i>
              </div>
              <div className="ml-3">
                <div className="font-medium">{member.name}</div>
                <div className="text-sm text-gray-500">Age: {member.age}</div>
              </div>
            </div>
            <button className="text-red-500 hover:text-red-700">
              <i className="ri-close-line"></i>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FamilyMembers;