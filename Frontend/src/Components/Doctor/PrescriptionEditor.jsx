import React from "react";
import logo from "../../assets/logo.png"

// Component 2: PrescriptionEditor
const PrescriptionEditor = () => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm my-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-[#0e606e] text-lg font-semibold">Prescription Editor</h3>
            <p className="text-sm text-gray-500">Patient: (Patient Name)</p>
          </div>
          <div className="flex space-x-2">
            <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded">
              Cancle
            </button>
            <button className="bg-[#0e606e] text-white px-4 py-2 rounded">
              Save Prescription
            </button>
          </div>
        </div>
  
        {/* Text Editor Toolbar */}
        <div className="flex border border-gray-300 rounded-t-lg bg-gray-50">
          <button className="p-2 border-r border-gray-300">
            <i className="ri-bold"></i>
          </button>
          <button className="p-2 border-r border-gray-300">
            <i className="ri-italic"></i>
          </button>
          <button className="p-2 border-r border-gray-300">
            <i className="ri-underline"></i>
          </button>
          <button className="p-2 border-r border-gray-300">
            <i className="ri-list-unordered"></i>
          </button>
          <button className="p-2 border-r border-gray-300">
            <i className="ri-list-ordered"></i>
          </button>
          <button className="p-2 border-r border-gray-300">
            <i className="ri-link"></i>
          </button>
          <button className="p-2">
            <i className="ri-delete-bin-line"></i>
          </button>
        </div>
  
        {/* Editor Content Area */}
        <div className="border border-t-0 border-gray-300 rounded-b-lg p-6 min-h-80">
          <div className="flex justify-between mb-6">
            <div>
              <h4 className="font-semibold">Dr. Manoj Shah</h4>
              <p className="text-sm text-gray-600">Cardiologist</p>
              <p className="text-sm text-gray-600">License No: 12345</p>
            </div>
            <div className="text-sm text-gray-600">
              Date: March 15, 2024
            </div>
          </div>
          
          <div className="text-gray-400 mb-64">
           <input type="text" name=" Start typing prescription here..." id="" />
          </div>
          
          <div className="flex justify-between items-end">
            <div className="flex items-center text-xs text-gray-500">
              <img src={logo} alt="Logo" className="mr-1 size-1/2" />
            </div>
            <div className="text-center">
              <div className="border-t border-gray-300 mt-2 w-40"></div>
              <p className="text-sm">Doctor's Signature</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default PrescriptionEditor;