import React, { useEffect, useState } from "react";
import UploadPopup from "./UploadPopup";

function HealthDocuments({ selectedMember, currentPatient }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showUploadPopup, setShowUploadPopup] = useState(false);

  useEffect(() => {
    if (!selectedMember || !currentPatient) return;

    const fetchDocuments = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/patient/get-family-member-documents/${selectedMember._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await response.json();
        if (data.success) {
          setDocuments(data.data);
        } else {
          setError("❌ No documents found");
        }
      } catch (error) {
        setError("❌ Failed to load documents");
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [selectedMember, currentPatient]);

  return (
    <div className="bg-white rounded-lg shadow p-3">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium text-[#0e606e]">
          {selectedMember
            ? `${selectedMember.fullName}'s Documents`
            : "Documents"}
        </h2>
        <button
          onClick={() => setShowUploadPopup(true)}
          className="bg-[#0e606e] text-white px-4 py-2 rounded-md flex items-center"
          disabled={!selectedMember}
        >
          <i className="ri-upload-2-line mr-1"></i>
          Upload New
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">⏳ Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="space-y-3">
          {documents.map((doc) => (
            <div key={doc._id} className="border rounded-md p-4">
              <h3 className="font-medium">{doc.documentName}</h3>
              <p className="text-sm text-gray-500">{doc.documentType}</p>
            </div>
          ))}
        </div>
      )}

      {selectedMember && (
        <UploadPopup
          isOpen={showUploadPopup}
          onClose={() => setShowUploadPopup(false)}
          familyId={selectedMember._id} // Pass the familyId instead of patientId
        />
      )}
    </div>
  );
}

export default HealthDocuments;
