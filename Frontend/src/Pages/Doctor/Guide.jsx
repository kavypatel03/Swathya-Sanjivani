import React from 'react';
import Navigation from '../../Components/Doctor/Nav';
import UserProfile from '../../Components/Doctor/UserProfile';
import Guidance from '../../Components/Guide';

const PatientGuidePage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation component */}
      <Navigation />
      {/* Main content area */}
      <div className="container mx-auto px-4 py-4">
        {/* User profile section */}
        <UserProfile />
        
        {/* Guidance component */}
        <Guidance />
      </div>
    </div>
  );
};

export default PatientGuidePage;