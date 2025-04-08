import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PatientDashboard = () => {
  const [patientData, setPatientData] = useState(null);
  const navigate = useNavigate();

  const fetchPatientData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/PatientLogin');
        return;
      }

      const res = await axios.get('http://localhost:4000/patient/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.data.success) {
        setPatientData(res.data.data.patient);
      }
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 404) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/PatientLogin');
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/PatientLogin');
      return;
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    fetchPatientData();
  }, []);

  return (
    <div className="patient-dashboard">
      <h1>Patient Dashboard</h1>
      {patientData ? (
        <div>
          <p>Name: {patientData.fullName}</p>
          <p>Email: {patientData.email}</p>
          <p>Mobile: {patientData.mobile}</p>
          {/* Add more patient details as needed */}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default PatientDashboard;