// ModifyDetailPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navigation from '../../Components/Assistant/AssistantNav';
import UserProfile from '../../Components/Assistant/UserProfile';
import ModifyDetails from '../../Components/Assistant/modifyDetail';

const ModifyDetailPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        let token = localStorage.getItem('token'); // Get token from local storage

        // If token is not in local storage, check cookies
        if (!token) {
          const cookies = document.cookie.split('; ');
          const tokenCookie = cookies.find(row => row.startsWith('token='));
          if (tokenCookie) {
            token = tokenCookie.split('=')[1];
          }
        }

        if (!token) {
          toast.error('No authentication token found. Please log in.');
          setTimeout(() => {
            window.location.href = '/AssistantLogin'; // Redirect to login
          }, 2000);
          return;
        }

        console.log('Token being sent:', token); // Log the token

        const response = await axios.get('http://localhost:4000/assistant/dashboard', {
          headers: { Authorization: `Bearer ${token}` } // Pass token in headers
        });

        if (response.data.success) {
          setUserData(response.data.data);
        } else {
          throw new Error('Unexpected response format');
        }
      } catch (err) {
        console.error('Authentication error:', err);
        if (err.response?.status === 401) {
          toast.error('Session expired. Please log in again.');
          setTimeout(() => {
            window.location.href = '/AssistantLogin'; // Redirect to login
          }, 2000);
        } else {
          const errorMsg = err.response?.data?.message || 'Authentication failed. Please log in again.';
          setError(errorMsg);
          toast.error(errorMsg);
        }
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#0e606e] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">⚠️</div>
          <h2 className="text-lg font-medium text-gray-800">Authentication Error</h2>
          <p className="mt-2 text-gray-600">{error}</p>
        </div>
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="bg-gray-200 min-h-screen">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-md mb-6">
          <UserProfile userData={userData} />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <ModifyDetails />
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default ModifyDetailPage;