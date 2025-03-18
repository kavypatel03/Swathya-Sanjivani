import React from "react";
import Navigation from "../../Components/PatientNavigation";
import UserProfile from "../../Components/Patient/PatientUserProfile";
import PatientAddNewFamilyMember from "../../Components/Patient/PatientAddNewMem";
import PatientFamilyMembers from "../../Components/Patient/PatientFamilyMem";

const AddNewFamilyMemberPage = () => {
    return (
      <div className="min-h-screen bg-gray-100">
        {/* Navigation Component */}
        
        {/* Main Content */}
        <div className="container mx-auto px-4 py-6">
          {/* User Profile Component */}
          <UserProfile />
          
          {/* Content Area */}
          <div className="flex flex-col lg:flex-row gap-6 mt-6">
            {/* Form Panel */}
            <div className="bg-white rounded-lg shadow-md p-6 flex-grow lg:w-2/3">
              {/* Patient Add New Family Member Component */}
              <PatientAddNewFamilyMember />
            </div>
            
            {/* Family Members Panel */}
            <div className="lg:w-1/3">
              <PatientFamilyMembers />
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default AddNewFamilyMemberPage;