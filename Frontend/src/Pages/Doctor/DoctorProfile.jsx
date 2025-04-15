import React, { useState, useEffect } from 'react';
import Nav from "../../Components/Doctor/Nav";
import Navigation from "../../Components/Doctor/Navigation";
import UserProfile from "../../Components/Doctor/UserProfile";
import ModifyDetails from "../../Components/Doctor/ModifyProfile";
import { toast } from 'react-toastify';

const DoctorProfilePage = () => {
  const [doctorData, setDoctorData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctorData = async () => {
      const doctorId = localStorage.getItem('doctorId');
      const token = localStorage.getItem('token');
      
      if (!doctorId || !token) {
        toast.error("Authentication required");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:4000/doctor/doctor/${doctorId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && data.data) {
          setDoctorData(data.data);
        } else {
          toast.error(data.message || "Failed to load doctor data");
        }
      } catch (error) {
        console.error('Error fetching doctor data:', error);
        toast.error("Failed to load profile data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorData();
  }, []);

  const renderNavigation = () => {
    if (doctorData?.patients && doctorData.patients.length > 0) {
      return <Nav />;
    } else {
      return <Navigation />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        {renderNavigation()}
        <div className="container mx-auto py-6 px-4">
          <div className="text-center">Loading doctor profile...</div>
        </div>
      </div>
    );
  }

  if (!doctorData) {
    return (
      <div className="min-h-screen bg-gray-100">
        {renderNavigation()}
        <div className="container mx-auto py-6 px-4">
          <div className="text-center text-red-500">
            Failed to load doctor data. Please refresh the page.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {renderNavigation()}
      <div className="container mx-auto py-6 px-4">
        <UserProfile 
          name={`Dr. ${doctorData.fullName}`} 
          lastLogin={new Date().toLocaleString('en-IN', {
            weekday: 'long',
            hour: '2-digit',
            minute: '2-digit'
          })}
          specialization={doctorData.specialization}
          hospital={doctorData.hospitalName}
        />
        <div className="mt-6">
          <ModifyDetails />
        </div>
      </div>
    </div>
  );
};

export default DoctorProfilePage;
