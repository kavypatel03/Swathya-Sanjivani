import React, { useState, useEffect } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import UploadPopup from "./UploadPopup";

function PatientHealthDocuments({ selectedMember }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showUploadPopup, setShowUploadPopup] = useState(false);

  // Fetch documents when selectedMember changes
  useEffect(() => {
    const fetchDocuments = async () => {
      if (!selectedMember?._id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(
          `http://localhost:4000/patient/get-family-member-documents/${selectedMember._id}`,
          { withCredentials: true }
        );
        
        if (response.data.success) {
          setDocuments(response.data.data || []);
        } else {
          throw new Error(response.data.message || "Failed to fetch documents");
        }
      } catch (err) {
        console.error("Error fetching documents:", err);
        setError(err.response?.data?.message || err.message || "Failed to load documents");
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [selectedMember]);

  const refreshDocuments = async () => {
    if (!selectedMember?._id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(
        `http://localhost:4000/patient/get-family-member-documents/${selectedMember._id}`,
        { withCredentials: true }
      );
      
      if (response.data.success) {
        setDocuments(response.data.data || []);
      } else {
        throw new Error(response.data.message || "Failed to refresh documents");
      }
    } catch (err) {
      console.error("Error refreshing documents:", err);
      setError(err.response?.data?.message || err.message || "Failed to refresh documents");
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentUploaded = () => {
    setLoading(true);
    refreshDocuments();
  };

  const openPreview = (doc) => {
    if (!doc.document?._id) {
      alert("❌ Unable to open document. Document ID is missing.");
      return;
    }

    const fileUrl = doc.document.documentType?.toLowerCase() === 'prescription'
      ? `http://localhost:4000/patient/view-prescription/${doc.document._id}`
      : `http://localhost:4000/patient/view-document/${doc.document._id}`;
    
    window.open(fileUrl, "_blank", "noopener,noreferrer");
  };

  const downloadFile = async (doc) => {
    try {
      if (!doc.document?._id) {
        throw new Error("Document ID is missing");
      }

      let url, fileName;
      
      if (doc.document.documentType?.toLowerCase() === 'prescription') {
        url = `http://localhost:4000/patient/download-prescription/${doc.document._id}`;
        fileName = `${doc.document.documentName || 'prescription'}.pdf`;
      } else {
        url = `http://localhost:4000/patient/view-document/${doc.document._id}`;
        const extension = doc.document.file?.contentType?.split('/')[1] || 'bin';
        fileName = `${doc.document.documentName || 'document'}.${extension}`;
      }

      const response = await axios.get(url, {
        responseType: 'blob',
        withCredentials: true
      });

      const blob = new Blob([response.data], { 
        type: response.headers['content-type'] || 'application/octet-stream' 
      });
      saveAs(blob, fileName);
    } catch (error) {
      console.error("Download error", error);
      alert(`❌ Failed to download the document: ${error.message}`);
    }
  };

  const handleDelete = async (docId) => {
    const { default: Swal } = await import("sweetalert2");
    
    Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the document.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0e606e",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete it!",
      background: "#ffffff",
      iconColor: "#ff9700",
      color: "#4b5563"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(
            `http://localhost:4000/patient/delete-document/${docId}`,
            { withCredentials: true }
          );

          if (response.data.success) {
            await refreshDocuments();
            Swal.fire({
              title: "Deleted!",
              text: "The document has been deleted.",
              icon: "success",
              confirmButtonText: "Done",
              confirmButtonColor: "#0e606e",
              iconColor: "#0e606e"
            });
          } else {
            throw new Error(response.data.message);
          }
        } catch (error) {
          console.error("Delete error", error);
          Swal.fire({
            title: "Error!",
            text: error.response?.data?.message || "Failed to delete document",
            icon: "error",
            confirmButtonColor: "#ef4444"
          });
        }
      }
    });
  };

  // Custom scrollbar styles for webkit browsers
  const scrollbarWebkitStyles = `
    .custom-scrollbar::-webkit-scrollbar {
      width: 12px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background-color: #0e606e;
      border-radius: 20px;
    }
    .custom-scrollbar::-webkit-scrollbar-button {
      height: 0;
      width: 0;
      background: transparent;
    }
  `;

  return (
    <div className="relative bg-white rounded-lg shadow p-4 h-[525px]">
      <style>{scrollbarWebkitStyles}</style>

      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-medium text-[#0e606e]">
          {selectedMember?.fullName
            ? `${selectedMember.fullName}'s Documents`
            : "Documents"}
        </h2>
        <div className="flex space-x-4">
          <button 
            onClick={refreshDocuments}
            className="text-[#0e606e] hover:text-[#0e606e]/80"
            title="Refresh documents"
          >
            <i className="ri-refresh-line text-xl" />
          </button>
          <button
            onClick={() => setShowUploadPopup(true)}
            className="bg-[#0e606e] text-white px-4 py-2 rounded-md flex items-center"
            disabled={!selectedMember?._id}
          >
            <i className="ri-upload-2-line mr-1"></i>
            Upload New
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-[430px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0e606e]"></div>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-[430px] text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={refreshDocuments}
            className="px-4 py-2 bg-[#0e606e] text-white rounded hover:bg-[#0e606e]/90"
          >
            Retry
          </button>
        </div>
      ) : (
        <div 
          className={`space-y-6 pl-1 pr-4 ${documents.length > 4 ? 'overflow-y-auto custom-scrollbar h-[430px]' : 'h-auto max-h-[430px]'}`}
          style={{
            scrollbarWidth: 'auto',
            scrollbarColor: '#0e606e transparent',
            paddingRight: documents.length > 4 ? '16px' : '0',
          }}
        >
          {documents.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[430px] text-center">
              <i className="ri-folder-open-line text-4xl text-gray-400 mb-2"></i>
              <p className="text-gray-500">No documents available for this family member.</p>
              <button
                onClick={refreshDocuments}
                className="mt-4 px-4 py-2 bg-[#0e606e] text-white rounded hover:bg-[#0e606e]/90"
              >
                Refresh
              </button>
            </div>
          ) : (
            documents.map((doc) => {
              const docId = doc.document?._id;
              const name = doc.document?.documentName || "Untitled Document";

              return (
                <div key={docId} className="border rounded-md p-5 flex justify-between items-center hover:shadow-md transition-shadow">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{name}</h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                      <p className="text-sm text-gray-500 capitalize">
                        Type: {doc.document?.documentType || 'unknown'}
                      </p>
                      {doc.uploadedAt && (
                        <p className="text-sm text-gray-500">
                          Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-4 items-center ml-4">
                    <button 
                      className="text-blue-500 hover:text-blue-700 transition-colors" 
                      onClick={() => openPreview(doc)}
                      title="Preview Document"
                    >
                      <i className="ri-eye-line text-2xl" />
                    </button>
                    <button
                      onClick={() => downloadFile(doc)}
                      className="text-green-500 hover:text-green-700 transition-colors"
                      title="Download Document"
                    >
                      <i className="ri-download-2-line text-2xl" />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700 transition-colors"
                      onClick={() => handleDelete(docId)}
                      title="Delete Document"
                    >
                      <i className="ri-delete-bin-line text-2xl" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Upload Popup */}
      {selectedMember?._id && (
        <UploadPopup
          isOpen={showUploadPopup}
          onClose={() => {
            setShowUploadPopup(false);
            handleDocumentUploaded();
          }}
          familyId={selectedMember._id}
        />
      )}
    </div>
  );
}

export default PatientHealthDocuments;