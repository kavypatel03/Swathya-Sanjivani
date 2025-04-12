import React from 'react';

function PatientDoctorPending({ doctor, onRevoke }) {
  if (!doctor) {
    return (
      <div className="container mx-auto">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-medium text-[#0e606e] mb-6">
            Doctor Access / Pending Request
          </h2>
          <div className="text-center py-10 text-gray-500">
            Select a doctor to view details
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-medium text-[#0e606e] mb-6">
          Doctor Access / Pending Request
        </h2>
        
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <tbody>
              <tr className="border-b">
                <td className="p-4 font-medium text-[#0e606e] border-r w-1/4">Doctor Name</td>
                <td className="p-4">{doctor.fullName}</td>
              </tr>
              <tr className="border-b">
                <td className="p-4 font-medium text-[#0e606e] border-r">Specialization</td>
                <td className="p-4">{doctor.specialization}</td>
              </tr>
              <tr className="border-b">
                <td className="p-4 font-medium text-[#0e606e] border-r">License Status</td>
                <td className="p-4">
                  {doctor.licenseStatus === 'Verified' && (
                    <span className="text-[#0e606e] font-medium">
                      <i className="ri-verified-badge-fill text-[#0e606e] text-lg"> </i>
                      Verified
                    </span>
                  )}
                  {doctor.licenseStatus === 'Pending' && (
                    <span className="text-yellow-600 font-medium">
                      <span className="inline-block bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full text-xs mr-2">⏳</span>
                      Pending
                    </span>
                  )}
                  {doctor.licenseStatus === 'Rejected' && (
                    <span className="text-red-600 font-medium">
                      <span className="inline-block bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs mr-2">✖</span>
                      Rejected
                    </span>
                  )}
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-4 font-medium text-[#0e606e] border-r">MCI Registration</td>
                <td className="p-4">{doctor.mciRegistrationNumber}</td>
              </tr>
              <tr className="border-b">
                <td className="p-4 font-medium text-[#0e606e] border-r">Hospital Name</td>
                <td className="p-4">{doctor.hospitalName}</td>
              </tr>
              <tr className="border-b">
                <td className="p-4 font-medium text-[#0e606e] border-r">Contact</td>
                <td className="p-4">{doctor.mobile}</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-[#0e606e] border-r">Email</td>
                <td className="p-4">{doctor.email}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="flex justify-end mt-6">
          <button 
            className="bg-white text-red-500 border border-red-500 px-6 py-2 rounded hover:bg-red-50"
            onClick={() => onRevoke(doctor._id)}
          >
            Revoke
          </button>
        </div>
      </div>
    </div>
  );
}

export default PatientDoctorPending;