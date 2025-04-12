import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import UserProfile from "../../Components/Patient/PatientUserProfile";
import HealthDocuments from "../../Components/Patient/PatientHealthDocument";
import FamilyMembers from "../../Components/Patient/PatientFamily";
import UploadPopup from "../../Components/Patient/UploadPopup"; // ✅ Import UploadPopup
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PatientDoctorAccess from "../../Components/Patient/PatientDoctorAccess";

function PatientDashboard() {
  const [patientData, setPatientData] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null); // ✅ Added state for selected member
  const [showUploadPopup, setShowUploadPopup] = useState(false); // ✅ Added popup state
  const [currentPatient, setCurrentPatient] = useState(null); // ✅ Added state for current patient
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // First get patient data
        const patientResponse = await axios.get(
          "http://localhost:4000/patient/dashboard", 
          { withCredentials: true }
        );

        if (patientResponse.data.success) {
          const patientData = patientResponse.data.data;
          setPatientData(patientData);
        }
      } catch (error) {
        if (!error.response || error.response.status === 401) {
          navigate('/PatientLogin');
          toast.error("You Need To Login First");
        } else {
          console.error("Error fetching data:", error);
          toast.error("Error fetching data");
        }
      }
    };

    fetchData();
  }, [navigate]);

  return (
    <div className="mx-auto px-4 py-6 bg-gray-100">
      <ToastContainer position="top-right" autoClose={3000} />

      {patientData ? (
        <>
          <UserProfile patientData={patientData} />
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <HealthDocuments
                selectedMember={selectedMember}
                setShowUploadPopup={setShowUploadPopup} // ✅ Added to control popup
                setSelectedMember={setSelectedMember}
                currentPatient={currentPatient}
              />
            </div>
            <div className="space-y-8">
              <FamilyMembers className="max-h-[200px] overflow-y-auto" setSelectedMember={setSelectedMember} />
              <PatientDoctorAccess patientId={patientData?._id} />
            </div>
          </div>

          {/* Upload Popup Component with Correct IDs */}
          <UploadPopup
            isOpen={showUploadPopup}
            onClose={() => setShowUploadPopup(false)}
            patientId={patientData?._id}
            familyId={selectedMember?._id} // ✅ Correctly passing the selected member's ID
          />
        </>
      ) : (
        <div className="text-center text-gray-500 py-20">
          Loading Patient Data...
        </div>
      )}
    </div>
  );
}

export default PatientDashboard;
