import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'remixicon/fonts/remixicon.css';

function PatientDoctorAccess({ patientId }) {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = patientId || localStorage.getItem('userId');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:4000/patient/${userId}/doctors`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
        });

        if (response.data.success) {
          setDoctors(response.data.data || []);
        } else {
          setError(response.data.message || 'Failed to fetch doctors');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching doctors');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchDoctors();
    } else {
      setError('Patient ID not found');
      setLoading(false);
    }
  }, [userId]);

  const handleSeeAll = () => {
    if (userId) {
      navigate(`/PatientDoctorPage/${userId}/doctors`);
    }
  };

  const handleRevokeAccess = async (doctorId, doctorName, e) => {
    e.stopPropagation();

    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: `This will revoke Dr. ${doctorName}'s access.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0e606e',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, revoke it!'
    });

    if (confirm.isConfirmed) {
      try {
        const response = await axios.delete(`http://localhost:4000/patient/${userId}/doctors/${doctorId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          withCredentials: true
        });

        if (response.data.success) {
          setDoctors(prev => prev.filter(doc => doc._id !== doctorId));
          Swal.fire('Revoked!', `Dr. ${doctorName}'s access has been revoked.`, 'success');
        }
      } catch (err) {
        Swal.fire('Error!', err.response?.data?.message || 'Failed to revoke access.', 'error');
      }
    }
  };

  const getFirstAndLastName = (fullName = '') => {
    const parts = fullName.trim().split(' ');
    return parts.length > 1 ? `${parts[0]} ${parts[parts.length - 1]}` : parts[0];
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium text-[#0e606e]">Doctor Access</h2>
        <button className="text-blue-500 hover:text-blue-700" onClick={handleSeeAll}>
          See All
        </button>
      </div>

      <div className="space-y-4 overflow-y-auto max-h-[380px] pr-2">
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : doctors.length === 0 ? (
          <div className="text-center text-gray-500">No doctors connected yet</div>
        ) : (
          doctors.map((doctor) => (
            <div key={doctor._id} className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-blue-200 flex items-center justify-center">
                  <i className="ri-user-3-line text-gray-600"></i>
                </div>
                <div className="ml-3">
                  <div className="flex items-center gap-1 font-medium">
                    Dr. {getFirstAndLastName(doctor.fullName)}
                    {doctor.licenseStatus === 'Verified' && (
                      <i className="ri-verified-badge-fill text-[#0e606e] text-lg" />
                    )}
                  </div>
                  <div className="text-sm text-gray-500">{doctor.specialization || 'Specialist'}</div>
                </div>
              </div>
              <button
                className="px-3 py-1 border border-red-500 text-red-500 rounded-md hover:bg-red-50"
                onClick={(e) => handleRevokeAccess(doctor._id, doctor.fullName, e)}
              >
                Revoke
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PatientDoctorAccess;
