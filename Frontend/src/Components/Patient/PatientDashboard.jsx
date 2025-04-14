import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PatientDashboard = () => {
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          navigate('/PatientLogin');
          return;
        }

        const response = await axios.get('http://localhost:4000/patient/dashboard', {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data.success) {
          setPatientData(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/PatientLogin');
        }
      }
    };

    fetchData();
  }, [navigate]);

  const isActive = (path) => location.pathname === path ? "border-[#0e606e] text-[#0e606e]" : "border-transparent text-gray-500 hover:text-gray-700";

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center mb-6">
      <div className="flex items-center">
        <div className="bg-gray-100 rounded-full p-2 mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#0e606e]" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        </div>
        <div>
          <div className="flex items-center">
            <p className="text-[#0e606e] font-medium text-lg">Welcome, </p>
            <p className="text-[#ff9700] font-medium text-lg ml-1">{patientData?.fullName}</p>
          </div>
          <div className="text-gray-500 text-sm">
            <p>Post: {patientData?.post}</p>
            <p>Hospital: {patientData?.hospital}</p>
            <p>Doctor: {patientData?.doctorName}</p>
            <p className="text-xs">Last login: {patientData?.lastLogin}</p>
          </div>
        </div>
      </div>
      <Link to="/modifyDetailPage" className={`border-b-2 px-1 inline-flex items-center text-md font-medium ${isActive("/modifyDetailPage")}`}>
        Profile
      </Link>
    </div>
  );
};

export default PatientDashboard;