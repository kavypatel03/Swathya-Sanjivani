import React, { useState, useEffect } from 'react';

const TotalFamilyMembers = () => {
  const [counts, setCounts] = useState({
    total: 0,
    male: 0,
    female: 0,
    seniorCitizen: 0,
    teen: 0
  });

  useEffect(() => {
    const handlePatientSelected = (e) => {
      const { familyMembers } = e.detail;
      calculateCounts(familyMembers || []);
    };

    // Check if we have existing family members in localStorage
    const patientId = localStorage.getItem('selectedPatientId');
    const storedFamily = patientId ? 
      JSON.parse(localStorage.getItem(`patient_${patientId}_family`)) : [];
    if (storedFamily) {
      calculateCounts(storedFamily);
    }

    window.addEventListener('patientSelected', handlePatientSelected);
    
    return () => {
      window.removeEventListener('patientSelected', handlePatientSelected);
    };
  }, []);

  const calculateCounts = (familyMembers) => {
    const newCounts = {
      total: familyMembers.length,
      male: familyMembers.filter(m => m.gender === 'Male').length,
      female: familyMembers.filter(m => m.gender === 'Female').length,
      seniorCitizen: familyMembers.filter(m => parseInt(m.age) >= 60).length,
      teen: familyMembers.filter(m => parseInt(m.age) >= 13 && parseInt(m.age) <= 19).length
    };
    setCounts(newCounts);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-teal-800 mb-4">Total Family Members</h2>
      
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <p>Total Male: {counts.male}</p>
          <p>Total Female: {counts.female}</p>
          <p>Senior Citizen: {counts.seniorCitizen}</p>
          <p>Teen: {counts.teen}</p>
        </div>
        <div className="text-center">
          <span className="text-8xl font-bold text-teal-800">{counts.total}</span>
          <p className="text-teal-800 font-semibold">TOTAL</p>
        </div>
      </div>
    </div>
  );
};

export default TotalFamilyMembers;