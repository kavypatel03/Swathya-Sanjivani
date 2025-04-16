import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserProfile = () => {
  const [assistantData, setAssistantData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssistantData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/AssistantLogin');
          return;
        }

        const response = await axios.get('http://localhost:4000/assistant/dashboard', {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.data.success) {
          const data = response.data.data;
          // Add dob (birthDate) to assistantData if present
          setAssistantData({
            ...data,
            dob: data.birthDate ? new Date(data.birthDate).toLocaleDateString('en-GB') : ''
          });

          // Fetch a random avatar URL from the API
          const randomAvatar = `https://avatar.iran.liara.run/public/`;
          setAvatarUrl(randomAvatar);
        } else {
          throw new Error(response.data.message || 'Failed to fetch data');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        if (err.response?.status === 401) {
          localStorage.removeItem('token'); // Clear invalid token
          navigate('/AssistantLogin');
        }
        setError(err.response?.data?.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchAssistantData();
  }, [navigate]);

  const isActive = (path) => location.pathname === path ? "border-[#0e606e] text-[#0e606e]" : "border-transparent text-gray-500 hover:text-gray-700";

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center mb-6">
      <div className="flex items-center">
        <div className="overflow-hidden border-2 border-[#0e606e] rounded-full mr-4">
          {/* Display random avatar */}
          <img src={avatarUrl} alt="User Avatar" className="h-14 w-14 object-cover" />
        </div>
        <div>
          <div className="flex items-center">
            <p className="text-[#0e606e] font-medium text-lg">Welcome, </p>
            <p className="text-[#ff9700] font-medium text-lg ml-1">{assistantData?.fullName}</p>
          </div>
          <div className="text-gray-500 text-sm">
            <p className="text-xs">Last login: {assistantData?.lastLogin}</p>
          </div>
        </div>
      </div>
      <Link to="/modifyDetailPage" className={`border-b-2 px-1 inline-flex items-center text-md font-medium ${isActive("/modifyDetailPage")}`}>
        Profile
      </Link>
    </div>
  );
};

export default UserProfile;
