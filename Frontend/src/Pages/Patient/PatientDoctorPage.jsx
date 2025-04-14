import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserProfile from '../../Components/Patient/PatientUserProfile';
import PDoctorAccess from '../../Components/Patient/PDoctorAccess';
import PatientDoctorPending from '../../Components/Patient/PatientDoctorPending';
import Swal from 'sweetalert2';

// Configure axios defaults
axios.defaults.baseURL = 'http://localhost:4000';

// Add request interceptor for debugging
axios.interceptors.request.use(request => {
  return request;
});

function PatientDoctorPage() {
  const { patientId, doctorId } = useParams();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get patient ID from local storage if not provided in URL
  const userId = patientId || localStorage.getItem('patientId');

  // Fetch all doctors for this patient
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/PatientLogin');
      return;
    }

    const fetchDoctors = async () => {
      try {
        setLoading(true);
        
        const response = await axios.get(`/patient/${userId}/doctors`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          withCredentials: true
        });
        
        // Check for successful response
        if (response.data.success && response.data.data) {
          setDoctors(response.data.data);
          
          // If a doctorId is in the URL, select that doctor
          if (doctorId && response.data.data.length > 0) {
            const foundDoctor = response.data.data.find(doc => doc._id === doctorId);
            setSelectedDoctor(foundDoctor || null);
          } else if (response.data.data.length > 0) {
            // Otherwise select the first doctor in the list
            setSelectedDoctor(response.data.data[0]);
          }
        } else {
          setError('Failed to fetch doctors: ' + (response.data.message || 'Unknown error'));
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Full error:', err);  // Enhanced error logging
        console.error('Response:', err.response?.data); // Add response data logging
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/PatientLogin');
        }
        setError('Error fetching doctors: ' + (err.response?.data?.message || err.message));
        setLoading(false);
      }
    };
    
    if (userId && token) {
      fetchDoctors();
    } else {
      setError('Patient ID not found');
      setLoading(false);
    }
  }, [userId, doctorId, navigate]);

  // Handle doctor selection
  const handleSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor);
  };

  // Update handleRevokeAccess to use Sweetalert2
  const handleRevokeAccess = (doctorId) => {
    if (!doctorId) {
      Swal.fire({
        title: "Error!",
        text: "Invalid doctor selection",
        icon: "error",
        confirmButtonColor: "#ef4444"
      });
      return;
    }

    const doctor = doctors.find(d => d._id === doctorId);
    if (!doctor) {
      Swal.fire({
        title: "Error!",
        text: "Doctor not found",
        icon: "error",
        confirmButtonColor: "#ef4444"
      });
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: `This will revoke Dr. ${doctor.fullName}'s access to your medical records.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0e606e",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, revoke access!",
      background: "#ffffff",
      iconColor: "#ff9700",
      Color: "#4b5563"
    }).then((result) => {
      if (result.isConfirmed) {
        confirmRevoke(doctorId);
      }
    });
  };

  // Update confirmRevoke to show success/error messages
  const confirmRevoke = async (doctorId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`http://localhost:4000/patient/${userId}/doctors/${doctorId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      
      if (response.status === 200) {
        setDoctors(prev => prev.filter(doctor => doctor._id !== doctorId));
        if (selectedDoctor && selectedDoctor._id === doctorId) {
          const remainingDoctors = doctors.filter(d => d._id !== doctorId);
          setSelectedDoctor(remainingDoctors.length > 0 ? remainingDoctors[0] : null);
        }
        Swal.fire({
          title: "Access Revoked!",
          text: "The doctor's access has been revoked successfully.",
          icon: "success",
          confirmButtonText: "Done",
          confirmButtonColor: "#0e606e",
          iconColor: "#0e606e"
        });
      }
    } catch (err) {
      console.error('Revoke error:', err);
      Swal.fire({
        title: "Error!",
        text: "Failed to revoke doctor's access.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#ef4444"
      });
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading doctor information...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <ToastContainer />
      <main className="container mx-auto p-4">
        <UserProfile />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="col-span-2">
            <PatientDoctorPending 
              doctor={selectedDoctor} 
              onRevoke={handleRevokeAccess} 
            />
          </div>
          <div className="col-span-1">
            <PDoctorAccess 
              doctors={doctors} 
              onSelect={handleSelectDoctor} 
              onRevoke={handleRevokeAccess} 
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default PatientDoctorPage;