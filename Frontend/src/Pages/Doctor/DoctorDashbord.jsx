import React from "react";
import DoctorProfile from "../../Components/Doctor/DoctorProfile";
import AccessPatientRecords from "../../Components/Doctor/PatientRecord";
import PatientHealthDoc from "../../Components/Doctor/PatientHealthDoc";
import PatientList from "../../Components/Doctor/PatientList";
import PatientFamily from "../../Components/Doctor/PatientFamily";
import DoctorConsult from "../../Components/Doctor/Doctorconsult";
import UploadNew from "../../Components/Doctor/UploadNew";
import PrescriptionEditor from "../../Components/Doctor/PrescriptionEditor";
// Main App Component
const DoctorDashbord = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-4">
        <DoctorProfile />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <AccessPatientRecords />
            <PatientHealthDoc />
          </div>
          <div className="lg:col-span-1">
            <PatientFamily />
            <DoctorConsult />
          </div>
        </div>
        <PatientList />
      </div>
        <UploadNew />
        <PrescriptionEditor />
    </div>
  );
};

export default DoctorDashbord;