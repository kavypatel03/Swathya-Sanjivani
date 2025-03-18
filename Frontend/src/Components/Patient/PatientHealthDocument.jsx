import React, { useEffect, useState } from "react";
import UploadPopup from "./UploadPopup";

function HealthDocuments({ selectedMember }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showUploadPopup, setShowUploadPopup] = useState(false);

  useEffect(() => {
    if (!selectedMember) return;  // ✅ Only fetch data when a member is selected

    const fetchDocuments = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/patient/get-family-member-documents/${selectedMember._id}`,
          { method: 'GET', credentials: 'include' }
        );

        const data = await response.json();
        if (data.success) {
          setDocuments(data.data); 
        } else {
          setError("❌ No documents found for this member.");
        }
      } catch (error) {
        console.error("❌ Error fetching documents:", error);
        setError("❌ Unable to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [selectedMember]);

  return (
    <div className="bg-white rounded-lg shadow p-3">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium text-[#0e606e]">
          {selectedMember ? `${selectedMember.fullName}'s Health Documents` : 'Health Documents'}
        </h2>
        <div className="flex space-x-2">
        <button
    onClick={() => setShowUploadPopup(true)}  // ✅ Correctly updates state
    className="bg-[#0e606e] text-white px-4 py-2 rounded-md flex items-center"
>
    <i className="ri-upload-2-line mr-1"></i>
    Upload New
</button>
        </div>
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
            </div>
          ))}
        </div>
      )}

<UploadPopup
    isOpen={showUploadPopup}
    onClose={() => setShowUploadPopup(false)}
    patientId={selectedMember ? selectedMember._id : ""}  // ✅ Correctly passing patientId
    familyId={selectedMember ? selectedMember._id : ""}   // ✅ Use `_id` for `familyId` instead of `selectedMember.familyId`
/>

    </div>
  );
}

export default HealthDocuments;
