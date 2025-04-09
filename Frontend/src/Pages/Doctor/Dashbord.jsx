import React, { useState } from "react";
import Navigation from "../../Components/Doctor/Navigation";
import DoctorProfile from "../../Components/Doctor/UserProfile";
import AccessPatientRecords from "../../Components/Doctor/PatientAccess";
import PatientHealthDoc from "../../Components/Doctor/PatientHealthDocument";
import PatientList from "../../Components/Doctor/YourPatients";
import PatientFamily from "../../Components/Doctor/PatientFamilyMembers";
import DoctorConsult from "../../Components/Doctor/DoctorConsulted";
import UploadNew from "../../Components/Doctor/UploadFiles";
import PrescriptionEditor from "../../Components/Doctor/PrescrptionEditor";

const DoctorDashbord = () => {
  const [selectedMember, setSelectedMember] = useState(null);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navigation />
      <div className="container mx-auto px-4 py-4">
        <DoctorProfile />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <AccessPatientRecords />
            <PatientHealthDoc selectedMember={selectedMember} />
          </div>
          <div className="lg:col-span-1">
            <PatientFamily onMemberSelect={(member) => {
              console.log("Selected Member:", member);
              setSelectedMember(member); // this member must include `patientId`
            }} />

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
