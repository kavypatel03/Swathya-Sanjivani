import React from 'react';
import { Link } from 'react-router-dom';

function HealthDocuments() {
  const documents = [
    { id: 1, name: 'Blood Test Reports', uploadDate: '11 January 2025', type: 'standard' },
    { id: 2, name: 'X-Ray Report (Left Leg)', uploadDate: '11 January 2025', type: 'highlight' },
    { id: 3, name: 'Blood Test Reports', uploadDate: '11 August 2024', type: 'standard' },
    { id: 4, name: 'X-Ray Report (Left Leg)', uploadDate: '11 August 2024', type: 'highlight' },
    { id: 5, name: 'Routine Check-up', uploadDate: '10 March 2024', type: 'standard' },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-3">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium text-[#0e606e]">Sanjaybhai's Health Documents</h2>
        <div className="flex space-x-2">
          <button className="p-2 rounded-md text-gray-500 hover:bg-gray-100">
            <i className="ri-calendar-line"></i>
          </button>
          <Link to={'/UploadToast'} className="bg-[#0e606e] text-white px-4 py-2 rounded-md flex items-center">
            <i className="ri-upload-2-line mr-1"></i>
            Upload New
          </Link>
        </div>
      </div>
      
      <div className="space-y-3">
        {documents.map(doc => (
          <div 
            key={doc.id} 
            className={`border rounded-md p-4 flex justify-between items-center ${
              doc.type === 'highlight' ? 'border-[#ff9700]/30' : 'border-[#0e606e]/30'
            }`}
          >
            <div>
              <h3 className="font-medium">{doc.name}</h3>
              <p className="text-sm text-gray-500">Uploaded on: {doc.uploadDate}</p>
            </div>
            <div className="flex space-x-2">
              <button className="p-2 rounded-full hover:bg-gray-200">
                <i className="ri-eye-line text-[#0e606e]"></i>
              </button>
              <button className="p-2 rounded-full hover:bg-gray-200">
                <i className="ri-delete-bin-line text-red-500"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HealthDocuments;