import React, { useState, useEffect } from "react";
import axios from "axios";

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get("http://localhost:4000/doctor/get-patients", {
        withCredentials: true
      });
      if (response.data.success) {
        setPatients(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const handleRemovePatient = (patientId) => {
    import("sweetalert2").then((Swal) => {
      Swal.default.fire({
        title: "Are you sure?",
        text: "This will remove the patient from your list.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#0e606e",
        cancelButtonColor: "#ef4444",
        confirmButtonText: "Yes, remove it!",
        background: "#ffffff",
        iconColor: "#ff9700"
      }).then((result) => {
        if (result.isConfirmed) {
          removePatient(patientId);
        }
      });
    });
  };

  const cleanupPatientData = (patientId) => {
    // Clear both patient and family member IDs
    localStorage.removeItem('selectedPatientId');
    localStorage.removeItem('doctorSelectedFamilyId');
    localStorage.removeItem(`patient_${patientId}_data`);
    localStorage.removeItem(`patient_${patientId}_documents`);
    localStorage.removeItem(`patient_${patientId}_family`);
    
    if (window.location.pathname.includes(patientId)) {
      window.location.href = '/doctor/dashboard';
    }
  };

  const removePatient = async (patientId) => {
    try {
      const response = await axios.delete(`http://localhost:4000/doctor/remove-patient/${patientId}`, {
        withCredentials: true
      });
      if (response.data.success) {
        cleanupPatientData(patientId);
        fetchPatients(); // Refresh the list
        import("sweetalert2").then((Swal) => {
          Swal.default.fire({
            title: "Removed!",
            text: "Patient has been removed from your list.",
            icon: "success",
            confirmButtonColor: "#0e606e",
            iconColor: "#0e606e"
          });
        });
      }
    } catch (error) {
      console.error("Error removing patient:", error);
      import("sweetalert2").then((Swal) => {
        Swal.default.fire("Error!", "Failed to remove patient.", "error");
      });
    }
  };

  const handleAddPatient = async () => {
    try {
      const response = await axios.post("http://localhost:4000/doctor/send-patient-otp", {
        mobileNumber: searchQuery
      }, {
        withCredentials: true
      });

      if (response.data.success) {
        // Handle successful OTP send
      }
    } catch (error) {
      if (error.response?.data) {
        const { message } = error.response.data;
        
        // Single Swal alert for all cases
        import("sweetalert2").then((Swal) => {
          let config = {
            confirmButtonColor: "#0e606e",
            background: "#ffffff",
          };

          // Configure based on status
          if (message.includes("Verifying")) {
            config = {
              ...config,
              title: "Verification Pending",
              text: message,
              icon: "info",
              iconColor: "#ff9700",
              showConfirmButton: true,
              allowOutsideClick: true,
            };
          } else if (message.includes("rejected")) {
            config = {
              ...config,
              title: "License Rejected",
              text: message,
              icon: "error",
              iconColor: "#ef4444",
              showConfirmButton: true,
              allowOutsideClick: true,
            };
          } else {
            config = {
              ...config,
              title: "Error",
              text: message,
              icon: "error",
              confirmButtonColor: "#ef4444",
            };
          }

          Swal.default.fire(config);
        });
      }
    }
  };

  // Cleanup effect when component unmounts
  useEffect(() => {
    return () => {
      // Cleanup any subscriptions or pending requests
      const controller = new AbortController();
      controller.abort();
    };
  }, []);

  const handlePatientClick = async (patientId) => {
    try {
      // First, get the patient's family members
      const response = await axios.get(`http://localhost:4000/doctor/get-patient-family`, {
        params: { patientId },
        withCredentials: true
      });

      if (response.data.success && response.data.data.length > 0) {
        // Store both patient ID and first family member's ID
        localStorage.setItem('selectedPatientId', patientId);
        localStorage.setItem('doctorSelectedFamilyId', response.data.data[0]._id);

        // Dispatch custom event with both IDs
        const event = new CustomEvent('patientSelected', {
          detail: { 
            patientId,
            familyMemberId: response.data.data[0]._id
          }
        });
        window.dispatchEvent(event);
      }
    } catch (error) {
      console.error('Error fetching family members:', error);
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.fullname?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm my-4 mb-0">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-[#0e606e]">Your Patients List</h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search Your Patient"
            className="border border-gray-300 rounded px-3 py-2 w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button 
            className="bg-[#0e606e] text-white px-4 py-2 rounded"
            onClick={handleAddPatient}
          >
            Add Patient
          </button>
        </div>
      </div>
      
      {filteredPatients.length === 0 ? (
        <p className="text-center text-gray-500 py-4">No patients found</p>
      ) : (
        filteredPatients.map((patient) => (
          <div 
            key={patient._id} 
            className="border border-gray-200  rounded-md p-4 mb-3 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => handlePatientClick(patient._id)}
          >
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">{patient.fullname}</h4>
                <p className="text-sm text-gray-500">
                  {patient.mobile} | {patient.email}
                </p>
              </div>
              <div className="flex space-x-4">
                <button 
                  className="text-[#0e606e] hover:underline text-sm font-medium"
                  onClick={(e) => {
                    e.stopPropagation();
                    localStorage.setItem('selectedPatientId', patient._id);
                    window.location.href = `/doctor/patient/${patient._id}`;
                  }}
                >
                  Details
                </button>
                <button 
                  className="text-red-500 hover:underline text-sm font-medium"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemovePatient(patient._id);
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default PatientList;