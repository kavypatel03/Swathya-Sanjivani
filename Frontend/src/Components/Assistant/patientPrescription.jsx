import React from 'react';
import axios from 'axios';

const PatientPrescription = ({ 
  category = 'All Documents', 
  documents = [], 
  onBack, 
  onView, 
  onDownload, 
  onDelete,
  loading = false
}) => {
  const handleView = async (doc) => {
    try {
      if (doc.documentType.toLowerCase() === 'prescription') {
        // Open prescription in a new window using the HTML view
        const prescriptionUrl = `http://localhost:4000/assistant/view-prescription/${doc._id}`;
        window.open(prescriptionUrl, '_blank');
        return;
      }

      const response = await axios.get(
        `http://localhost:4000/assistant/view-document/${doc._id}`,
        {
          responseType: 'blob',
          withCredentials: true
        }
      );

      const contentType = response.headers['content-type'] || '';
      const blob = new Blob([response.data], { type: contentType });
      const url = window.URL.createObjectURL(blob);

      if (contentType === 'application/pdf' || doc.documentType.toLowerCase().includes('pdf')) {
        // Open PDF in a new window
        const pdfWindow = window.open('', '_blank');
        if (pdfWindow) {
          pdfWindow.location.href = url; // Set the Blob URL as the location of the new window
        }
      } else {
        // For other file types, open in a new tab
        window.open(url, '_blank');
      }
    } catch (error) {
      console.error('Error viewing document:', error);
    }
  };

  const handleDownload = async (doc) => {
    try {
      if (doc.documentType.toLowerCase() === 'prescription') {
        // Download prescription as a PDF
        const response = await axios.get(
          `http://localhost:4000/assistant/prescription-pdf/${doc._id}`,
          {
            responseType: 'blob',
            withCredentials: true
          }
        );

        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${doc.documentName || 'prescription'}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        return;
      }

      // For other document types, call the provided onDownload handler
      onDownload(doc);
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          {category !== 'All Documents' && (
            <button 
              onClick={onBack}
              className="text-[#0e606e] hover:text-[#0e606e]/80"
            >
              <i className="ri-arrow-left-line text-xl"></i>
            </button>
          )}
          <h2 className="text-xl font-semibold text-[#0e606e]">{category}</h2>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 border rounded-md">
            <i className="ri-calendar-line text-[#0e606e]"></i>
          </button>
          <button className="bg-[#0e606e] text-white px-4 py-2 rounded-md flex items-center">
            <i className="ri-upload-line mr-1"></i>
            Upload New
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading documents...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {(!documents || documents.length === 0) ? (
            <p className="text-center text-gray-500 py-4">No documents found in this category</p>
          ) : (
            documents.map((doc) => (
              <div key={doc._id} className="border rounded-lg p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{doc.documentName}</h3>
                  <p className="text-sm text-gray-600">
                    Type: {doc.documentType}
                  </p>
                  <p className="text-sm text-gray-600">
                    Uploaded on: {new Date(doc.uploadedAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => handleView(doc)} className="p-2 text-gray-600 hover:text-[#0e606e]">
                    <i className="ri-eye-line"></i>
                  </button>
                  <button onClick={() => handleDownload(doc)} className="p-2 text-gray-600 hover:text-[#0e606e]">
                    <i className="ri-download-line"></i>
                  </button>
                  <button onClick={() => onDelete(doc._id)} className="p-2 text-gray-600 hover:text-red-600">
                    <i className="ri-delete-bin-line"></i>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

PatientPrescription.defaultProps = {
  category: 'All Documents',
  documents: [],
  onBack: () => {},
  onView: () => {},
  onDownload: () => {},
  onDelete: () => {},
  loading: false
};

export default PatientPrescription;