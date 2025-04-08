import React from "react";


const PatientHealthDocuments = () => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm my-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-[#0e606e]">Sanjaybhai's Health Documents</h3>
          <div className="flex space-x-2">
            <button className="p-2 border border-gray-300 rounded">
              <i className="ri-calendar-line text-gray-500"></i>
            </button>
            <button className="bg-[#0e606e] text-white px-4 py-2 rounded">New Prescription</button>
          </div>
        </div>
        <div className="border border-gray-200 rounded-md p-4 mb-3">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium">Blood Test Reports</h4>
              <p className="text-sm text-gray-500">Uploaded on: 11 January 2025</p>
            </div>
            <div className="flex space-x-2">
              <button className="p-1 text-gray-500 hover:text-[#0e606e]">
                <i className="ri-eye-line"></i>
              </button>
              <button className="p-1 text-gray-500 hover:text-[#0e606e]">
                <i className="ri-edit-line"></i>
              </button>
              <button className="p-1 text-gray-500 hover:text-[#0e606e]">
                <i className="ri-printer-line"></i>
              </button>
            </div>
          </div>
        </div>
        <div className="border border-gray-200 rounded-md p-4 mb-3">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium">X-Ray Report (Left Leg)</h4>
              <p className="text-sm text-gray-500">Uploaded on: 11 January 2025</p>
            </div>
            <div className="flex space-x-2">
              <button className="p-1 text-gray-500 hover:text-[#0e606e]">
                <i className="ri-eye-line"></i>
              </button>
              <button className="p-1 text-gray-500 hover:text-[#0e606e]">
                <i className="ri-edit-line"></i>
              </button>
              <button className="p-1 text-gray-500 hover:text-[#0e606e]">
                <i className="ri-printer-line"></i>
              </button>
            </div>
          </div>
        </div>
        <div className="text-right">
          <button className="text-[#0e606e] text-sm font-medium">View More</button>
        </div>
      </div>
    );
  };
  

  export default PatientHealthDocuments;