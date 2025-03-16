import React from 'react';

function DoctorAccess() {
  const doctors = [
    { id: 1, name: 'Dr. Manoj Shah', specialty: 'Cardiologist' },
    { id: 2, name: 'Dr. Ajay Patel', specialty: 'General Physician' },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium text-[#0e606e]">Doctor Access</h2>
        <button className="text-blue-500 hover:text-blue-700">
          See All
        </button>
      </div>
      
      <div className="space-y-4">
        {doctors.map(doctor => (
          <div key={doctor.id} className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-blue-200 flex items-center justify-center">
                <i className="ri-user-3-line text-gray-600"></i>
              </div>
              <div className="ml-3">
                <div className="font-medium">{doctor.name}</div>
                <div className="text-sm text-gray-500">{doctor.specialty}</div>
              </div>
            </div>
            <button className="px-3 py-1 border border-red-500 text-red-500 rounded-md hover:bg-red-50">
              Revoke
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DoctorAccess;