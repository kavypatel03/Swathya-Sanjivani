import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function UserProfile() {
  const [doctorData, setDoctorData] = useState(null);
  const [lastLogin, setLastLogin] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        console.log('Fetching doctor data...');
        const response = await axios.get('http://localhost:4000/doctor/dashboard', {
          withCredentials: true
        });

        if (response.data.success) {
          const data = response.data.data;
          setDoctorData({
            ...data,
            fullname: data.fullname || data.name || 'Guest'
          });
          setLastLogin(data.lastLogin || 'Unknown');
        } else {
          toast.error("Failed to fetch doctor details.");
        }
      } catch (error) {
        if (error.response?.status === 401) {
          navigate('/DoctorLogin');
        }
        toast.error(error.response?.data?.message || "Error fetching data");
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