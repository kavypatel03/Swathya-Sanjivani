import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function FamilyMembers({ setSelectedMember }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFamilyMembers = async () => {
      try {
        const response = await fetch('http://localhost:4000/patient/get-family-members', {
          method: 'GET',
          credentials: 'include'
        });

        const data = await response.json();
        if (data.success) {
          setMembers(data.data);
        } else {
          setError('❌ Failed to load family members.');
        }
      } catch (error) {
        console.error('❌ Error fetching family members:', error);
        setError('❌ Unable to fetch data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchFamilyMembers();
  }, []);

  const handleMemberSelect = (member) => {
    setSelectedMember(member);     // ✅ Set selected member data
    localStorage.setItem('selectedFamilyId', member._id);  // ✅ Store familyId for access in other components
};


  return (
    <div className="bg-white rounded-lg shadow p-3">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-medium text-[#0e606e]">Family Members</h2>
        <Link to={'/PatientAddMemPage'} className="text-blue-500 hover:text-blue-700">
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
