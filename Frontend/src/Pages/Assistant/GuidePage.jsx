import React from 'react';
import Navigation from '../../Components/Assistant/AssistantNav';
import UserProfile from '../../Components/Assistant/userProfile';
import Guidance from '../../Components/Guide';

const PatientGuidePage = () => {
  return (
    <div className="min-h-screen bg-gray-200">
      {/* Navigation component */}
        <Navigation/>
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