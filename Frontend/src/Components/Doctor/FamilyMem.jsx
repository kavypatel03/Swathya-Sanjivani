import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MemberCard = ({ member, isSelected, onClick }) => {
  return (
    <div 
      className={`flex items-center justify-between mb-4 cursor-pointer p-3 rounded-md transition-all duration-200 ${
        isSelected 
          ? 'bg-teal-50 border-l-4 border-teal-800' 
          : 'hover:bg-gray-50 border-l-4 border-transparent'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className={`w-12 h-12 rounded-full overflow-hidden mr-3 ${
          isSelected ? 'ring-2 ring-teal-800' : ''
        }`}>
          <img
            src={member.gender === 'Female' 
              ? 'https://avatar.iran.liara.run/public/girl' 
              : 'https://avatar.iran.liara.run/public/boy'}
            alt={member.fullName}
            className="h-full w-full object-cover"
            onError={(e) => {
              // Fallback to gender emoji if image fails to load
              e.target.src = `data:image/svg+xml,${encodeURIComponent(
                `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="#${member.gender === 'Female' ? 'ff69b4' : '1e90ff'}">
                  <circle cx="50" cy="30" r="20"/>
                  <circle cx="50" cy="75" r="30"/>
                  <text x="50" y="35" font-size="30" text-anchor="middle" fill="white">${
                    member.gender === 'Female' ? '♀' : '♂'
                  }</text>
                </svg>`
              )}`;
            }}
          />
        </div>
        <div>
          <h3 className={`font-medium ${
            isSelected ? 'text-teal-800' : 'text-gray-800'
          }`}>
            {member.fullName}
          </h3>
          <p className={`text-sm ${
            isSelected ? 'text-teal-600' : 'text-gray-600'
          }`}>
            Age: {member.age || 'N/A'}
          </p>
          <p className={`text-sm ${
            isSelected ? 'text-teal-600' : 'text-gray-600'
          }`}>
            Relation: {member.relationWithMainPerson || 'N/A'}
          </p>
        </div>
      </div>
      <button 
        className={`px-3 py-1 rounded transition-colors ${
          isSelected
            ? 'bg-teal-800 text-white'
            : 'border border-teal-800 text-teal-800 hover:bg-teal-800 hover:text-white'
        }`}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        {isSelected ? 'Selected' : 'Select'}
      </button>
    </div>
  );
};

const FamilyMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [patientId, setPatientId] = useState(null);

  const fetchFamilyMembers = async (pid = null) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication token not found');

      const currentPatientId = pid || localStorage.getItem('selectedPatientId');
      if (!currentPatientId) {
        setMembers([]);
        return;
      }

      setPatientId(currentPatientId);

      const response = await axios.get(
        `http://localhost:4000/doctor/get-patient-family?patientId=${currentPatientId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );

      if (response.data.success) {
        const familyMembers = response.data.data || [];
        setMembers(familyMembers);
        
        // Set selected family member
        const storedFamilyId = localStorage.getItem('doctorSelectedFamilyId');
        if (storedFamilyId && familyMembers.some(m => m._id === storedFamilyId)) {
          setSelectedId(storedFamilyId);
        } else if (familyMembers.length > 0) {
          setSelectedId(familyMembers[0]._id);
          localStorage.setItem('doctorSelectedFamilyId', familyMembers[0]._id);
          dispatchFamilyMemberSelected(familyMembers[0]);
        }
      } else {
        setError(response.data.message || 'Failed to load family members');
      }
    } catch (err) {
      console.error('Error fetching family members:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load family members');
    } finally {
      setLoading(false);
    }
  };

  const dispatchFamilyMemberSelected = (member) => {
    const patientContactInfo = JSON.parse(localStorage.getItem('patientContactInfo')) || {
      mobile: 'N/A',
      email: 'N/A'
    };

    let formattedBirthDate = "N/A";
    if (member.birthDate) {
      try {
        const dateObj = new Date(member.birthDate);
        if (!isNaN(dateObj)) {
          formattedBirthDate = dateObj.toLocaleDateString('en-GB');
        }
      } catch (e) {
        console.error("Error formatting date:", e);
      }
    }

    const event = new CustomEvent('familyMemberSelected', {
      detail: { 
        familyMember: {
          fullName: member.fullName,
          mobile: patientContactInfo.mobile,
          email: patientContactInfo.email,
          birthDate: formattedBirthDate,
          age: member.age,
          relationWithMainPerson: member.relationWithMainPerson,
          gender: member.gender
        },
        familyMemberId: member._id 
      }
    });
    window.dispatchEvent(event);
  };

  useEffect(() => {
    fetchFamilyMembers();

    const handlePatientSelected = (e) => {
      const { patientId: newPatientId } = e.detail;
      fetchFamilyMembers(newPatientId);
    };

    window.addEventListener('patientSelected', handlePatientSelected);
    
    return () => {
      window.removeEventListener('patientSelected', handlePatientSelected);
    };
  }, []);

  const handleMemberSelect = (member) => {
    setSelectedId(member._id);
    localStorage.setItem('doctorSelectedFamilyId', member._id);
    dispatchFamilyMemberSelected(member);
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold text-teal-800 mb-4">Family Members</h2>
        <div className="text-center py-4">Loading family members...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold text-teal-800 mb-4">Family Members</h2>
        <div className="text-center text-red-500 py-4">{error}</div>
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold text-teal-800 mb-4">Family Members</h2>
        <div className="text-center text-gray-500 py-4">
          No family members found for this patient
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-teal-800 mb-4">Family Members</h2>
      <div>
        {members.map(member => (
          <MemberCard
            key={member._id}
            member={member}
            isSelected={selectedId === member._id}
            onClick={() => handleMemberSelect(member)}
          />
        ))}
      </div>
    </div>
  );
};

export default FamilyMembers;