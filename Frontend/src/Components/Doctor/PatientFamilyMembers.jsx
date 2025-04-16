import React, { useState, useEffect } from 'react';

function FamilyMembers({ onMemberSelect }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasPatients, setHasPatients] = useState(false);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState(localStorage.getItem('doctorSelectedFamilyId') || '');
  const [patientId, setPatientId] = useState(null);

  // Custom scrollbar styles for webkit browsers
  const scrollbarWebkitStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 10px; // Increase this value to make the scrollbar wider
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #0e606e;
    border-radius: 20px;
  }
  .custom-scrollbar::-webkit-scrollbar-button {
    height: 0;
    width: 0;
    background: transparent;
  }
`;

  useEffect(() => {
    const fetchFamilyMembers = async () => {
      try {
        const selectedPatientId = localStorage.getItem('selectedPatientId');
        const existingFamilyId = localStorage.getItem('doctorSelectedFamilyId');
        
        if (selectedPatientId) {
          setPatientId(selectedPatientId);
          const familyResponse = await fetch(
            `http://localhost:4000/doctor/get-patient-family?patientId=${selectedPatientId}`,
            {
              method: 'GET',
              credentials: 'include',
            }
          );

          const familyData = await familyResponse.json();
          if (familyData.success) {
            const familyMembers = familyData.data || [];
            setMembers(familyMembers);
            setHasPatients(true);
            
            // Try to find existing selected member first
            const existingMember = familyMembers.find(m => m._id === existingFamilyId);
            const memberToSelect = existingMember || familyMembers[0];
            
            if (memberToSelect) {
              handleMemberSelect({ ...memberToSelect, patientId: selectedPatientId });
            }
          }
        } else {
          const accessResponse = await fetch('http://localhost:4000/doctor/check-patient-access', {
            method: 'GET',
            credentials: 'include',
          });

          const accessData = await accessResponse.json();

          if (accessData.success && accessData.hasPatients) {
            setHasPatients(true);
            const pid = accessData.firstPatientId;
            setPatientId(pid);

            const familyResponse = await fetch(`http://localhost:4000/doctor/get-patient-family?patientId=${pid}`, {
              method: 'GET',
              credentials: 'include',
            });

            const familyData = await familyResponse.json();

            if (familyData.success) {
              const familyMembers = familyData.data || [];
              setMembers(familyMembers);

              const storedId = localStorage.getItem('doctorSelectedFamilyId');
              const foundMember = familyMembers.find((m) => m._id === storedId);

              const defaultMember = foundMember || familyMembers[0];
              if (defaultMember) {
                handleMemberSelect({ ...defaultMember, patientId: pid });
              }
            } else {
              setError(familyData.message || 'Failed to load family members');
            }
          } else {
            setHasPatients(false);
          }
        }
      } catch (error) {
        console.error('Error:', error);
        setError('Network error. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFamilyMembers();

    const handlePatientSelection = () => {
      fetchFamilyMembers();
    };

    window.addEventListener('patientSelected', handlePatientSelection);
    
    return () => {
      window.removeEventListener('patientSelected', handlePatientSelection);
    };
  }, []);

  const handleMemberSelect = (member) => {
    const { documents, ...cleanedMember } = member;
    const selectedWithPatient = { ...cleanedMember, patientId };
    setSelectedId(member._id);
    localStorage.setItem('doctorSelectedFamilyId', member._id);

    onMemberSelect?.(selectedWithPatient);
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  if (!hasPatients) {
    return (
      <div className="bg-white rounded-lg shadow p-6 mt-4 h-[250px]">
        <div className="text-center">
          <div className="text-4xl mb-3">
            <img src="https://avatar.iran.liara.run/public/job/doctor/male" alt="Doctor" className="h-12 w-12" />
          </div>
          <h2 className="text-xl font-medium text-[#0e606e] mb-2">No Patient Access Yet</h2>
          <p className="text-gray-600 mb-4">
            To view patient family members, first add a patient using their mobile number.
          </p>
          <p className="text-sm text-gray-500">Use the form above to request patient access</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-3 mt-4 h-[290px]">
      <style>{scrollbarWebkitStyles}</style>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-medium text-[#0e606e]">Family Members</h2>
      </div>

      {members.length === 0 ? (
        <p className="text-center text-gray-500">No family members found</p>
      ) : (
        <div 
          className="space-y-4 custom-scrollbar overflow-y-auto max-h-[228px]"
          style={{
            scrollbarWidth: 'auto',
            scrollbarColor: '#0e606e transparent',
            paddingRight: '10px',
          }}
        >
          {members.map((member) => {
            const isSelected = selectedId === member._id;

            return (
              <div
                key={member._id}
                className={`flex justify-between items-center cursor-pointer p-2 rounded-md transition-colors duration-200 border-l-4 ${isSelected ? 'bg-[#e0f7fa] border-l-[#0e606e] shadow' : 'border-l-transparent hover:bg-gray-50'}`}
                onClick={() => handleMemberSelect(member)}
              >
                <div className="flex items-center">
                  <div className={`h-10 w-10 rounded-full overflow-hidden border-2 border-[#0e606e] ${isSelected ? 'bg-[#0e606e] text-white' : 'bg-[#e0f7fa] text-gray-600'} flex items-center justify-center`}>
                    <img
                      src={member.gender === 'Male' ? 'https://avatar.iran.liara.run/public/boy' : 'https://avatar.iran.liara.run/public/girl'}
                      alt={member.gender}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="ml-3">
                    <div className={`font-medium ${isSelected ? 'text-[#0e606e]' : ''}`}>{member.fullName}</div>
                    <div className="text-sm text-gray-500">
                      Age: {member.age || 'N/A'} | Relation: {member.relationWithMainPerson || 'N/A'}
                    </div>
                  </div>
                </div>
                {isSelected && <div className="text-[#0e606e]"><i className="ri-check-line"></i></div>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default FamilyMembers;
