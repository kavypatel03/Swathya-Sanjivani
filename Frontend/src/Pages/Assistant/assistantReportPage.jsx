import React from 'react';
import Navigation from '../../Components/Assistant/AssistantNav';
import UserProfile from '../../Components/Assistant/userProfile';
import PatientPrescription from '../../Components/Assistant/patientPrescription';
import DocumentManager from '../../Components/Assistant/reportManager';

const AssistantReportsPage = () => {
  return (
    <div className="min-h-screen bg-gray-200">
      <Navigation />
      <div className="container mx-auto px-4 py-6">
        <UserProfile />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <PatientPrescription />
          </div>
          <div>
            <DocumentManager />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistantReportsPage;