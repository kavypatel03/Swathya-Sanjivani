import React from "react";
import PatientUserProfile from "../../Components/Patient/PatientUserProfile";
import PatientAddNewFamilyMember from "../../Components/Patient/PatientAddNewMem";
import PatientFamilyMembers from "../../Components/Patient/PatientFamilyMem";
import TotalFamilyMembers from "../../Components/Patient/PatientTotalFamily";

const AddNewFamilyMemberPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto p-4">
        {/* User Profile Component */}
        <PatientUserProfile />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {/* Left Panel - Form Panel */}
          <div className="col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <PatientAddNewFamilyMember />
            </div>
          </div>

          {/* Right Panel - Family Members and Total Count */}
          <div className="col-span-1 space-y-4">
            <PatientFamilyMembers />
            <TotalFamilyMembers />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddNewFamilyMemberPage;
