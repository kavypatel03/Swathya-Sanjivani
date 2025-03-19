import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function FamilyMembers() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const members = [
    { id: 1, name: 'Rashmiben S. Gohil', age: 32, color: 'bg-purple-200' },
    { id: 2, name: 'Param S. Gohil', age: 8, color: 'bg-pink-200' },
    { id: 3, name: 'Babubhai M. Gohil', age: 88, color: 'bg-blue-200' },
    { id: 4, name: 'Shardaben B. Gohil', age: 80, color: 'bg-green-200' },
  ];

  const fetchFamilyMembers = async () => {
    setLoading(true);
    try {
      // Your API call code here
    } catch (error) {
      // Error handling
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-3">
      <div className="flex justify-between items-center mb-3 ">
        <h2 className="text-xl font-medium text-[#0e606e]">Family Members</h2>
        <Link to={'/PatientAddNewMem'} className="text-blue-500 hover:text-blue-700">
          Add New
        </Link>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">⏳ Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="space-y-4">
          {members.map((member) => (
            <div
              key={member._id}
              className="flex justify-between items-center cursor-pointer"
              onClick={() => handleMemberSelect(member)}  // ✅ Pass selected member directly
            >
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-[#e0f7fa] flex items-center justify-center overflow-hidden">
                  <i className="ri-user-3-line text-gray-600"></i>
                </div>

                <div className="ml-3">
                  <div className="font-medium">{member.fullName}</div>
                  <div className="text-sm text-gray-500">
                    Age: {member.calculatedAge || member.age || 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FamilyMembers;
