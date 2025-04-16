import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function DoctorConsulted() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPatientId, setCurrentPatientId] = useState(null);
  const navigate = useNavigate();

  const fetchDoctors = async (patientId) => {
    try {
      setLoading(true);
      const currentDoctorId = localStorage.getItem('currentDoctorId');
      if (!patientId) {
        setDoctors([]);
        return;
      }

      const patientResponse = await axios.get(
        `http://localhost:4000/doctor/patient/${patientId}`,
        { withCredentials: true }
      );

      if (patientResponse.data.success && patientResponse.data.data.doctors) {
        const otherDoctorIds = patientResponse.data.data.doctors.filter(
          doctorId => doctorId !== currentDoctorId
        );

        if (otherDoctorIds.length === 0) {
          setDoctors([]);
          return;
        }

        const doctorPromises = otherDoctorIds.map(doctorId =>
          axios.get(`http://localhost:4000/doctor/doctor/${doctorId}`, {
            withCredentials: true
          })
        );

        const doctorResponses = await Promise.all(doctorPromises);
        const doctorData = doctorResponses
          .filter(response => response.data.success)
          .map(response => ({
            ...response.data.data,
            isCurrent: response.data.data._id === currentDoctorId,
            avatarUrl: `https://avatar.iran.liara.run/public/${
              response.data.data.gender === 'Female' ? 'girl' : 'boy'
            }?seed=${response.data.data._id}`
          }));

        setDoctors(doctorData);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  // Listen for patient selection changes
  useEffect(() => {
    const handlePatientSelected = (e) => {
      setCurrentPatientId(e.detail.patientId);
      fetchDoctors(e.detail.patientId);
    };

    window.addEventListener('patientSelected', handlePatientSelected);

    // Initial load if patient is already selected
    const patientId = localStorage.getItem('selectedPatientId');
    if (patientId) {
      setCurrentPatientId(patientId);
      fetchDoctors(patientId);
    }

    return () => {
      window.removeEventListener('patientSelected', handlePatientSelected);
    };
  }, []);

  const handleViewProfile = (doctorId) => {
    navigate(`/AllDoctor/${doctorId}`);
  };

  if (loading && !currentPatientId) {
    return (
      <div className="flex justify-center items-center py-4">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow py-6 px-5 mt-4 h-[400px] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium text-[#0e606e]">
          {currentPatientId ? 'Other Consulting Doctors' : 'Select a patient first'}
        </h2>
        {doctors.length > 4 && (
          <button 
            className="text-blue-500 hover:text-blue-700 whitespace-nowrap ml-2"
            onClick={() => navigate('/AllDoctor')}
          >
            See All
          </button>
        )}
      </div>
      
      {doctors.length === 0 ? (
        <div className="flex-grow flex justify-center items-center">
          <p className="text-center text-gray-500">
            {currentPatientId ? 'No other consulting doctors' : 'Please select a patient'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {doctors.slice(0, 4).map(doctor => (
            <div key={doctor._id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg">
              <div className="flex items-center flex-grow">
                <div className="h-12 w-12 rounded-full bg-gray-100 overflow-hidden mr-3">
                  <img
                    src={doctor.avatarUrl}
                    alt={`Dr. ${doctor.fullName}`}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.src = doctor.gender === 'Female' 
                        ? 'https://avatar.iran.liara.run/public/girl' 
                        : 'https://avatar.iran.liara.run/public/boy';
                    }}
                  />
                </div>
                <div className="flex-grow">
                  <div className="font-medium">
                    {doctor.isCurrent ? '(You) ' : ''}Dr. {doctor.fullName}
                  </div>
                  <div className="text-sm text-gray-500">
                    {doctor.specialization} • {doctor.hospitalName}
                  </div>
                </div>
                <button 
                  className="ml-4 px-4 py-2 border border-blue-500 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                  onClick={() => handleViewProfile(doctor._id)}
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DoctorConsulted;