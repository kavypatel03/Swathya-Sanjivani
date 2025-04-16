import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const DocumentManager = ({ onCategorySelect }) => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [categories, setCategories] = useState({
    'Prescriptions': { count: 0, icon: 'document' },
    'Lab Reports': { count: 0, icon: 'lab' },
    'X-Rays': { count: 0, icon: 'xray' },
    'Others': { count: 0, icon: 'others' }
  });

  useEffect(() => {
    const patientId = localStorage.getItem('selectedPatientId');
    const familyId = localStorage.getItem('selectedFamilyMemberId');

    if (patientId && familyId) {
      fetchDocuments(patientId, familyId);
    }

    const handleFamilyMemberChange = (event) => {
      const { patientId, familyMemberId } = event.detail;
      if (patientId && familyMemberId) {
        fetchDocuments(patientId, familyMemberId);
      }
    };

    window.addEventListener('familyMemberSelected', handleFamilyMemberChange);
    return () => window.removeEventListener('familyMemberSelected', handleFamilyMemberChange);
  }, []);

  const fetchDocuments = async (patientId, familyId) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/patient/get-family-member-documents/${familyId}`,
        { withCredentials: true }
      );


      if (response.data.success) {
        let docs = response.data.data;

        // Normalize document data structure
        docs = docs.map(doc => {
          // Handle potential nested document structure
          if (doc.document) {
            return {
              _id: doc.document._id || doc._id,
              documentName: doc.document.documentName || doc.document.name || "Untitled",
              documentType: doc.document.documentType || doc.document.type || "Others",
              uploadedAt: doc.uploadedAt || doc.document.uploadedAt || new Date()
            };
          }
          return doc;
        });

        // Update category counts with normalized case-insensitive comparison
        // Update category counts with normalized case-insensitive comparison
        const counts = {
          'Prescriptions': { count: 0, icon: 'document' },
          'Lab Reports': { count: 0, icon: 'lab' },
          'X-Rays': { count: 0, icon: 'xray' },
          'Others': { count: 0, icon: 'others' }
        };

        docs.forEach(doc => {
          // Normalize document type for comparison
          const docType = (doc.documentType || '').trim().toLowerCase();
          
          if (docType === 'prescription' || docType === 'prescriptions') {
            counts['Prescriptions'].count++;
          } else if (docType === 'lab report' || docType === 'lab reports') {
            counts['Lab Reports'].count++;
          } else if (docType === 'x-ray' || docType === 'x-rays') {
            counts['X-Rays'].count++;
          } else {
            counts['Others'].count++;
          }
        });

        setDocuments(docs);
        setCategories(counts);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
      Swal.fire({
        title: "Error!",
        text: "Failed to fetch documents",
        icon: "error",
        confirmButtonColor: "#ef4444"
      });
    }
  };

  const handleViewDocument = async (documentId, documentType, documentName) => {
    try {
      // For prescriptions, use HTML viewer
      if ((documentType || '').toLowerCase() === 'prescription') {
        window.open(`http://localhost:4000/assistant/view-prescription/${documentId}`, '_blank');
        return;
      }

      const response = await axios.get(
        `http://localhost:4000/assistant/view-document/${documentId}`,
        {
          responseType: 'blob',
          withCredentials: true
        }
      );
      console.log(response);
      const contentType = response.headers['content-type'] || '';
      const blob = new Blob([response.data], { type: contentType });
      const url = window.URL.createObjectURL(blob);

      // For PDFs, open in new window with PDF viewer
      if (contentType === 'application/pdf' || (documentType || '').toLowerCase().includes('pdf')) {
        const pdfWindow = window.open('', '_blank');
        if (pdfWindow) {
          pdfWindow.document.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>${documentName}</title>
                <style>
                  body, html {
                    margin: 0;
                    padding: 0;
                    height: 100%;
                    overflow: hidden;
                  }
                  embed {
                    width: 100%;
                    height: 100vh;
                  }
                </style>
              </head>
              <body>
                <embed src="${url}" type="application/pdf" />
              </body>
            </html>
          `);
        }
      } else {
        // For other files, trigger download
        const link = document.createElement('a');
        link.href = url;
        link.download = documentName;
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    } catch (error) {
      console.error('Error viewing document:', error);
      Swal.fire({
        title: "Error!",
        text: "Failed to open document",
        icon: "error",
        confirmButtonColor: "#ef4444"
      });
    }
  };

  const handleDownloadDocument = async (documentId, documentName, documentType) => {
    try {
      if ((documentType || '').toLowerCase() === 'prescription') {
        // For prescriptions, download as PDF
        const response = await axios.get(
          `http://localhost:4000/assistant/download-prescription/${documentId}`,
          {
            responseType: 'blob',
            withCredentials: true
          }
        );
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${documentName}.pdf`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        return;
      }

      // For other documents
      const response = await axios.get(
        `http://localhost:4000/assistant/view-document/${documentId}`,
        {
          responseType: 'blob',
          withCredentials: true
        }
      );

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = documentName;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading document:', error);
      Swal.fire({
        title: "Error!",
        text: "Failed to download document",
        icon: "error",
        confirmButtonColor: "#ef4444"
      });
    }
  };

  const handleDeleteDocument = async (documentId) => {
    // Show confirmation dialog
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the document.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0e606e",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete it!",
      background: "#ffffff",
      iconColor: "#ff9700"
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.delete(
          `http://localhost:4000/assistant/delete-document/${documentId}`,
          { withCredentials: true }
        );

        if (response.data.success) {
          // Refresh documents list
          const patientId = localStorage.getItem('selectedPatientId');
          const familyId = localStorage.getItem('selectedFamilyMemberId');
          fetchDocuments(patientId, familyId);

          // Show success message
          await Swal.fire({
            title: "Deleted!",
            text: "The document has been deleted.",
            icon: "success",
            confirmButtonText: "Done",
            confirmButtonColor: "#0e606e",
            iconColor: "#0e606e"
          });
        }
      } catch (error) {
        console.error('Error deleting document:', error);
        await Swal.fire({
          title: "Error!",
          text: error.response?.data?.message || "Failed to delete document",
          icon: "error",
          confirmButtonColor: "#ef4444"
        });
      }
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'document':
      case 'prescription':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" viewBox="0 0 24 24">
            <path fill="currentColor" d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
          </svg>
        );
      case 'lab':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" viewBox="0 0 24 24">
            <path fill="currentColor" d="M6 2c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z" />
          </svg>
        );
      case 'xray':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" viewBox="0 0 24 24">
            <path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v16a2 2 0 002 2h16a2 2 0 002-2V4a2 2 0 00-2-2zM4 20V4h16v16H4zm12-5c.55 0 1 .45 1 1s-.45 1-1 1H8c-.55 0-1-.45-1-1s.45-1 1-1h8zm0-4c.55 0 1 .45 1 1s-.45 1-1 1H8c-.55 0-1-.45-1-1s.45-1 1-1h8zm0-4c.55 0 1 .45 1 1s-.45 1-1 1H8c-.55 0-1-.45-1-1s.45-1 1-1h8z" />
          </svg>
        );
      case 'others':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" viewBox="0 0 24 24">
            <path fill="currentColor" d="M6 2c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z" />
          </svg>
        );
      case 'pdf':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" viewBox="0 0 24 24">
            <path fill="currentColor" d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z" />
          </svg>
        );
      case 'image':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" viewBox="0 0 24 24">
            <path fill="currentColor" d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getIconDocument = (type) => {
    type = (type || '').toLowerCase();

    if (type === 'prescription' || type === 'prescriptions') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" viewBox="0 0 24 24">
          <path fill="currentColor" d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
        </svg>
      );
    } else if (type === 'lab report' || type === 'lab reports') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" viewBox="0 0 24 24">
          <path fill="currentColor" d="M6 2c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z" />
        </svg>
      );
    } else if (type === 'x-ray' || type === 'x-rays') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" viewBox="0 0 24 24">
          <path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v16a2 2 0 002 2h16a2 2 0 002-2V4a2 2 0 00-2-2zM4 20V4h16v16H4zm12-5c.55 0 1 .45 1 1s-.45 1-1 1H8c-.55 0-1-.45-1-1s.45-1 1-1h8zm0-4c.55 0 1 .45 1 1s-.45 1-1 1H8c-.55 0-1-.45-1-1s.45-1 1-1h8zm0-4c.55 0 1 .45 1 1s-.45 1-1 1H8c-.55 0-1-.45-1-1s.45-1 1-1h8z" />
        </svg>
      );
    } else if (type === 'pdf') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" viewBox="0 0 24 24">
          <path fill="currentColor" d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z" />
        </svg>
      );
    } else if (type === 'image') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" viewBox="0 0 24 24">
          <path fill="currentColor" d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
        </svg>
      );
    } else {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" viewBox="0 0 24 24">
          <path fill="currentColor" d="M6 2c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z" />
        </svg>
      );
    }
  };

  const openPreview = async (doc) => {
    try {
      if ((doc.documentType || '').toLowerCase() === 'prescription') {
        // Change this part to open the prescription view directly
        const prescriptionUrl = `http://localhost:4000/assistant/view-prescription/${doc._id}`;
        window.open(prescriptionUrl, '_blank');
        return;
      }

      // For other documents
      const response = await axios.get(
        `http://localhost:4000/assistant/view-document/${doc._id}`,
        {
          responseType: 'blob',
          withCredentials: true
        }
      );

      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (error) {
      console.error("Preview error:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to preview document",
        icon: "error",
        confirmButtonColor: "#ef4444"
      });
    }
  };

  const downloadFile = async (doc) => {
    try {
      if ((doc.documentType || '').toLowerCase() === 'prescription') {
        const response = await axios.get(
          `http://localhost:4000/assistant/prescription-pdf/${doc._id}`,
          {
            responseType: 'blob',
            withCredentials: true
          }
        );

        // Create blob with proper MIME type
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);

        // Create download link
        const link = document.createElement('a');
        link.href = url;
        link.download = `${doc.documentName || 'prescription'}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        // For non-prescription documents
        const response = await axios.get(
          `http://localhost:4000/assistant/view-document/${doc._id}`,
          {
            responseType: 'blob',
            withCredentials: true
          }
        );

        const blob = new Blob([response.data], { type: response.headers['content-type'] });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = doc.documentName || 'document';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Download error:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to download document",
        icon: "error",
        confirmButtonColor: "#ef4444"
      });
    }
  };

  const handleCategoryClick = (category) => {
    navigate('/assistantReportPage');
    const categoryLower = category.toLowerCase();

    const filteredDocs = documents.filter(doc => {
      const docType = (doc.documentType || '').trim();

      if (categoryLower === 'prescriptions' && (docType === 'Prescription' || docType === 'prescriptions')) {
        return true;
      } else if (categoryLower === 'lab reports' && (docType === 'lab report' || docType === 'lab reports')) {
        return true;
      } else if (categoryLower === 'x-rays' && (docType === 'x-ray' || docType === 'x-rays')) {
        return true;
      } else if (categoryLower === 'others') {
        return !['prescription', 'prescriptions', 'lab report', 'lab reports', 'x-ray', 'x-rays']
          .includes(docType);
      }
      return false;
    });

    onCategorySelect(category, filteredDocs);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[#0e606e] font-medium text-lg">Document Manager</h2>
      </div>
      <div className="grid grid-cols-4 gap-4 mb-6">
        {Object.entries(categories).map(([name, { count, icon }]) => (
          <div
            key={name}
            className="border border-gray-200 rounded-md p-4 flex items-center cursor-pointer hover:bg-gray-50"
            onClick={() => handleCategoryClick(name)}
          >
            <div className="bg-gray-100 p-2 rounded-md mr-3">
              {getIcon(icon)}
            </div>
            <div>
              <p className="font-medium">{name}</p>
              <p className="text-gray-500 text-xs">{count} Files</p>
            </div>
          </div>
        ))}
      </div>
      <div>
        {documents.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No documents found</p>
        ) : (
          documents.map((doc) => (
            <div key={doc._id} className="border border-gray-200 rounded-md p-3 mb-2 flex justify-between items-center">
              <div className="flex items-center">
                {getIconDocument(doc.documentType)}
                <div className="ml-3">
                  <p className="font-medium">{doc.documentName}</p>
                  <p className="text-gray-500 text-xs">
                    Uploaded on {new Date(doc.uploadedAt).toLocaleString('en-US', {
                      dateStyle: 'medium',
                      timeStyle: 'short'
                    })}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  className="text-gray-500 hover:text-blue-600"
                  onClick={() => openPreview(doc)}
                  title="View"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                  </svg>
                </button>
                <button
                  className="text-gray-500 hover:text-green-600"
                  onClick={() => downloadFile(doc)}
                  title="Download"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                  </svg>
                </button>
                <button
                  className="text-gray-500 hover:text-red-600"
                  onClick={() => handleDeleteDocument(doc._id)}
                  title="Delete"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DocumentManager;