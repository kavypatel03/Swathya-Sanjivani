import React from "react";
import axios from "axios";
import { saveAs } from "file-saver";

function PatientHealthDocuments({ selectedMember, documents, refreshDocuments, loading, error }) {
  const openPreview = (doc) => {
    if (doc.document?._id) {
      const fileUrl = doc.document.documentType.toLowerCase() === 'prescription'
        ? `http://localhost:4000/doctor/view-prescription/${doc.document._id}`
        : `http://localhost:4000/doctor/get-family-member-documents?documentId=${doc.document._id}&familyMemberId=${selectedMember._id}&patientId=${selectedMember.patientId}`;
      
      // Open the file URL in a new tab
      window.open(fileUrl, "_blank", "noopener,noreferrer");
    } else {
      alert("❌ Unable to open document. Document ID is missing.");
    }
  };

  const downloadFile = async (doc) => {
    try {
      if (doc.document?.documentType.toLowerCase() === 'prescription') {
        // Download prescription as a PDF
        const response = await axios.get(
          `http://localhost:4000/doctor/prescription-pdf/${doc.document._id}`,
          {
            responseType: 'blob',
            withCredentials: true
          }
        );
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${doc.document.documentName || 'prescription'}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        // Handle other documents
        const response = await axios.get(
          `http://localhost:4000/doctor/get-family-member-documents`,
          {
            params: {
              documentId: doc.document._id,
              familyMemberId: selectedMember._id,
              patientId: selectedMember.patientId
            },
            responseType: 'blob',
            withCredentials: true
          }
        );
        const blob = new Blob([response.data], { type: doc.document.file.contentType });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = doc.document.documentName || 'document.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Download error", error);
      alert("❌ Failed to download the document.");
    }
  };

  const handleDelete = (docId) => {
    import("sweetalert2").then((Swal) => {
      Swal.default.fire({
        title: "Are you sure?",
        text: "This will permanently delete the document.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#0e606e",
        cancelButtonColor: "#ef4444",
        confirmButtonText: "Yes, delete it!",
        background: "#ffffff",
        iconColor: "#ff9700"
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const response = await axios.delete(
              `http://localhost:4000/doctor/delete-document/${docId}`,
              {
                withCredentials: true,
                data: {
                  familyMemberId: selectedMember._id,
                  patientId: selectedMember.patientId
                }
              }
            );

            if (response.data.success) {
              refreshDocuments();
              Swal.default.fire({
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
            Swal.default.fire({
              title: "Error!",
              text: error.response?.data?.message || "Failed to delete document",
              icon: "error",
              confirmButtonColor: "#ef4444"
            });
          }
        }
      });
    });
  };

  return (
    <div className="relative bg-white rounded-lg shadow p-3 mt-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium text-[#0e606e]">
          {selectedMember?.fullName
            ? `${selectedMember.fullName}'s Documents`
            : "Documents"}
        </h2>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">⏳ Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="space-y-6 overflow-y-auto max-h-[440px]">
          {(!documents || documents.length === 0) ? (
            <p className="text-center text-gray-500">📄 No documents available for this family member.</p>
          ) : (
            documents.map((doc) => {
              const docId = doc.document?._id;
              const name = doc.document?.documentName || "Untitled";

              return (
                <div key={docId} className="border rounded-md p-5 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{name}</h3>
                    {doc.uploadedAt && (
                      <p className="text-sm text-gray-500">
                        Uploaded: {new Date(doc.uploadedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-5 items-center">
                    <button className="text-blue-500 hover:text-blue-700" onClick={() => openPreview(doc)}>
                      <i className="ri-eye-line text-2xl" />
                    </button>
                    <button
                      onClick={() => downloadFile(doc)}
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
    </div>
  );
}

export default PatientHealthDocuments;
