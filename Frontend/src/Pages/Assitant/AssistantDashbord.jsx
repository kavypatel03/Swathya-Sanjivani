import React from 'react';
import Navigation from './Navigation';
import UserProfile from './UserProfile';
import PatientList from './PatientList';
import UploadFile from './UploadFile';
import FamilyMembers from './FamilyMembers';
import DocumentManager from './DocumentManager';
import PrescriptionEditor from './PrescriptionEditor';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <div className="container mx-auto py-6 px-4">
        <UserProfile />
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <PatientList />
            <UploadFile />
            <DocumentManager />
          </div>
          <div className="col-span-1">
            <FamilyMembers />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;