import React from 'react';

// Patient Documents Component
const PatientDocuments = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#0e606e]">Sanjaybhai's Health Documents</h2>
        <div className="flex gap-2">
          <button className="p-2 bg-gray-100 rounded">
            <i className="ri-calendar-line text-lg"></i>
          </button>
          <button className="bg-[#0e606e] text-white px-4 py-2 rounded">New Prescription</button>
        </div>
      </div>
      
      <div className="border border-gray-200 rounded-lg mb-2">
        <div className="flex justify-between items-center p-4 border-l-4 border-[#0e606e]">
          <div>
            <h3 className="font-medium">Blood Test Reports</h3>
            <p className="text-sm text-gray-500">Uploaded on: 11 January 2025</p>
          </div>
          <div className="flex gap-2">
            <button className="p-2 text-gray-600 hover:text-[#0e606e]">
              <i className="ri-eye-line text-lg"></i>
            </button>
            <button className="p-2 text-gray-600 hover:text-[#0e606e]">
              <i className="ri-edit-line text-lg"></i>
            </button>
            <button className="p-2 text-gray-600 hover:text-[#0e606e]">
              <i className="ri-printer-line text-lg"></i>
            </button>
          </div>
        </div>
      </div>
      
      <div className="border border-gray-200 rounded-lg mb-4">
        <div className="flex justify-between items-center p-4 border-l-4 border-[#0e606e]">
          <div>
            <h3 className="font-medium">X-Ray Report (Left Leg)</h3>
            <p className="text-sm text-gray-500">Uploaded on: 11 January 2025</p>
          </div>
          <div className="flex gap-2">
            <button className="p-2 text-gray-600 hover:text-[#0e606e]">
              <i className="ri-eye-line text-lg"></i>
            </button>
            <button className="p-2 text-gray-600 hover:text-[#0e606e]">
              <i className="ri-edit-line text-lg"></i>
            </button>
            <button className="p-2 text-gray-600 hover:text-[#0e606e]">
              <i className="ri-printer-line text-lg"></i>
            </button>
          </div>
        </div>
      </div>
      
      <div className="text-right">
        <button className="text-[#0e606e] font-medium">View More</button>
      </div>
    </div>
  );
};


export default PatientDocuments;
// This component displays the patient's health documents with options to view, edit, and print.