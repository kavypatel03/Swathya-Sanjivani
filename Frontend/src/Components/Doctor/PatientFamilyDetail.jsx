import React, { useState, useEffect } from 'react';

const PatientFamilyDetail = () => {
  const [memberDetails, setMemberDetails] = useState({
    fullName: "",
    mobileNumber: "",
    email: "",
    birthDate: "",
    age: "",
    relation: "",
    gender: ""
  });

  useEffect(() => {
    const handleFamilyMemberSelected = (e) => {
      const { familyMember } = e.detail;
      
      // Format birthDate to show only date portion
      let formattedBirthDate = "N/A";
      if (familyMember.birthDate) {
        try {
          // Handle both ISO string and Date object
          const dateObj = new Date(familyMember.birthDate);
          if (!isNaN(dateObj)) {
            formattedBirthDate = dateObj.toLocaleDateString('en-GB'); // DD/MM/YYYY format
            // OR for YYYY-MM-DD format:
            // formattedBirthDate = dateObj.toISOString().split('T')[0];
          }
        } catch (e) {
          console.error("Error formatting date:", e);
        }
      }

      setMemberDetails({
        fullName: familyMember.fullName || "N/A",
        mobileNumber: familyMember.mobile || "N/A",
        email: familyMember.email || "N/A",
        birthDate: formattedBirthDate,
        age: familyMember.age || "N/A",
        relation: familyMember.relationWithMainPerson || "N/A",
        gender: familyMember.gender || "N/A"
      });
    };

    window.addEventListener('familyMemberSelected', handleFamilyMemberSelected);
    
    return () => {
      window.removeEventListener('familyMemberSelected', handleFamilyMemberSelected);
    };
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-teal-800 mb-4">Patient Family Member Details</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">Full Name</label>
          <input 
            type="text" 
            className="w-full p-2 border border-gray-300 rounded bg-gray-50" 
            value={memberDetails.fullName}
            readOnly
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2">Mobile Number</label>
          <input 
            type="text" 
            className="w-full p-2 border border-gray-300 rounded bg-gray-50" 
            value={memberDetails.mobileNumber}
            readOnly
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2">E-mail Address</label>
          <input 
            type="email" 
            className="w-full p-2 border border-gray-300 rounded bg-gray-50" 
            value={memberDetails.email}
            readOnly
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2">Birth Date</label>
          <input 
            type="text" 
            className="w-full p-2 border border-gray-300 rounded bg-gray-50" 
            value={memberDetails.birthDate}
            readOnly
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2">Age</label>
          <input 
            type="text" 
            className="w-full p-2 border border-gray-300 rounded bg-gray-50" 
            value={memberDetails.age}
            readOnly
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2">Relation With Main Person</label>
          <input 
            type="text" 
            className="w-full p-2 border border-gray-300 rounded bg-gray-50" 
            value={memberDetails.relation}
            readOnly
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2">Gender</label>
          <input 
            type="text" 
            className="w-full p-2 border border-gray-300 rounded bg-gray-50" 
            value={memberDetails.gender}
            readOnly
          />
        </div>
      </div>
      
      <div className="flex justify-end mt-6">
        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors">
          Back
        </button>
      </div>
    </div>
  );
};

export default PatientFamilyDetail;