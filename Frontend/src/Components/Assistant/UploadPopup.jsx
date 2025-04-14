import React, { useState, useEffect } from "react";
import axios from "axios";

const UploadPopup = ({ isOpen, onClose, familyId, patientId }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentName, setDocumentName] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");

  useEffect(() => {
    if (isOpen) {
      setSelectedFile(null);
      setDocumentName("");
      setDocumentType("");
      setUploadStatus("");
    }
  }, [isOpen]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const allowedType = "application/pdf";
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (file && file.type === allowedType) {
      if (file.size > maxSize) {
        setUploadStatus("❌ File size exceeds 5MB limit.");
        setSelectedFile(null);
      } else {
        setSelectedFile(file);
        setUploadStatus("");
      }
    } else {
      setUploadStatus("❌ Only PDF files are allowed.");
      setSelectedFile(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !documentName || !documentType) {
      setUploadStatus("❌ All fields are required");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("documentName", documentName);
    formData.append("documentType", documentType);
    formData.append("patientId", patientId);
    formData.append("familyMemberId", familyId);

    try {
      const response = await axios.post(
        'http://localhost:4000/assistant/upload-document',
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true
        }
      );

      if (response.data.success) {
        setUploadStatus("✅ Document uploaded successfully!");
        // Trigger document refresh event
        window.dispatchEvent(new CustomEvent('documentUploaded'));
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus(`❌ ${error.response?.data?.message || "Upload failed"}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[450px]">
        <h2 className="text-xl font-semibold text-[#0e606e] mb-4">Upload Document</h2>

        <div className="space-y-3">
          <input
            type="text"
            placeholder="Document Name"
            value={documentName}
            onChange={(e) => setDocumentName(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#0e606e]"
          />

          <select
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#0e606e]"
          >
            <option value="">Select Document Type</option>
            <option value="Lab Reports">Lab Reports</option>
            <option value="X-Rays">X-Rays</option>
            <option value="Others">Others</option>
          </select>
        </div>

        <div className="border-dashed border-2 border-gray-300 p-6 text-center rounded-lg mt-4">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
            id="fileInput"
          />
          <label htmlFor="fileInput" className="cursor-pointer">
            <svg className="w-10 h-10 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-gray-600 font-medium">
              {selectedFile ? selectedFile.name : "Click to upload PDF"}
            </p>
            <p className="text-xs text-gray-400 mt-1">(Max size: 5MB)</p>
          </label>
        </div>

        {uploadStatus && (
          <div className={`p-2 mt-3 rounded text-sm ${
            uploadStatus.startsWith("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
            {uploadStatus}
          </div>
        )}

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
            disabled={!selectedFile}
          >
            Upload Document
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadPopup;
