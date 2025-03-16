// App.jsx - Main component
import React from 'react';
{/*import Navigation from './src/Components/PatientNavigation';*/}
import UserProfile from '../Components/PatientUserProfile';
import HealthDocuments from '../Components/PatientHealthDocument';
import FamilyMembers from '../Components/PatientFamily';
import DoctorAccess from '../Components/PatientDoctorAccess';

function PatientDashboard() {
    return (
      <div className=" mx-auto px-4 py-6 bg-gray-100">
        <UserProfile 
          name="Sanjaybhai B. Gohil" 
          lastLogin="Today at 09:00 AM" 
        />
        
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <HealthDocuments />
          </div>
          <div className="space-y-8">
            <FamilyMembers />
            <DoctorAccess />
          </div>
        </div>
      </div>
    );
  }
  
  export default PatientDashboard;