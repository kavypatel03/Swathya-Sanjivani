import React from 'react';

import PatientUserProfile from '../../Components/Patient/PatientUserProfile';
import PatientModification from '../../Components/Doctor/patientModification';
import FamilyMembers from '../../Components/Patient/PatientFamilyMem';
import TotalFamilyMembers from '../../Components/Patient/PatientTotalFamily';

const PatientFamilyPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* ✅ Only PatientNavigation is included */}

      <main className="container mx-auto px-4 py-6 bg-gray-100">
        {/* ✅ Pass props to avoid errors */}
        <PatientUserProfile name="Guest User" lastLogin="Unknown" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="col-span-2">
            <PatientModification />
          </div>
          <div className="col-span-1">
            <FamilyMembers />
            <TotalFamilyMembers />
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientFamilyPage;
