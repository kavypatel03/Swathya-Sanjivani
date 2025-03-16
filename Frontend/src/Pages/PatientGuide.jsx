import React from 'react';
import Navigation from '../Components/PatientNavigation';
import UserProfile from '../Components/PatientUserProfile';
import Guidance from '../Components/Guide';

const PatientGuidePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
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