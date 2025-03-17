import React from 'react';
// import PatientUserProfile from './PatientUserProfile';
// import { RemixIcon } from 'react-remix-icon';

function PatientDoctorPending() {
  const doctorDetails = {
    name: "Dr. Manoj Shah",
    description: "M.B.B.S, D.N.B (General Medicine),D.N.B (Cardiology)",
    licenseStatus: "Verified",
    assistantName: "Anilkumar Rathod",
    assistantPost: "MD (Cardiology)",
    assistantDesignation: "Medical Assistant (BS/MD)",
    hospitalName: "BIMS Multispeciality Hospital",
    hospitalAddress: "Opp.Sir T Hospital, Jail Rd, Bhavnagar, Gujarat 364001",
    hospitalContact: "+ (0278) 675 4444"
  };

  return (
    <div className="container mx-auto">
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-medium text-[#0e606e] mb-6">Doctor Access / Pending Request</h2>
        
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <tbody>
              <tr className="border-b">
                <td className="p-4 font-medium text-[#0e606e] border-r w-1/4">Doctor Name</td>
                <td className="p-4">{doctorDetails.name}</td>
              </tr>
              <tr className="border-b">
                <td className="p-4 font-medium text-[#0e606e] border-r">Doctor Description</td>
                <td className="p-4">{doctorDetails.description}</td>
              </tr>
              <tr className="border-b">
                <td className="p-4 font-medium text-[#0e606e] border-r">Doctor License Status</td>
                <td className="p-4 text-green-600">
                  {doctorDetails.licenseStatus}
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-4 font-medium text-[#0e606e] border-r">Doctor Assistant Name</td>
                <td className="p-4">
                  {doctorDetails.assistantName}
                  <span className="ml-4 text-gray-500">{doctorDetails.assistantDesignation}</span>
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-4 font-medium text-[#0e606e] border-r">Doctor Assistant Post</td>
                <td className="p-4">{doctorDetails.assistantPost}</td>
              </tr>
              <tr className="border-b">
                <td className="p-4 font-medium text-[#0e606e] border-r">Hospital Name</td>
                <td className="p-4">{doctorDetails.hospitalName}</td>
              </tr>
              <tr className="border-b">
                <td className="p-4 font-medium text-[#0e606e] border-r">Hospital Address</td>
                <td className="p-4">{doctorDetails.hospitalAddress}</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-[#0e606e] border-r">Hospital Contact No</td>
                <td className="p-4">{doctorDetails.hospitalContact}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="flex justify-end mt-6">
          <button className="bg-white text-red-500 border border-red-500 px-6 py-2 rounded hover:bg-red-50">
            Revoke
          </button>
        </div>
      </div>
    </div>
  );
}

export default PatientDoctorPending;