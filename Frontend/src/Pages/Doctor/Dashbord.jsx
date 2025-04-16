import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import Navigation from "../../Components/Doctor/Navigation";
import Nav from "../../Components/Doctor/Nav";
import DoctorProfile from "../../Components/Doctor/UserProfile";
import AccessPatientRecords from "../../Components/Doctor/PatientAccess";
import PatientHealthDoc from "../../Components/Doctor/PatientHealthDocument";
import PatientList from "../../Components/Doctor/YourPatients";
import PatientFamily from "../../Components/Doctor/PatientFamilyMembers";
import DoctorConsult from "../../Components/Doctor/DoctorConsulted";
import UploadNew from "../../Components/Doctor/UploadFiles";
import PrescriptionEditor from "../../Components/Doctor/PrescrptionEditor";
import PatientPrescription from "../../Components/Assistant/patientPrescription";

const DoctorDashboard = () => {
  const [selectedMember, setSelectedMember] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasPatients, setHasPatients] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showReports, setShowReports] = useState(false);

  const checkPatients = useCallback(async () => {
    try {
      const response = await axios.get(
        'http://localhost:4000/doctor/get-patients',
        { withCredentials: true }
      );
      setHasPatients(response.data.data.length > 0);
    } catch (err) {
      console.error("Error checking patients:", err);
      setHasPatients(false);
    }
  }, []);

  useEffect(() => {
    checkPatients();
  }, [checkPatients]);

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

  const openPreview = async (doc) => {
    try {
      if (doc.documentType.toLowerCase() === 'prescription') {
        window.open(`http://localhost:4000/doctor/view-prescription/${doc._id}`, '_blank');
        return;
      }
      const response = await axios.get(
        `http://localhost:4000/doctor/view-document/${doc._id}`,
        { responseType: 'blob', withCredentials: true }
      );
      const blob = new Blob([response.data]);
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (error) {
      console.error("Preview error:", error);
    }
  };

  const downloadFile = async (doc) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/doctor/download-document/${doc._id}`,
        { responseType: 'blob', withCredentials: true }
      );
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = doc.documentName;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  const handleDeleteDocument = async (docId) => {
    try {
      await axios.delete(
        `http://localhost:4000/doctor/delete-document/${docId}`,
        { withCredentials: true }
      );
      fetchDocuments();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleCategorySelect = (category, filteredDocs) => {

    // Transform documents to match expected format if needed
    const formattedDocs = filteredDocs.map(doc => ({
      _id: doc._id,
      documentName: doc.documentName,
      documentType: doc.documentType,
      uploadedAt: doc.uploadedAt,
      ...doc
    }));

    setSelectedCategory(category);
    setDocuments(formattedDocs);
    setShowReports(true);
  };

  const handleBackToMain = () => {
    setShowReports(false);
    setSelectedCategory(null);
    fetchDocuments();
  };

  return (
    <div className="bg-gray-100 pb-4">
      {hasPatients ? <Nav /> : <Navigation />}
      <div className="container mx-auto p-4">
        {showReports ? (
          <PatientPrescription 
            category={selectedCategory}
            documents={documents || []}  // Ensure documents is always an array
            onBack={handleBackToMain}
            onView={openPreview}
            onDownload={downloadFile}
            onDelete={handleDeleteDocument}
          />
        ) : (
          <>
            <DoctorProfile />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <AccessPatientRecords onCategorySelect={handleCategorySelect} />
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
          </>
        )}
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
