import React from "react";
import Navigation from "../../Components/Doctor/Navigation";
import DoctorProfile from "../../Components/Doctor/UserProfile";
import AccessPatientRecords from "../../Components/Doctor/PatientAccess";
import PatientHealthDoc from "../../Components/Doctor/PatientHealthDocument";
import PatientList from "../../Components/Doctor/YourPatients";
import PatientFamily from "../../Components/Doctor/PatientFamilyMembers";
import DoctorConsult from "../../Components/Doctor/DoctorConsulted";
import UploadNew from "../../Components/Doctor/UploadFiles";
import PrescriptionEditor from "../../Components/Doctor/PrescrptionEditor";
// Main App Component
const DoctorDashbord = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navigation />
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