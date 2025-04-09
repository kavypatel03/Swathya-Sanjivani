import React, { useEffect, useState } from "react";
import axios from "axios";
import UploadPopup from "./UploadPopup";
import { saveAs } from "file-saver";

function HealthDocuments({ selectedMember, currentPatient, setSelectedMember }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showUploadPopup, setShowUploadPopup] = useState(false);

  const fetchDocuments = async () => {
    if (!selectedMember?._id) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:4000/patient/get-family-member-documents/${selectedMember._id}`,
        { withCredentials: true }
      );

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
    const storedMember = localStorage.getItem("selectedFamilyId");

    if (!selectedMember?._id && storedMember) {
      setSelectedMember({ _id: storedMember });
      return;
    }

    if (selectedMember?._id) {
      setLoading(true);
      fetchDocuments();
    }
  }, [selectedMember, setSelectedMember]);

  const handleDocumentUploaded = () => {
    setLoading(true);
    fetchDocuments();
  };

  const handleDelete = (docId) => {
    import("sweetalert2").then((Swal) => {
      Swal.default
        .fire({
          title: "Are you sure?",
          text: "This will permanently delete the document.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#0e606e", 
          cancelButtonColor: "#ef4444",
          confirmButtonText: "Yes, delete it!",
          background: "#ffffff",
          iconColor: "#ff9700",
          Color: "#4b5563"
        })
        .then((result) => {
          if (result.isConfirmed) {
            axios
              .delete(`http://localhost:4000/patient/delete-document/${docId}`, {
                withCredentials: true,
              })
              .then((res) => {
                if (res.data.success) {
                  setDocuments((prev) => prev.filter((d) => d.document?._id !== docId));
                  Swal.default.fire({
                    title: "Deleted!",
                    text: "The document has been deleted.",
                    icon: "success",
                    confirmButtonText: "Done",
                    confirmButtonColor:"#0e606e",
                    iconColor: "#0e606e"
                  });
                } else {
                  Swal.default.fire("Failed!", res.data.message, "error");
                }
              })
              .catch((error) => {
                console.error("Delete error", error);
                Swal.default.fire("Error!", "Something went wrong.", "error");
              });
          }
        });
    });
  };

  const openPreview = (doc) => {
    const fileUrl = doc.document?.fileUrl;
    if (fileUrl) {
      window.open(fileUrl, "_blank", "noopener,noreferrer");
    } else {
      alert("❌ Unable to open document. File URL is missing.");
    }
  };

  const downloadFile = async (url, filename) => {
    try {
      const response = await fetch(url, { credentials: "include" });
      const blob = await response.blob();
      saveAs(blob, filename);
    } catch (error) {
      console.error("Download error", error);
      alert("❌ Failed to download the document.");
    }
  };

  return (
    <div className="relative bg-white rounded-lg shadow p-4 ">
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
        <div className="space-y-6 pr-3 overflow-y-auto h-[430px]">
          {(!documents || documents.length === 0) ? (
            <p className="text-center text-gray-500">📄 No documents uploaded yet.</p>
          ) : (
            documents.map((doc) => {
              const docId = doc.document?._id;
              const fileUrl = doc.document?.fileUrl;
              const name = doc.document?.documentName || "Untitled";

              return (
                <div key={docId} className="border rounded-md p-5 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{name}</h3>
                    {doc.document?.uploadedAt && (
                      <p className="text-sm text-gray-500">
                        Uploaded: {new Date(doc.document.uploadedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-5 items-center">
                    <button className="text-blue-500 hover:text-blue-700" onClick={() => openPreview(doc)}>
                      <i className="ri-eye-line text-2xl" />
                    </button>
                    <button
                      onClick={() => downloadFile(fileUrl, name)}
                      className="text-green-500 hover:text-green-700"
                      title="Download Document"
                    >
                      <i className="ri-download-2-line text-2xl" />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(docId)}
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

export default HealthDocuments;
