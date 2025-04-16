import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FamilyMembers = () => {
  const [members, setMembers] = useState([]);
  const [selectedMemberId, setSelectedMemberId] = useState(null);

  useEffect(() => {
    const loadInitialFamily = async () => {
      const storedPatientId = localStorage.getItem('selectedPatientId');
      const storedFamilyId = localStorage.getItem('selectedFamilyMemberId');
      
      if (storedPatientId) {
        try {
          const response = await axios.get(
            `http://localhost:4000/assistant/patient-family/${storedPatientId}`,
            { withCredentials: true }
          );
          
          if (response.data.success) {
            const formattedMembers = response.data.data.map(member => ({
              ...member,
              dob: new Date(member.dob).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
              })
            }));
            
            setMembers(formattedMembers);
            
            // Select stored family member or first one
            const familyIdToSelect = storedFamilyId || 
              (formattedMembers.length > 0 && formattedMembers[0]._id);
            
            if (familyIdToSelect) {
              handleSelect(familyIdToSelect);
            }
          }
        } catch (error) {
          console.error('Error loading initial family:', error);
        }
      }
    };

    loadInitialFamily();

    const handlePatientSelected = async (event) => {
      const patientId = event.detail.patientId;
      try {
        const response = await axios.get(
          `http://localhost:4000/assistant/patient-family/${patientId}`,
          { withCredentials: true }
        );
        
        if (response.data.success) {
          const formattedMembers = response.data.data.map(member => ({
            ...member,
            // Format date to match your display requirements
            dob: new Date(member.dob).toLocaleDateString('en-IN', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit'
            })
          }));
          
          setMembers(formattedMembers);
          if (formattedMembers.length > 0) {
            setSelectedMemberId(formattedMembers[0]._id);
            localStorage.setItem('selectedFamilyMemberId', formattedMembers[0]._id);
          }
        }
      } catch (error) {
        console.error('Error fetching family members:', error);
      }
    };

    window.addEventListener('patientSelected', handlePatientSelected);
    return () => window.removeEventListener('patientSelected', handlePatientSelected);
  }, []);

  const handleSelect = (memberId) => {
    setSelectedMemberId(memberId);
    localStorage.setItem('selectedFamilyMemberId', memberId);

    // Dispatch event with both IDs for document loading
    const event = new CustomEvent('familyMemberSelected', {
      detail: { 
        patientId: localStorage.getItem('selectedPatientId'),
        familyMemberId: memberId
      }
    });
    window.dispatchEvent(event);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h2 className="text-[#0e606e] font-medium text-lg mb-4">Family Members</h2>
      {members.length === 0 ? (
        <p className="text-center text-gray-500">Select a patient to view family members</p>
      ) : (
        members.map((member) => (
          <div key={member._id} className="mb-4 flex justify-between items-center">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full mr-3 border-2 border-[#0e606e] overflow-hidden">
                <img
                      src={member.gender === 'Male' ? 'https://avatar.iran.liara.run/public/boy' : 'https://avatar.iran.liara.run/public/girl'}
                      alt={member.gender}
                      className="h-full w-full object"
                    />
              </div>
              <div>
                <p className="font-medium">{member.fullname}</p>
                <p className="text-gray-500 text-xs">DOB: {member.dob}</p>
                <p className="text-gray-500 text-xs">Age: {member.age}</p>
                <p className="text-gray-500 text-xs">Relation: {member.relation}</p>
              </div>
            </div>
            <button 
              className={`${
                selectedMemberId === member._id 
                  ? 'bg-[#0e606e] text-white' 
                  : 'border border-[#0e606e] text-[#0e606e]'
              } px-4 py-1 rounded-md`}
              onClick={() => handleSelect(member._id)}
            >
              {selectedMemberId === member._id ? 'Selected' : 'Select'}
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default FamilyMembers;