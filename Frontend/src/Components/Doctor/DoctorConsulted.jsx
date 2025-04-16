import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DoctorConsulted() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPatientId, setCurrentPatientId] = useState(null);

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
            // Add "You" indicator if it's the current doctor
            isCurrent: response.data.data._id === currentDoctorId
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

  if (loading && !currentPatientId) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow py-11 px-5 mt-5">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium text-[#0e606e]">
          {currentPatientId ? 'Other Consulting Doctors' : 'Select a patient first'}
        </h2>
        {doctors.length > 4 && (
          <button className="text-blue-500 hover:text-blue-700">
            See All
          </button>
        )}
      </div>
      
      <div className="space-y-4">
        {doctors.length === 0 ? (
          <p className="text-center text-gray-500">
            {currentPatientId ? 'No other consulting doctors' : 'Please select a patient'}
          </p>
        ) : (
          doctors.slice(0, 4).map(doctor => (
            <div key={doctor._id} className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-[#0e606e]">
                <img
                    src={
                      doctor.gender === "Female"
                        ? "https://avatar.iran.liara.run/public/girl"
                        : "https://avatar.iran.liara.run/public/boy"
                    }
                    alt="doctor avatar"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="ml-3">
                  <div className="font-medium">
                    {doctor.isCurrent ? '(You) ' : ''}Dr. {doctor.fullName}
                  </div>
                  <div className="text-sm text-gray-500">
                    {doctor.specialization} • {doctor.hospitalName}
                  </div>
                </div>
              </div>
              <button className="px-3 py-1 border border-blue-500 text-blue-500 hover:bg-blue-50 rounded">
                View Profile
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DoctorConsulted;