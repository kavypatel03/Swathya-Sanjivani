import React, { useState, useRef, useEffect } from 'react';
import logo from "../../assets/logo.png";

const PrescriptionEditor = () => {
  const [prescriptionText, setPrescriptionText] = useState('');
  const textareaRef = useRef(null);
  
  // Auto-expand textarea function
  const autoResizeTextarea = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = 'auto';
      // Set the height to scrollHeight to expand based on content
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };
  
  // Call auto-resize when text changes
  useEffect(() => {
    autoResizeTextarea();
  }, [prescriptionText]);
  
  const handleTextChange = (e) => {
    setPrescriptionText(e.target.value);
  };

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
          <textarea 
            ref={textareaRef}
            value={prescriptionText}
            onChange={handleTextChange}
            placeholder="Start typing prescription here..." 
            className="w-full resize-none overflow-hidden min-h-[100px] focus:outline-none"
          />
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
              <div className="flex items-center text-xs text-gray-500">
                <img src={logo} alt="Logo" className="mr-1 size-1/2" />
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