import React, { useState, useEffect } from 'react';

function FamilyMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasPatients, setHasPatients] = useState(false);

  useEffect(() => {
    const checkPatientAccess = async () => {
      try {
        const response = await fetch('http://localhost:4000/doctor/check-patient-access', {
          method: 'GET',
          credentials: 'include'
        });
        
        const data = await response.json();
        if (data.success) {
          setHasPatients(data.hasPatients);
          if (data.hasPatients) {
            const familyResponse = await fetch('http://localhost:4000/doctor/get-patient-family', {
              method: 'GET',
              credentials: 'include'
            });
            const familyData = await familyResponse.json();
            if (familyData.success) {
              setMembers(familyData.data);
            }
          }
        }
      } catch (error) {
        console.error('Error checking patient access:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkPatientAccess();
  }, []);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (!hasPatients) {
    return (
      <div className="bg-white rounded-lg shadow p-6 mt-4">
        <div className="text-center">
          <div className="text-4xl mb-3">👨‍⚕️</div>
          <h2 className="text-xl font-medium text-[#0e606e] mb-2">No Patient Access Yet</h2>
          <p className="text-gray-600 mb-4">To view patient family members, first add a patient using their mobile number.</p>
          <p className="text-sm text-gray-500">Use the form above to request patient access</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-3 mt-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-medium text-[#0e606e]">Family Members</h2>
      </div>
      
      <div className="space-y-4">
        {members.map(member => (
          <div
            key={member._id}
            className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50"
          >
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-[#e0f7fa] flex items-center justify-center">
                {member.avatar || "👨"}
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
    </div>
  );
}

export default FamilyMembers;