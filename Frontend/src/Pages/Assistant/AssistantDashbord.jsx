import React from 'react';
import Navigation from '../../Components/Assistant/AssistantNav';
import UserProfile from '../../Components/Assistant/userProfile';
import PatientList from '../../Components/Assistant/PatientList';
import UploadFile from '../../Components/Assistant/UploadFile';
import FamilyMembers from '../../Components/Assistant/FamilyMembers';
import DocumentManager from '../../Components/Assistant/DocumentManager';
import PrescriptionEditor from '../../Components/Assistant/PrescriptionEditor';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-200">
      <Navigation />
      <div className="container mx-auto py-6 px-4">
        <UserProfile />
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="col-span-2">
            <PatientList />
            <UploadFile />
          </div>
          <div className="col-span-1">
            <FamilyMembers />
          </div>
        </div>
            <DocumentManager />
        {/* Prescription Editor added at the bottom of the page */}
        <div className="mb-6 mt-6">
          <PrescriptionEditor />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;