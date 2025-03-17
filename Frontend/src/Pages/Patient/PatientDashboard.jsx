import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Import for redirection
import axios from 'axios';
import UserProfile from '../../Components/Patient/PatientUserProfile';
import HealthDocuments from '../../Components/Patient/PatientHealthDocument';
import FamilyMembers from '../../Components/Patient/PatientFamily';
import DoctorAccess from '../../Components/Patient/PatientDoctorAccess';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function PatientDashboard() {
    const [patientData, setPatientData] = useState(null);
    const navigate = useNavigate();  // Redirection hook

    useEffect(() => {
        const fetchPatientData = async () => {
            try {
                const response = await axios.get('http://localhost:4000/patient/dashboard', { 
                    withCredentials: true 
                });

                if (response.data.success) {
                    setPatientData(response.data.data);
                } else {
                    toast.error("Failed to fetch patient details.");
                }
            } catch (error) {
                console.error("Error fetching patient data:", error);

                if (error.response && error.response.status === 401) {
                    toast.error("Access denied! Please log in first.");
                    navigate('/PatientLogin');  // Redirect to PatientLogin
                } else {
                    toast.error("Error fetching data. Please try again.");
                }
            }
        };

        fetchPatientData();
    }, [navigate]);

    return (
      <div className="mx-auto px-4 py-6 bg-gray-100">
        <ToastContainer position="top-right" autoClose={3000} />

        {patientData ? (
          <>
            <UserProfile />
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <HealthDocuments />
              </div>
              <div className="space-y-8">
                <FamilyMembers />
                <DoctorAccess />
              </div>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500 py-20">Loading Patient Data...</div>
        )}
      </div>
    );
}

export default PatientDashboard;
