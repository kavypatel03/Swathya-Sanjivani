import { useEffect, useState } from 'react';
import axios from 'axios';

const DoctorAccess = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patientId, setPatientId] = useState(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  
  useEffect(() => {
    const fetchPatientDoctors = async () => {
      try {
        const token = localStorage.getItem('token');
        const currentPatientId = localStorage.getItem('selectedPatientId');
        
        if (!currentPatientId) throw new Error('No patient selected');
        if (!token) throw new Error('Authentication token not found');
        
        setPatientId(currentPatientId);
        
        const config = {
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        };

        const patientResponse = await axios.get(
          `http://localhost:4000/doctor/patient/${currentPatientId}`,
          config
        );

        if (!patientResponse.data.success || !patientResponse.data.data.doctors) {
          throw new Error('No doctors found for this patient');
        }

        const doctorPromises = patientResponse.data.data.doctors.map(doctorId => 
          axios.get(`http://localhost:4000/doctor/doctor/${doctorId}`, config)
        );

        const doctorResponses = await Promise.all(doctorPromises);
        const doctorData = doctorResponses
          .filter(response => response.data.success)
          .map(response => response.data.data);

        setDoctors(doctorData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching doctors:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load doctors');
        setLoading(false);
      }
    };

    const handlePatientSelected = (e) => {
      localStorage.setItem('selectedPatientId', e.detail.patientId);
      fetchPatientDoctors();
    };

    window.addEventListener('patientSelected', handlePatientSelected);
    fetchPatientDoctors();

    return () => {
      window.removeEventListener('patientSelected', handlePatientSelected);
    };
  }, []);

  const handleDoctorClick = (doctor) => {
    setSelectedDoctorId(doctor._id);
    // Dispatch event for other components to listen
    const event = new CustomEvent('doctorSelected', {
      detail: { doctor }
    });
    window.dispatchEvent(event);
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold text-[#0e606e] mb-4">Doctor Access</h2>
        <p>Loading doctors...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold text-[#0e606e] mb-4">Doctor Access</h2>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (doctors.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold text-[#0e606e] mb-4">Doctor Access</h2>
        <p>No doctors found for this patient.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#0e606e]">Doctor Access</h2>
        {doctors.length > 4 && (
          <a href="#" className="text-blue-500">See All</a>
        )}
      </div>
      
      <div className="space-y-4">
        {doctors.slice(0, 4).map((doctor) => (
          <div 
            key={doctor._id} 
            className={`flex items-center justify-between p-3 rounded-md cursor-pointer transition-all duration-200 ${
              selectedDoctorId === doctor._id 
                ? 'bg-teal-50 border-2 border-[#0e606e]' 
                : 'hover:bg-gray-50 border-2 border-transparent'
            }`}
            onClick={() => handleDoctorClick(doctor)}
          >
            <div className="flex items-center">
              <div className={`w-11 h-11 rounded-full bg-gray-100 overflow-hidden ${
                selectedDoctorId === doctor._id ? 'ring-2 ring-[#0e606e]' : ''
              }`}>
                <img
                  src={doctor.gender === 'Female' 
                    ? 'https://avatar.iran.liara.run/public/girl' 
                    : 'https://avatar.iran.liara.run/public/boy'}
                  alt={doctor.gender}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="ml-3">
                <div className="flex items-center">
                  <h3 className={`font-semibold text-sm ${
                    selectedDoctorId === doctor._id ? 'text-[#0e606e]' : 'text-gray-800'
                  }`}>
                    Dr. {doctor.fullName}
                  </h3>
                  {doctor.licenseStatus === 'Verified' && (
                    <i className="ri-verified-badge-fill text-[#0e606e] text-lg ml-1" />
                  )}
                </div>
                <p className={`text-xs ${
                  selectedDoctorId === doctor._id ? 'text-[#0e606e]' : 'text-gray-600'
                }`}>
                  {doctor.specialization}
                </p>
              </div>
            </div>
            <button 
              className={`px-3 py-1 text-sm rounded transition-colors ${
                selectedDoctorId === doctor._id
                  ? 'bg-teal-800 text-white'
                  : 'border border-teal-800 text-teal-800 hover:bg-teal-800 hover:text-white'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                handleDoctorClick(doctor);
              }}
            >
              {selectedDoctorId === doctor._id ? 'Selected' : 'Select'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorAccess;