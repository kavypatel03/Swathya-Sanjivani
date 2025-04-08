import React from 'react';

// Doctor Consulted Component
const DoctorConsulted = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#0e606e]">Doctor Consulted</h2>
        <button className="text-[#0e606e] font-medium">See All</button>
      </div>
      
      {[
        { name: 'Dr. Manoj Shah', specialty: 'Cardiologist', verified: true },
        { name: 'Dr. Ajay Patel', specialty: 'General Physician', verified: true },
        { name: 'Dr. Shalini Mehta', specialty: 'Radiologist', verified: true }
      ].map((doctor, index) => (
        <div key={index} className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-200 rounded-full mr-3 overflow-hidden">
              <div className="bg-[#0e606e] text-white flex items-center justify-center h-full">
                {doctor.name.charAt(3)}
              </div>
            </div>
            <div>
              <div className="flex items-center">
                <h3 className="font-medium mr-1">{doctor.name}</h3>
                {doctor.verified && (
                  <span className="text-[#0e606e]">
                    <i className="ri-checkbox-circle-line"></i>
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">{doctor.specialty}</p>
            </div>
          </div>
          <button className="text-[#0e606e] font-medium">Details</button>
        </div>
      ))}
    </div>
  );
};


export default DoctorConsulted;
// This component displays a list of doctors consulted by the patient. Each doctor has a name, specialty, and a button to view more details. The styling is done using Tailwind CSS for a clean and modern look.