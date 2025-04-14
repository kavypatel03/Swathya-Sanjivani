import React, { useState } from 'react';
import UploadPopup from './UploadPopup';

const UploadFile = () => {
  const [showUploadPopup, setShowUploadPopup] = useState(false);

  const handleUploadClick = () => {
    const patientId = localStorage.getItem('selectedPatientId');
    const familyId = localStorage.getItem('selectedFamilyMemberId');

    if (!patientId || !familyId) {
      alert('Please select a patient and family member first');
      return;
    }
    setShowUploadPopup(true);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <h2 className="text-[#0e606e] font-medium text-lg mb-4">Upload New Files</h2>
      <div className="border-2 border-dashed border-gray-300 rounded-md p-8 flex flex-col items-center justify-center">
        <div className="bg-gray-100 rounded-full p-2 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" viewBox="0 0 24 24">
            <path fill="currentColor" d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>
          </svg>
        </div>
        <p className="text-gray-500 mb-4">Click below to upload documents</p>
        <button 
          onClick={handleUploadClick}
          className="bg-[#0e606e] text-white px-4 py-2 rounded-md"
        >
          Select Files
        </button>
      </div>

      {showUploadPopup && (
        <UploadPopup
          isOpen={showUploadPopup}
          onClose={() => setShowUploadPopup(false)}
          patientId={localStorage.getItem('selectedPatientId')}
          familyId={localStorage.getItem('selectedFamilyMemberId')}
          isAssistant={true}
        />
      )}
    </div>
  );
};

export default UploadFile;