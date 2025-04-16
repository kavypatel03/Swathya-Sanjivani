import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function UserProfile() {
  const [patientData, setPatientData] = useState(null);
  const [lastLogin, setLastLogin] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/patient/dashboard', {
          withCredentials: true
        });

        if (response.data.success) {
          setPatientData(response.data.data);
          setLastLogin(response.data.data.lastLogin || 'Unknown'); // Handle missing lastLogin
        } else {
          toast.error("Failed to fetch patient details.");
        }
      } catch (error) {
        console.error("Error fetching patient data:", error);

        if (error.response && error.response.status === 401) {
          toast.error("Access denied! Please log in first.");
          navigate('/PatientLogin');
        } else {
          navigate('/PatientLogin');
          toast.error("Error fetching data. Please try again.");
        }
      }
    };

    fetchPatientData();
  }, [navigate]);

  if (!patientData) {
    return <div className="text-center text-gray-500 py-20">Loading Patient Data...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mt-5">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="rounded-full mr-4">
            <img
              src={`https://avatar.iran.liara.run/public?username=${encodeURIComponent(patientData?.fullName || "Patient")}`}
              alt="Profile"
              className="h-16 w-16 rounded-full border-2 border-[#0e606e]"
            />
          </div>

          <div className="ml-4">
            <div className="text-xl font-medium">
              <span className="text-gray-700">Welcome, </span>
              <span className="text-[#ff9700]">{patientData?.fullname || "Guest"}</span>
            </div>
            <div className="text-sm text-gray-500">Last login: {lastLogin}</div>
          </div>
        </div>
        <Link to="/PatientFamilyPage" className="flex items-center text-[#0e606e] hover:text-[#0e606e]/80 font-bold">
          Profile
        </Link>
      </div>
    </div>
  );
}

export default UserProfile;