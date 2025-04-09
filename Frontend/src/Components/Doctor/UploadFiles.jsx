import React, { useState } from "react";
import UploadPopup from "./UploadPopup";

const UploadFiles = ({ selectedMember, onDocumentUploaded }) => {
 const [showUploadPopup, setShowUploadPopup] = useState(false);

  const handleUploadComplete = () => {
    setShowUploadPopup(false);
    // Notify parent component to refresh documents
    if (onDocumentUploaded) {
      onDocumentUploaded();
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm my-4">
      <h3 className="text-[#0e606e] text-lg font-semibold mb-4">Upload New Files</h3>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 flex flex-col items-center justify-center">
        <div className="text-gray-400 mb-4">
          <i className="ri-upload-cloud-line text-4xl"></i>
        </div>
        <p className="text-gray-500 text-center mb-6">Drag and drop files here, or click to select files</p>
        <button
          onClick={() => setShowUploadPopup(true)}
          className="bg-[#0e606e] text-white px-4 py-2 rounded-md flex items-center"
          disabled={!selectedMember?._id}
        >
          <i className="ri-upload-2-line mr-1"></i>
          Upload New
        </button>
      </div>

      {/* Upload Popup */}
      {selectedMember?._id && (
        <UploadPopup
          isOpen={showUploadPopup}
          onClose={() => {
            setShowUploadPopup(false);
            handleDocumentUploaded();
          }}
          familyId={selectedMember._id}
          patientId={selectedMember.patientId}
          isDoctor={true}
        />
      )}
    </div>
  );
};

export default UploadFiles;