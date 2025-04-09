import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function UserProfile() {
  const [doctorData, setDoctorData] = useState(null);
  const [lastLogin, setLastLogin] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const response = await fetch('http://localhost:4000/doctor/dashboard', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        const data = await response.json();

        if (data.success) {
          setDoctorData(data.data);
          setLastLogin(data.data.lastLogin || 'Just now');
        } else {
          toast.error("Failed to fetch doctor details");
          navigate('/DoctorLogin');
        }
      } catch (error) {
        toast.error("Session expired. Please login again");
        navigate('/DoctorLogin');
      }
    };

    fetchDoctorData();
  }, [navigate]);

  if (!doctorData) {
    return <div className="text-center text-gray-500 py-20">Loading Doctor Data...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow px-6 p-6 m-1">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="h-16 w-16 rounded-full bg-[#ff9700] flex items-center justify-center text-white">
            <i className="ri-user-line text-2xl"></i>
          </div>
          <div className="ml-4">
            <div className="text-xl font-medium">
              <span className="text-gray-700">Welcome, </span>
              <span className="text-[#ff9700]">
                {`Dr. ${doctorData?.fullname || 'Guest'}`}
              </span>
            </div>
            <div className="text-sm text-gray-500">Last login: {lastLogin}</div>
          </div>
        </div>
        <Link to="/DoctorProfile" className="flex items-center text-[#0e606e] hover:text-[#0e606e]/80 font-bold">
          Profile
        </Link>
      </div>
    </div>
  );
}

export default UserProfile;