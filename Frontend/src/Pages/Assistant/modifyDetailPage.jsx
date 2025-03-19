// ModifyDetailPage.jsx
import React from 'react';
import Navigation from '../../Components/Assistant/AssistantNav';
import UserProfile from '../../Components/Assistant/userProfile';
import ModifyDetails from '../../Components/Assistant/modifyDetail';

const ModifyDetailPage = () => {
  return (
    <div className="bg-gray-200 min-h-screen">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-md mb-6">
          <UserProfile />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <ModifyDetails />
        </div>
      </div>
    </div>
  );
};

export default ModifyDetailPage;