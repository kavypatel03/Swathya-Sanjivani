import React, { useState, useEffect } from "react";
import axios from "axios";

const UploadPopup = ({ isOpen, onClose, familyId }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentName, setDocumentName] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");

  useEffect(() => {
    if (isOpen) {
      resetFields();
    }
  }, [isOpen]);

  const resetFields = () => {
    setSelectedFile(null);
    setDocumentName("");
    setDocumentType("");
    setUploadStatus("");
  };

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
    if (!selectedFile) {
      setUploadStatus("❌ Please select a PDF file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("documentName", documentName);
    formData.append("documentType", documentType);

    try {
      const response = await axios.post(
        `http://localhost:4000/patient/upload/${familyId}`,
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
        resetFields();
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to upload document";
      setUploadStatus(`❌ ${errorMessage}`);
    }
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[450px]">
        <h2 className="text-xl font-semibold text-[#0e606e] mb-4">Upload PDF Document</h2>

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

        {/* File Upload Section */}
        <div className="border-dashed border-2 border-gray-300 p-6 text-center rounded-lg mt-4 mb-4">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
            id="fileInput"
          />
          <label htmlFor="fileInput" className="cursor-pointer">
            <i className="ri-upload-cloud-line text-4xl text-gray-400 mb-2" />
            <p className="text-gray-600 font-medium">
              {selectedFile ? selectedFile.name : "Click to upload PDF"}
            </p>
            <p className="text-xs text-gray-400 mt-1">(Only PDF up to 5MB)</p>
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
            onClick={handleClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            className="px-4 py-2 bg-[#0e606e] text-white rounded hover:bg-[#0b4853] disabled:opacity-50"
            disabled={!selectedFile}
          >
            Upload PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadPopup;
