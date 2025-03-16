import React from 'react';
// import PatientUserProfile from './PatientUserProfile';
// import { RemixIcon } from 'react-remix-icon';

function DoctorAccess() {
  const doctors = [
    {
      id: 1,
      name: "Dr. Manoj Shah",
      specialty: "Cardiologist",
      verified: true,
      avatar: "👨‍⚕️",
    },
    {
      id: 2,
      name: "Dr. Ajay Patel",
      specialty: "General Physician",
      verified: true,
      avatar: "👨‍⚕️"
    },
    {
      id: 3,
      name: "Dr. Shalini Mehta",
      specialty: "Radiologist",
      verified: true,
      avatar: "👨‍⚕️"
    },
    {
      id: 4,
      name: "Dr. Shubhash Bhatt",
      specialty: "Physiotherapist",
      verified: true,
      avatar: "👨‍⚕️"
    },
    {
      id: 5,
      name: "Dr. Reena Vyas",
      specialty: "Oncologist",
      verified: true,
      avatar: "👨‍⚕️"
    }
  ];

  return (
    <div className="container mx-auto ">
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-xl font-medium text-[#0e606e]">Doctor Access</h2>
          <a href="#" className="text-blue-500">See All</a>
        </div>
        
        <div className="space-y-4 mb-16">
          {doctors.map(doctor => (
            <div key={doctor.id} className="flex items-center justify-between border-b pb-4 mb-6">
              <div className="flex items-center">
                <div className="bg-gray-200 rounded-full h-14 w-12 flex items-center justify-center text-[#0e606e]">
                  {doctor.avatar}
                </div>
                <div className="ml-4">
                  <div className="flex items-center">
                    <p className="font-medium">{doctor.name}</p>
                    {doctor.verified }
                  </div>
                  <p className="text-gray-500 text-sm">{doctor.specialty}</p>
                </div>
              </div>
              <button className="bg-white text-red-500 border border-red-500 px-4 py-1 rounded text-sm hover:bg-red-50">
                Revoke
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DoctorAccess;