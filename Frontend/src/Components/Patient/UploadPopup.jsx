import React, { useState, useEffect } from "react";
import axios from "axios";

const UploadPopup = ({ isOpen, onClose, patientId }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentName, setDocumentName] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  const [familyMembers, setFamilyMembers] = useState([]); // To store family members
  const [selectedFamilyId, setSelectedFamilyId] = useState(""); // To store the selected family member's ID

  useEffect(() => {
    const fetchFamilyMembers = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }
  
      try {
        const response = await fetch("http://localhost:4000/api/get-family-members", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
  
        if (!response.ok) throw new Error(`HTTP error! ${response.status}`);
  
        const data = await response.json();
        setFamilyMembers(data.data || data || []); // Handle both response formats
  
      } catch (error) {
        console.error("Fetch error:", error);
        setFamilyMembers([]);
      }
    };
  
    if (isOpen) fetchFamilyMembers();
  }, [isOpen]);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const allowedTypes = ["application/pdf", "image/png", "image/jpeg"];

    if (file && allowedTypes.includes(file.type)) {
      setSelectedFile(file);
      setUploadStatus("");
    } else {
      setUploadStatus("❌ Only PDF, PNG, or JPG files are allowed.");
      setSelectedFile(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFamilyId) {
      alert("❌ Please select a family member before uploading.");
      return;
    }

    if (!selectedFile) {
      setUploadStatus("❌ Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("documentName", documentName);
    formData.append("document", selectedFile); // Ensure file is added to formData

    try {
      const response = await axios.post(
        `http://localhost:4000/patient/upload/${patientId}/${selectedFamilyId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log("✅ Upload successful:", response.data);
      setUploadStatus("✅ Document uploaded successfully!");
    } catch (error) {
      console.error("❌ Upload error:", error);
      setUploadStatus("❌ Upload failed. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[450px]">
        <h2 className="text-xl font-semibold text-[#0e606e] mb-4">
          Upload Document
        </h2>

        <input
          type="text"
          placeholder="Document Name"
          value={documentName}
          onChange={(e) => setDocumentName(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />

        <input
          type="text"
          placeholder="Document Type (e.g., PDF, PNG)"
          value={documentType}
          onChange={(e) => setDocumentType(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />

        {/* Family member selection */}
        {/* UploadPopup.js */}
        <select
          value={selectedFamilyId}
          onChange={(e) => setSelectedFamilyId(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        >
          <option value="">Select Family Member</option>
          {familyMembers.length === 0 ? (
            <option disabled>No family members found</option>
          ) : (
            familyMembers.map((member) => (
              <option key={member._id} value={member._id}>
                {member.fullName}
              </option>
            ))
          )}
        </select>

        <div className="border-dashed border-2 border-gray-300 p-10 text-center rounded-lg cursor-pointer">
          <input
            type="file"
            accept=".pdf,.png,.jpg"
            onChange={handleFileChange}
            className="hidden"
            id="fileInput"
          />
          <label htmlFor="fileInput" className="block cursor-pointer">
            <i className="ri-upload-cloud-line text-6xl text-gray-400"></i>
            <p className="mt-2 text-gray-500 font-medium">
              {selectedFile ? selectedFile.name : "Upload PDF, PNG, or JPG"}
            </p>
            <p className="text-xs text-gray-400">(Max Size: 5MB)</p>
          </label>
        </div>

        {uploadStatus && (
          <div
            className={`mt-3 text-sm ${
              uploadStatus.includes("✅") ? "text-green-500" : "text-red-500"
            }`}
          >
            {uploadStatus}
          </div>
        )}

        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onClose}
            className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            className="bg-[#0e606e] text-white px-4 py-2 rounded-md hover:bg-[#0b5058]"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadPopup;
