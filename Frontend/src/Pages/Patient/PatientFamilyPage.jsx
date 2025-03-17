import React, { useState, useEffect } from 'react';
import axios from 'axios';

import PatientUserProfile from '../../Components/Patient/PatientUserProfile';
import PatientModification from '../../Components/Patient/PatientModification';
import FamilyMembers from '../../Components/Patient/PatientFamilyMem';
import TotalFamilyMembers from '../../Components/Patient/PatientTotalFamily';

const PatientFamilyPage = () => {
  const [patientData, setPatientData] = useState(null); // Initialize with null
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/patient/get-patient-details', { withCredentials: true });
        setPatientData(response.data.data);
      } catch (error) {
        console.error("Error fetching patient data:", error.message);
      } finally {
        setLoading(false); // Stop loading once data is fetched or error occurs
      }
    };

    fetchPatientData();
  }, []);

  if (loading) {
    return <div className="text-center mt-10">⏳ Loading patient details...</div>;
  }

  if (!patientData) {
    return <div className="text-center mt-10 text-red-500">❌ Failed to load patient data</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto p-4">
        <PatientUserProfile 
          name={patientData.fullname || "Guest User"} 
          lastLogin={patientData.lastLogin || "Unknown"} 
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="col-span-2">
            <PatientModification />
          </div>
          <div className="col-span-1">
            <FamilyMembers />
            <TotalFamilyMembers />
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientFamilyPage;
