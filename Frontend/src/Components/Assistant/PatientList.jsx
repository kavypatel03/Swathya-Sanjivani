import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState(null);

  useEffect(() => {
    const fetchAndInitialize = async () => {
      try {
        const response = await axios.get('http://localhost:4000/assistant/patients', {
          withCredentials: true
        });
       
        if (response.data.success) {
          setPatients(response.data.data);
         
          // Get stored patient ID or use first patient
          const storedPatientId = localStorage.getItem('selectedPatientId');
          if (storedPatientId) {
            handlePatientClick(storedPatientId);
            setSelectedPatientId(storedPatientId);
          } else if (response.data.data.length > 0) {
            handlePatientClick(response.data.data[0]._id);
          }
        }
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };
    fetchAndInitialize();
  }, []);

  const handlePatientClick = async (patientId) => {
    try {
      // Store selected patient ID
      localStorage.setItem('selectedPatientId', patientId);
      setSelectedPatientId(patientId);
      // Emit event for other components
      const event = new CustomEvent('patientSelected', {
        detail: { patientId }
      });
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Error selecting patient:', error);
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.fullname?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Custom scrollbar styles for webkit browsers
  const scrollbarStyles = `
    .custom-scrollbar::-webkit-scrollbar {
      width: 10px; 
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background-color: #0e606e;
      border-radius: 20px;
    }
    .custom-scrollbar::-webkit-scrollbar-button {
      display: none;
    }
  `;

  // Determine if scrollbar should be visible
  const shouldShowScrollbar = filteredPatients.length > 2;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <style>{scrollbarStyles}</style>
      <h2 className="text-[#0e606e] font-medium text-lg mb-4">Doctor's Patients List</h2>
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Search Patient"
          className="border border-gray-300 rounded-md px-3 py-2 mr-2 flex-grow"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
     
      {filteredPatients.length === 0 ? (
        <p className="text-center text-gray-500 py-4">No patients found</p>
      ) : (
        <div 
          className={`${shouldShowScrollbar ? 'custom-scrollbar overflow-y-auto' : 'overflow-y-hidden'}`}
          style={{
            height: '155px',
            scrollbarWidth: shouldShowScrollbar ? 'thin' : 'none',
            scrollbarColor: '#0e606e transparent',
            paddingRight: '5px'
          }}
        >
          {filteredPatients.map((patient) => {
            const avatarUrl = `https://avatar.iran.liara.run/public/Boy`; // Avatar URL based on patient ID
            return (
              <div
                key={patient._id}
                className={`border border-gray-200 rounded-md p-3 mb-2 cursor-pointer ${selectedPatientId === patient._id ? 'bg-[#0e606e1a]' : ''}`}
                onClick={() => handlePatientClick(patient._id)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-[#0e606e] mr-3">
                      {/* Display patient avatar */}
                      <img src={avatarUrl} alt="Patient Avatar" className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <p className="font-medium">{patient.fullname}</p>
                      <p className="text-gray-500 text-sm">
                        {patient.mobile} | {patient.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PatientList;