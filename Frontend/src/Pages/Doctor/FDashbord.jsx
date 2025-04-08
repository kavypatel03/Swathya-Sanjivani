// File: pages/Dashboard.jsx
import Header from '../../Components/Doctor/Navigation';
import UserProfile from '../../Components/Doctor/UserProfile';
import UploadFiles from '../../Components/Doctor/UploadFiles';
import PrescriptionEditor from '../../Components/Doctor/PrescrptionEditor';
import PatientAccess from '../../Components/Doctor/PatientAccess';
import PatientFamilyMembers from '../../Components/Doctor/PatientFamilyMembers';
import PatientHealthDocuments from '../../Components/Doctor/PatientHealthDocument';
import DoctorConsulted from '../../Components/Doctor/DoctorConsulted';
import YourPatients from '../../Components/Doctor/YourPatients';

function Dashboard() {
  return (
    <div className="flex flex-col bg-gray-100">
      <Header />
      <UserProfile />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
        <div className="lg:col-span-3">
          <PatientAccess />
        </div>
        <div className="lg:col-span-1">
          <PatientFamilyMembers />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
        <div className="lg:col-span-3">
          <PatientHealthDocuments />
        </div>
        <div className="lg:col-span-1">
          <DoctorConsulted />
        </div>
      </div>
      <div className="mt-6">
        <YourPatients />
      </div>

      <div className="container mx-auto py-6 px-4">
        <div className="mb-6">
          <UploadFiles />
        </div>
        <div className="mb-6">
          <PrescriptionEditor />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;