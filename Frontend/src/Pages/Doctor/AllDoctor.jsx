// DoctorProfilePage.jsx
import React from 'react';
import Nav from '../../Components/Doctor/Nav';
import UserProfile from '../../Components/Doctor/UserProfile';
import DoctorList from '../../Components/Doctor/OtherDoctorList';
import DoctorAccess from '../../Components/Doctor/DoctorAccess';

const DoctorProfilePage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Nav />
      
      <div className="container mx-auto py-6 px-4">
        <UserProfile />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2">
            <DoctorList />
          </div>
          <div>
            <DoctorAccess />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfilePage;
