import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import Navigation from "../../Components/Doctor/Navigation";
import DoctorProfile from "../../Components/Doctor/UserProfile";
import AccessPatientRecords from "../../Components/Doctor/PatientAccess";
import PatientHealthDoc from "../../Components/Doctor/PatientHealthDocument";
import PatientList from "../../Components/Doctor/YourPatients";
import PatientFamily from "../../Components/Doctor/PatientFamilyMembers";
import DoctorConsult from "../../Components/Doctor/DoctorConsulted";
import UploadNew from "../../Components/Doctor/UploadFiles";
import PrescriptionEditor from "../../Components/Doctor/PrescrptionEditor";

const DoctorDashboard = () => {
  const [selectedMember, setSelectedMember] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchDocuments = useCallback(async () => {
    if (!selectedMember?._id || !selectedMember?.patientId) return;

    try {
      setLoading(true);
      setError("");
      const response = await axios.get(
        `http://localhost:4000/doctor/get-family-member-documents`,
        {
          params: {
            familyMemberId: selectedMember._id,
            patientId: selectedMember.patientId,
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        const docsWithUrls = response.data.data.map(doc => ({
          ...doc,
          document: {
            ...doc.document,
            fileUrl: `http://localhost:4000/doctor/get-family-member-documents`
          }
        }));
        setDocuments(docsWithUrls);
      } else {
        setDocuments([]);
      }
    } catch (err) {
      console.error("❌ Error fetching documents:", err);
      setError("Error loading documents.");
    } finally {
      setLoading(false);
    }
  }, [selectedMember]);

  useEffect(() => {
    if (selectedMember?._id) {
      fetchDocuments();
    }
  }, [selectedMember, fetchDocuments]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navigation />
      <div className="container mx-auto px-4 py-4">
        <DoctorProfile />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <AccessPatientRecords />
            <PatientHealthDoc
              selectedMember={selectedMember}
              documents={documents}
              refreshDocuments={fetchDocuments}
              loading={loading}
              error={error}
            />
          </div>
          <div className="lg:col-span-1">
            <PatientFamily onMemberSelect={setSelectedMember} />
            <DoctorConsult />
          </div>
        </div>
        <PatientList />
      </div>
      <UploadNew
        selectedMember={selectedMember}
        onDocumentUploaded={fetchDocuments}
      />
      <PrescriptionEditor />
    </div>
  );
};

export default DoctorDashboard;
