import React from 'react';
import Navigation from '../../Components/Doctor/Nav';
import UserProfile from '../../Components/Doctor/UserProfile';
import PatientFamilyDetail from '../../Components/Doctor/PatientFamilyDetail';
import FamilyMembers from '../../Components/Doctor/FamilyMem';
import TotalFamilyMembers from '../../Components/Doctor/TotalFamily';

const DoctorFamily = () => {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navigation />
        
        <div className="container mx-auto px-4 py-6">
          <UserProfile />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <PatientFamilyDetail />
            </div>
            <div className="space-y-6">
              <FamilyMembers />
              <TotalFamilyMembers />
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default DoctorFamily;