import React from 'react';
import UserProfile from '../../Components/Doctor/DoctorProfile';
import Guidance from '../../Components/Guide';

const PatientGuidePage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation component */}
      
      {/* Main content area */}
      <div className="container mx-auto px-4 py-6">
        {/* User profile section */}
        <UserProfile />
        
        {/* Guidance component */}
        <Guidance />
      </div>
    </div>
  );
};

export default PatientGuidePage;