import React, { useRef, useState } from "react";
import logo from "../../assets/logo.png";

const PrescriptionEditor = () => {
  const editorRef = useRef(null);
  const [isEmpty, setIsEmpty] = useState(true);

  const handleCommand = (command, value = null) => {
    const editor = editorRef.current;
    editor.focus(); // Focus before executing command

    if (command === "createLink") {
      const url = prompt("Enter URL:");
      if (url) {
        document.execCommand(command, false, url);
      }
    } else {
      document.execCommand(command, false, value);
    }

    handleInput(); // Update placeholder state
  };

  const handleInput = () => {
    const text = editorRef.current.innerText.trim();
    setIsEmpty(text === "");
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm my-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-[#0e606e] text-lg font-semibold">Prescription Editor</h3>
          <p className="text-sm text-gray-500">Patient: (Patient Name)</p>
        </div>
        <div className="flex space-x-2">
          <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded">
            Cancel
          </button>
          <button className="bg-[#0e606e] text-white px-4 py-2 rounded">
            Save Prescription
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex border border-gray-300 rounded-t-lg bg-gray-50">
        <button
          className="p-2 border-r border-gray-300 hover:bg-gray-400 hover:border-gray-400 hover:rounded-tr"
          onClick={() => handleCommand("bold")}
        >
          <i className="ri-bold"></i>
        </button>

        <button
          className="p-2 border-r border-gray-300 hover:bg-gray-400 hover:border-gray-400"
          onClick={() => handleCommand("italic")}
        >
          <i className="ri-italic"></i>
        </button>

        <button
          className="p-2 border-r border-gray-300 hover:bg-gray-400 hover:border-gray-400"
          onClick={() => handleCommand("underline")}
        >
          <i className="ri-underline"></i>
        </button>

        <button
          className="p-2 border-r border-gray-300 hover:bg-gray-400 hover:border-gray-400"
          onClick={() => handleCommand("insertUnorderedList")}
        >
          <i className="ri-list-unordered"></i>
        </button>

        <button
          className="p-2 border-r border-gray-300 hover:bg-gray-400 hover:border-gray-400"
          onClick={() => handleCommand("insertOrderedList")}
        >
          <i className="ri-list-ordered"></i>
        </button>

        <button
          className="p-2 border-r border-gray-300 hover:bg-gray-400 hover:border-gray-400"
          onClick={() => handleCommand("createLink")}
        >
          <i className="ri-link"></i>
        </button>

        <button
          className="p-2 hover:bg-gray-400 hover:border-gray-400"
          onClick={() => handleCommand("removeFormat")}
        >
          <i className="ri-delete-bin-line"></i>
        </button>
      </div>

      {/* Editor */}
      <div className="border border-t-0 border-gray-300 rounded-b-lg p-6 min-h-80">
        <div className="flex justify-between mb-6">
          <div>
            <h4 className="font-semibold">Dr. Manoj Shah</h4>
            <p className="text-sm text-gray-600">Cardiologist</p>
            <p className="text-sm text-gray-600">License No: 12345</p>
          </div>
          <div className="text-sm text-gray-600">Date: March 15, 2024</div>
        </div>

        {/* Editor with Placeholder */}
        <div className="relative">
          {isEmpty && (
            <div className="absolute top-2 left-2 text-gray-400 pointer-events-none">
              Start typing prescription here...
            </div>
          )}
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            suppressContentEditableWarning
            className="w-full h-64 p-2 rounded text-gray-700 border resize-none overflow-auto outline-none list-disc list-inside"
          ></div>
        </div>

        <div className="flex justify-between items-end mt-4">
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
