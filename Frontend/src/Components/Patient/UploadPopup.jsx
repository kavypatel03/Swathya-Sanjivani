import React, { useState, useEffect } from "react";
import axios from "axios";

const UploadPopup = ({ isOpen, onClose, familyId }) => { // Change patientId to familyId
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentName, setDocumentName] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  const [familyMembers, setFamilyMembers] = useState([]);
  const [selectedFamilyId, setSelectedFamilyId] = useState("");

  // Fetch family members when popup opens
  useEffect(() => {
    console.log("familyId:", familyId);  // Log familyId when the popup is opened
    const fetchFamilyMembers = async () => {
      const token = localStorage.getItem("token");
      
      // 1. Add token validation
      if (!token) {
        console.error("No authentication token found");
        setUploadStatus("❌ Please login again");
        return;
      }
  
      try {
        const response = await fetch("http://localhost:4000/patient/get-family-members", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`, // Ensure proper token format
            // Remove Content-Type for GET requests
          },
          credentials: "include" // Add if using cookies
        });
  
        // 2. Handle 401 specifically
        if (response.status === 401) {
          console.error("Token expired or invalid");
          localStorage.removeItem("token");
          window.location.reload(); // Force re-authentication
          return;
        }
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
        if (data.success) {
          setFamilyMembers(data.data || []);
        }
        
      } catch (error) {
        console.error("Fetch error:", error);
        setUploadStatus("❌ Failed to load family members");
      }
    };
  
    if (isOpen) fetchFamilyMembers();
  }, [isOpen, familyId]); // Log familyId whenever it changes
  

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const allowedTypes = ["application/pdf", "image/png", "image/jpeg"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (file && allowedTypes.includes(file.type)) {
      if (file.size > maxSize) {
        setUploadStatus("❌ File size exceeds 5MB limit.");
        setSelectedFile(null);
      } else {
        setSelectedFile(file);
        setUploadStatus("");
      }
    } else {
      setUploadStatus("❌ Only PDF, PNG, or JPG files are allowed.");
      setSelectedFile(null);
    }
  };

  const handleUpload = async () => {
  if (!selectedFile) {
    setUploadStatus("❌ Please select a file to upload");
    return;
  }

  console.log("familyId in handleUpload:", familyId);  // Log familyId before upload

  const formData = new FormData();
  formData.append("document", selectedFile);
  formData.append("documentName", documentName);
  formData.append("documentType", documentType);

  try {
    const response = await axios.post(
      `http://localhost:4000/patient/upload/${familyId}`, // Use familyId here
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (response.status === 201) {
      setUploadStatus("✅ Document uploaded successfully!");
      setTimeout(onClose, 1500);
    }
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to upload document";
    setUploadStatus(`❌ ${errorMessage}`);
  }
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[450px]">
        <h2 className="text-xl font-semibold text-[#0e606e] mb-4">Upload Document</h2>

        {/* Document Info Inputs */}
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Document Name"
            value={documentName}
            onChange={(e) => setDocumentName(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#0e606e]"
          />

          <input
            type="text"
            placeholder="Document Type (e.g., Prescription, Report)"
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#0e606e]"
          />
        </div>

        {/* Family Member Selection */}
        <div className="my-4">
          <h3 className="text-sm font-medium mb-2 text-gray-600">Select Family Member:</h3>
          <div className="border rounded p-2 max-h-40 overflow-y-auto">
            {familyMembers.length === 0 ? (
              <p className="text-gray-500 text-center py-2">No family members found</p>
            ) : (
              familyMembers.map((member) => (
                <div
                  key={member._id}
                  onClick={() => setSelectedFamilyId(member._id)}
                  className={`p-2 mb-1 rounded cursor-pointer transition-colors ${
                    selectedFamilyId === member._id
                      ? "bg-[#0e606e] text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{member.fullName}</span>
                    {selectedFamilyId === member._id && (
                      <span className="ml-2">✓</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {member.relationWithMainPerson} • Age: {member.age || 'N/A'}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* File Upload Section */}
        <div className="border-dashed border-2 border-gray-300 p-6 text-center rounded-lg mb-4">
          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={handleFileChange}
            className="hidden"
            id="fileInput"
          />
          <label htmlFor="fileInput" className="cursor-pointer">
            <i className="ri-upload-cloud-line text-4xl text-gray-400 mb-2" />
            <p className="text-gray-600 font-medium">
              {selectedFile ? selectedFile.name : "Click to upload document"}
            </p>
            <p className="text-xs text-gray-400 mt-1">(PDF, PNG, JPG up to 5MB)</p>
          </label>
        </div>

        {/* Status Messages */}
        {uploadStatus && (
          <div
            className={`p-2 rounded text-sm ${
              uploadStatus.startsWith("✅") 
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {uploadStatus}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            className="px-4 py-2 bg-[#0e606e] text-white rounded hover:bg-[#0b4853] disabled:opacity-50"
            disabled={!selectedFile || !selectedFamilyId}
          >
            Upload Document
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadPopup;