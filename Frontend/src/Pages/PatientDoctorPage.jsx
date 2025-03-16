import React from 'react';
import UserProfile from '../Components/PatientUserProfile';
import PatientDoctorPending from '../Components/PatientDoctorPending';
import PDoctorAccess from '../Components/PDoctorAccess';

const PatientFamilyPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto p-4">
        {/* ✅ Pass props to avoid errors */}
        <UserProfile />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="col-span-2">
            <PatientDoctorPending />
          </div>
          <div className="col-span-1">
            <PDoctorAccess />
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientFamilyPage;