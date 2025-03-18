import React from 'react';

const PrescriptionEditor = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-[#0e606e] font-medium text-xl">Prescription Editor</h2>
          <p className="text-gray-500 text-sm">Patient: (Patient Name)</p>
        </div>
        <div className="flex space-x-2">
          <button className="border border-gray-300 px-4 py-2 rounded-md">Cancel</button>
          <button className="bg-[#0e606e] text-white px-4 py-2 rounded-md">Save Prescription</button>
        </div>
      </div>
      <div className="border border-gray-300 rounded-md p-2 mb-4">
        <div className="flex space-x-2 border-b border-gray-200 pb-2">
          <button className="p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M7 14.94l6.06 6.06 2.12-2.12L9.12 12.88l-2.12 2.06zM4 11.82l2.38 2.38 2.12-2.12-2.38-2.38L4 11.82zm7-7.76l-2.12 2.12 6.06 6.06 2.12-2.12L11 4.06z"/>
            </svg>
          </button>
          <button className="p-2 font-bold">B</button>
          <button className="p-2 italic">I</button>
          <button className="p-2 underline">U</button>
          <div className="border-l border-gray-300 h-6 my-auto mx-2"></div>
          <button className="p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M3 21h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18V7H3v2zm0-6v2h18V3H3z"/>
            </svg>
          </button>
          <button className="p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M3 21h18v-2H3v2zm6-4h12v-2H9v2zm-6-4h18v-2H3v2zm6-4h12V7H9v2zM3 3v2h18V3H3z"/>
            </svg>
          </button>
          <div className="border-l border-gray-300 h-6 my-auto mx-2"></div>
          <button className="p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
            </svg>
          </button>
          <button className="p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
            </svg>
          </button>
        </div>
      </div>
      <div className="border border-gray-300 rounded-md p-6 mb-4">
        <div className="flex justify-between mb-8">
          <div>
            <h3 className="font-bold">Dr. Name</h3>
            <p className="text-gray-500 text-sm">Cardiologist</p>
            <p className="text-gray-500 text-sm">License No: 12345</p>
          </div>
          <div className="text-right">
            <p>Date: March 15, 2024</p>
          </div>
        </div>
        <div className="min-h-64 border-b border-gray-200 mb-8">
          <p className="text-gray-400">Start typing prescription here...</p>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#0e606e]" viewBox="0 0 24 24">
                <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 16H6c-.55 0-1-.45-1-1V6c0-.55.45-1 1-1h12c.55 0 1 .45 1 1v12c0 .55-.45 1-1 1zm-4.44-6.19l-2.35 3.02-1.56-1.88c-.2-.25-.58-.24-.78.01l-1.74 2.23c-.26.33-.02.81.39.81h8.98c.41 0 .65-.47.4-.8l-2.55-3.39c-.19-.26-.59-.26-.79 0z"/>
              </svg>
            </div>
            <div>
              <p className="text-[#0e606e] font-medium">Swasthya Sanjivani</p>
              <p className="text-gray-500 text-xs">Health Data Management System</p>
            </div>
          </div>
          <div>
            <p className="border-t border-gray-300 pt-2 mt-2 text-center">Doctor's Signature</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionEditor;