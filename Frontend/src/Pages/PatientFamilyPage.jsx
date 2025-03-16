import React from 'react';

import PatientUserProfile from '../Components/PatientUserProfile';
import PatientModification from '../Components/PatientModification';
import FamilyMembers from '../Components/PatientFamilyMem';
import TotalFamilyMembers from '../Components/PatientTotalFamily';

const PatientFamilyPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* ✅ Only PatientNavigation is included */}

      <main className="container mx-auto p-4">
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
