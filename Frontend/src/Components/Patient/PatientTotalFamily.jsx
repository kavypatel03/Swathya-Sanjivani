import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Toastify Styles

const TotalFamilyMembers = () => {
  const [familyData, setFamilyData] = useState({
    totalMale: 0,
    totalFemale: 0,
    seniorCitizens: 0,
    teens: 0,
    totalMembers: 0,
  });

  const [loading, setLoading] = useState(true);

  // 🔄 Fetch Data from `/patient/get-patient-details`
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/patient/get-patient-details', {
          withCredentials: true, // Ensure proper authentication
        });

        const patientData = response.data.data; // Root patient data
        const familyMembers = patientData.family || []; // Extract family array (or empty if undefined)

        // 🧮 Calculations
        const totalMale = familyMembers.filter((member) => member.gender === 'Male').length;
        const totalFemale = familyMembers.filter((member) => member.gender === 'Female').length;
        const seniorCitizens = familyMembers.filter((member) => {
          const age = calculateAge(member.birthDate);
          return age >= 60;
        }).length;
        const teens = familyMembers.filter((member) => {
          const age = calculateAge(member.birthDate);
          return age < 18; // ✅ Teens now counted as under 18 only
        }).length;

        setFamilyData({
          totalMale,
          totalFemale,
          seniorCitizens,
          teens,
          totalMembers: familyMembers.length,
        });

        setLoading(false);
      } catch (error) {
        console.error('❌ Error fetching patient data:', error);
        toast.error('❌ Failed to load family data.', {
          position: 'top-right',
          autoClose: 3000,
          theme: 'colored',
        });
        setLoading(false);
      }
    };

    fetchPatientData();
  }, []);

  // 🔢 Age Calculation Function
  const calculateAge = (dob) => {
    if (!dob) return 0;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();

    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  // 🔄 Show Loading Spinner While Data is Loading
  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="animate-spin h-10 w-10 border-4 border-[#0e606e] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mt-6">
      <ToastContainer />
      <h2 className="text-xl font-semibold text-[#0e606e] mb-4">Total Family Members</h2>
      <div className="flex justify-between">
        <div>
          <p className="text-gray-600">Total Male: {familyData.totalMale}</p>
          <p className="text-gray-600">Total Female: {familyData.totalFemale}</p>
          <p className="text-gray-600">Senior Citizen: {familyData.seniorCitizens}</p>
          <p className="text-gray-600">Teen (Under 18): {familyData.teens}</p>
        </div>

        <div className="flex items-center">
          <div className="text-7xl font-bold text-[#0e606e]">
            {familyData.totalMembers}
          </div>
          <div className="ml-2">
            <div className="text-lg font-semibold text-[#0e606e]">TOTAL</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalFamilyMembers;
