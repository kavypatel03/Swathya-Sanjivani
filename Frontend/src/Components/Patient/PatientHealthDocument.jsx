import React, { useEffect, useState } from "react";
import axios from "axios"; // Make sure to import axios
import UploadPopup from "./UploadPopup";

function HealthDocuments({ selectedMember, currentPatient, setSelectedMember }) {
  console.log("Selected Member:", selectedMember);
  console.log("Current Patient:", currentPatient); // Add this to debug
  
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  
  // ✅ Function to fetch documents
  const fetchDocuments = async () => {
    if (!selectedMember?._id) {
      console.warn("❌ No Selected Member ID - fetchDocuments Skipped");
      setLoading(false);
      return;
    }
    
    console.log("✅ Fetching Documents for:", selectedMember._id);
    
    try {
      // Use the correct endpoint from your backend
      const response = await axios.get(`http://localhost:4000/patient/get-family-member-documents/${selectedMember._id}`, {
        withCredentials: true // Important for cookies/auth
      });
      
      console.log("📄 Documents Fetched:", response.data);
      
      if (response.data.success) {
        setDocuments(response.data.data || []);
      } else {
        setError(response.data.message || "Failed to load documents");
      }
    } catch (error) {
      console.error("❌ Error fetching documents:", error);
      setError("Error loading documents. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    // Retrieve from localStorage in case state resets
    const storedMember = localStorage.getItem('selectedFamilyId');
    
    if (!selectedMember?._id && storedMember) {
      console.log("🔄 Restoring selectedMember from localStorage:", storedMember);
      setSelectedMember({ _id: storedMember });  // ✅ Restores data if missing
      return; // Wait for the next render with updated selectedMember
    }
    
    if (selectedMember?._id) {
      console.log("🚀 Triggering fetchDocuments with:", selectedMember._id);
      setLoading(true); // Set loading to true when starting fetch
      fetchDocuments();
    } else {
      console.warn("❌ No Selected Member ID Found");
      setLoading(false);
    }
  }, [selectedMember, setSelectedMember]);

  // ✅ Handle new document uploads
  const handleDocumentUploaded = () => {
    setLoading(true);
    fetchDocuments(); // Refresh document list after upload
  };

  return (
    <div className="bg-white rounded-lg shadow p-3">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium text-[#0e606e]">
          {selectedMember?.fullName
            ? `${selectedMember.fullName}'s Documents`
            : "Documents"}
        </h2>
        <button
          onClick={() => setShowUploadPopup(true)}
          className="bg-[#0e606e] text-white px-4 py-2 rounded-md flex items-center"
          disabled={!selectedMember?._id}
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
          {!documents || documents.length === 0 ? (
            <p className="text-center text-gray-500">📄 No documents uploaded yet.</p>
          ) : (
            documents.map((doc) => (
              <div key={doc._id} className="border rounded-md p-4">
              <h3 className="font-medium">{doc.document?.documentName || "Untitled"}</h3>
              <p className="text-sm text-gray-500">Type: {doc.document?.documentType || "Unknown"}</p>
              {doc.document?.uploadedAt && (
                <p className="text-sm text-gray-500">
                  Uploaded: {new Date(doc.document.uploadedAt).toLocaleString()}
                </p>
              )}
              <button
                className="text-blue-500 hover:underline"
                onClick={() => {
                  // You'll need to implement proper document viewing logic here
                  console.log("View document:", doc.document?._id);
                }}
              >
                View Document
              </button>
            </div>
            ))
          )}
        </div>
      )}
      
      {/* ✅ Upload Popup with refresh trigger */}
      {selectedMember?._id && (
        <UploadPopup
          isOpen={showUploadPopup}
          onClose={() => {
            setShowUploadPopup(false);
            handleDocumentUploaded(); // ✅ Refresh documents on close
          }}
          familyId={selectedMember._id}
        />
      )}
    </div>
  );
}

export default HealthDocuments;