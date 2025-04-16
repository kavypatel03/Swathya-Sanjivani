import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import logo from "../../assets/logo.png";

const PrescriptionEditor = ({ existingPrescriptionId = null }) => {
  const editorRef = useRef(null);
  const [isEmpty, setIsEmpty] = useState(true);
  const [saving, setSaving] = useState(false);
  const [doctorDetails, setDoctorDetails] = useState(null);

  useEffect(() => {
    // Fetch doctor details on component mount
    const fetchDoctorDetails = async () => {
      try {
        const response = await axios.get('http://localhost:4000/doctor/dashboard', {
          withCredentials: true
        });
        if (response.data.success) {
          setDoctorDetails(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching doctor details:', error);
      }
    };

    fetchDoctorDetails();
    if (existingPrescriptionId) {
      loadExistingPrescription();
    }
  }, [existingPrescriptionId]);

  const loadExistingPrescription = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/doctor/prescription/${existingPrescriptionId}`,
        { withCredentials: true }
      );
      if (response.data.success) {
        editorRef.current.textContent = response.data.data;
        handleInput();
      }
    } catch (error) {
      console.error("Error loading prescription:", error);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault(); // Prevent form submission
    try {
      setSaving(true);
      const content = editorRef.current.textContent;
      
      const patientId = localStorage.getItem('selectedPatientId');
      const familyMemberId = localStorage.getItem('doctorSelectedFamilyId');

      if (!patientId || !familyMemberId) {
        throw new Error('Patient or family member not selected');
      }

      const response = existingPrescriptionId 
        ? await axios.put(
            `http://localhost:4000/doctor/prescription/${existingPrescriptionId}`,
            { content },
            { 
              withCredentials: true,
              headers: {
                'Content-Type': 'application/json'
              }
            }
          )
        : await axios.post(
            "http://localhost:4000/doctor/prescription",
            {
              content,
              patientId,
              familyMemberId
            },
            { 
              withCredentials: true,
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );

      if (response.data.success) {
        import("sweetalert2").then((Swal) => {
          Swal.default.fire({
            title: "Success!",
            text: `Prescription ${existingPrescriptionId ? 'updated' : 'saved'} successfully`,
            icon: "success",
            confirmButtonColor: "#0e606e"
          }).then(() => {
   d  // Use react-router navigation instead of window.history
            window.location.replace('/dashbord');
          });
        });
      }
    } catch (error) {
      console.error("Error saving prescription:", error);
      import("sweetalert2").then((Swal) => {
        Swal.default.fire({
          title: "Error!",
          text: error.message || "Failed to save prescription",
          icon: "error",
          confirmButtonColor: "#ef4444"
        });
      });
    } finally {
      setSaving(false);
    }
  };

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
    <div className="bg-white mx-[51px] p-6 rounded-lg shadow-sm mt-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-[#0e606e] text-lg font-semibold">Prescription Editor</h3>
          <p className="text-sm text-gray-500">
            Family Member ID: {localStorage.getItem('doctorSelectedFamilyId')}
          </p>
        </div>
        <div className="flex space-x-2">
          <button 
            type="button" // Add type="button"
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded"
            onClick={() => window.location.replace('/doctor/dashboard')}
          >
            Cancel
          </button>
          <button 
            type="button" // Add type="button"
            className="bg-[#0e606e] text-white px-4 py-2 rounded flex items-center"
            onClick={handleSave}
            disabled={saving || isEmpty}
          >
            {saving ? (
              <>
                <span className="mr-2">Saving...</span>
                <i className="ri-loader-4-line animate-spin"></i>
              </>
            ) : (
              'Save Prescription'
            )}
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
            <h4 className="font-semibold">
              Dr. {doctorDetails?.fullname || 'Loading...'}
            </h4>
            <p className="text-sm text-gray-600">
              {doctorDetails?.specialization || 'Loading...'}
            </p>
            <p className="text-sm text-gray-600">
              License No: {doctorDetails?.mciNumber || 'Loading...'}
            </p>
          </div>
          <div className="text-sm text-gray-600">
            Date: {new Date().toLocaleDateString()}
          </div>
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
            className="w-full h-64 p-2 rounded text-gray-700 border resize-none overflow-auto outline-none whitespace-pre-wrap"
            style={{ fontFamily: 'monospace' }} // For better text formatting
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
