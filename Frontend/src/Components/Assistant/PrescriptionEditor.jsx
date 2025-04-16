import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../assets/logo.png";

const AssistantPrescriptionEditor = ({ existingPrescriptionId = null }) => {
  const editorRef = useRef(null);
  const [isEmpty, setIsEmpty] = useState(true);
  const [saving, setSaving] = useState(false);
  const [assistantDetails, setAssistantDetails] = useState(null);
  const [doctorDetails, setDoctorDetails] = useState(null);

  useEffect(() => {
    // Fetch assistant and doctor details on component mount
    const fetchDetails = async () => {
      try {
        // Get assistant details
        const assistantResponse = await axios.get('http://localhost:4000/assistant/dashboard', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (assistantResponse.data.success) {
          setAssistantDetails(assistantResponse.data.data);

          // Try to get doctorId from assistant details
          const doctorId = assistantResponse.data.data.doctor || assistantResponse.data.data.doctorId;
          if (doctorId) {
            // Fetch doctor by ID with Authorization header
            const doctorResponse = await axios.get(
              `http://localhost:4000/doctor/doctor/${doctorId}`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                withCredentials: true // <-- add this line if your backend checks cookies too
              }
            );
            if (doctorResponse.data.success) {
              setDoctorDetails(doctorResponse.data.data);
            }
          } else if (assistantResponse.data.data.doctorName) {
            // Fallback: fetch doctor by name if doctorId is missing
            const doctorName = assistantResponse.data.data.doctorName;
            const doctorListResponse = await axios.get(
              `http://localhost:4000/assistant/doctors-list`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                withCredentials: true
              }
            );
            if (doctorListResponse.data.success) {
              const foundDoctor = doctorListResponse.data.data.find(
                doc => doc.fullName === doctorName
              );
              if (foundDoctor) {
                setDoctorDetails(foundDoctor);
              }
            }
          }
        }

        if (existingPrescriptionId) {
          loadExistingPrescription();
        }
      } catch (error) {
        console.error('Error fetching details:', error);
        toast.error('Failed to load details');
      }
    };

    fetchDetails();
  }, [existingPrescriptionId]);

  const loadExistingPrescription = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/assistant/view-prescription/${existingPrescriptionId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      // For existing prescriptions, we get HTML content
      if (response.data) {
        // Set HTML content directly
        editorRef.current.innerHTML = response.data;
        handleInput();
      }
    } catch (error) {
      console.error("Error loading prescription:", error);
      toast.error("Failed to load prescription");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const content = editorRef.current.innerHTML; // Use HTML content
      
      const patientId = localStorage.getItem('selectedPatientId');
      const familyMemberId = localStorage.getItem('selectedFamilyMemberId');
      const assistantId = localStorage.getItem('assistantId');

      if (!patientId || !familyMemberId || !assistantId) {
        throw new Error('Patient, family member or assistant not properly selected');
      }

      if (existingPrescriptionId) {
        // Update existing prescription
        await axios.put(
          `http://localhost:4000/assistant/prescription/${existingPrescriptionId}`,
          { content },
          { 
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          }
        );
        toast.success("Prescription updated successfully");
      } else {
        // Create new prescription (use /assistant/prescription endpoint)
        await axios.post(
          "http://localhost:4000/assistant/prescription",
          {
            patientId,
            familyMemberId,
            documentName: `Prescription_${new Date().toLocaleDateString()}`,
            documentType: "Prescription",
            file: content // HTML content as string
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          }
        );
        toast.success("Prescription saved successfully");
      }

      // Reload the current page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (error) {
      console.error("Error saving prescription:", error);
      toast.error(error.message || "Failed to save prescription");
    } finally {
      setSaving(false);
    }
  };

  
 
  const [activeCommands, setActiveCommands] = useState({
    bold: false,
    italic: false,
    underline: false,
    alignLeft: false,
    alignCenter: false,
    alignJustify: false,
  });

  const handleCommand = (command, value = null) => {
    const editor = editorRef.current;
    editor.focus();
    document.execCommand(command, false, value);
    handleInput();
    updateActiveCommands();
  };

  const handleAlignment = (alignment) => {
    const commandMap = {
      Left: "alignLeft",
      Center: "alignCenter",
      Full: "alignJustify",
    };

    const editor = editorRef.current;
    editor.focus();
    document.execCommand(`justify${alignment}`);
    setActiveCommands((prev) => ({
      ...prev,
      alignLeft: false,
      alignCenter: false,
      alignJustify: false,
      [commandMap[alignment]]: true,
    }));
  };

  const updateActiveCommands = () => {
    setActiveCommands((prev) => ({
      ...prev,
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
    }));
  };

  const handleInput = () => {
    const text = editorRef.current.innerText.trim();
    setIsEmpty(text === "");
    updateActiveCommands();
  };

  const removeTextFormatting = () => {
    const editor = editorRef.current;
    const tagsToRemove = ["B", "STRONG", "I", "EM", "U"];

    const unwrapTags = (node) => {
      if (tagsToRemove.includes(node.nodeName)) {
        const parent = node.parentNode;
        while (node.firstChild) {
          parent.insertBefore(node.firstChild, node);
        }
        parent.removeChild(node);
      } else {
        for (let i = 0; i < node.childNodes.length; i++) {
          unwrapTags(node.childNodes[i]);
        }
      }
    };

    unwrapTags(editor);
    handleInput();
  };

  const handleClearEditor = () => {
    const editor = editorRef.current;
    editor.innerHTML = "";
    setIsEmpty(true);
    setActiveCommands({
      bold: false,
      italic: false,
      underline: false,
      alignLeft: false,
      alignCenter: false,
      alignJustify: false,
    });
  };
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm my-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-[#0e606e] text-lg font-semibold">Prescription Editor</h3>
          
        </div>
        <div className="flex space-x-2">
          
          <button 
            type="button"
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
          className="p-2 border-r border-gray-300 hover:bg-[#e0f7fa] hover:border-[#0e606e] hover:text-[#0e606e] hover:rounded-tl"
          onClick={() => handleCommand("bold")}
        >
          <i className="ri-bold"></i>
        </button>

        <button
          className="p-2 border-r border-gray-300 hover:bg-[#e0f7fa] hover:border-[#0e606e] hover:text-[#0e606e]"
          onClick={() => handleCommand("italic")}
        >
          <i className="ri-italic"></i>
        </button>

        <button
          className="p-2 border-r border-gray-300 hover:bg-[#e0f7fa] hover:border-[#0e606e] hover:text-[#0e606e]"
          onClick={() => handleCommand("underline")}
        >
          <i className="ri-underline"></i>
        </button>

        <button
          className="p-2 border-r border-gray-300 hover:bg-[#e0f7fa] hover:border-[#0e606e] hover:text-[#0e606e]"
          onClick={() => handleAlignment("Left")}
        >
          <i className="ri-align-left"></i>
        </button>

        <button
          className="p-2 border-r border-gray-300 hover:bg-[#e0f7fa] hover:border-[#0e606e] hover:text-[#0e606e]"
          onClick={() => handleAlignment("Center")}
        >
          <i className="ri-align-center"></i>
        </button>

        <button
          className="p-2 border-r border-gray-300 hover:bg-[#e0f7fa] hover:border-[#0e606e] hover:text-[#0e606e]"
          onClick={() => handleAlignment("Full")}
        >
          <i className="ri-align-justify"></i>
        </button>

        <button
          className="p-2  hover:bg-[#e0f7fa] hover:border-[#0e606e] hover:text-[#0e606e]"
          onClick={handleClearEditor}
        >
          <i className="ri-delete-bin-line"></i>
        </button>
      </div>

      {/* Editor */}
      <div className="border border-t-0 border-gray-300 rounded-b-lg p-6 min-h-80">
        <div className="flex justify-between mb-6">
          <div>
            <h4 className="font-semibold">
              Dr. {doctorDetails?.fullName || 'Loading...'} (via {assistantDetails?.fullName || 'Assistant'})
            </h4>
            <p className="text-sm text-gray-600">
              {doctorDetails?.specialization || 'Loading...'}
            </p>
            <p className="text-sm text-gray-600">
              {doctorDetails?.hospitalName || 'Loading...'}
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
            style={{ fontFamily: 'monospace' }}
          ></div>
        </div>

        <div className="flex justify-between items-end mt-4">
          <div className="flex items-center text-xs text-gray-500">
            <img src={logo} alt="Logo" className="mr-1 size-1/2" />
          </div>
          <div className="text-center">
            <div className="border-t border-gray-300 mt-2 w-40"></div>
            <p className="text-sm">Dr. {doctorDetails?.fullName || 'Doctor'}'s Signature</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistantPrescriptionEditor;