import React, { useState, useEffect } from 'react';

const OtherDoctorList = () => {
  const [doctorData, setDoctorData] = useState(null);

  useEffect(() => {
    const handleDoctorSelected = (e) => {
      const doctor = e.detail.doctor;
      
      // Get the first assistant if available
      const primaryAssistant = doctor.assistants?.[0] || {};
      
      setDoctorData({
        doctorName: `Dr. ${doctor.fullName}`,
        doctorDescription: doctor.specialization || 'Select Doctor',
        licenseStatus: doctor.licenseStatus || 'Select Doctor', // Make sure this is coming from backend
        assistantName: primaryAssistant.fullName || 'Select Doctor',
        assistantPost: primaryAssistant.post || 'Select Doctor',
        hospitalName: doctor.hospitalName || 'Select Doctor',
        assistantVerification: primaryAssistant.verificationStatus || 'Select Doctor' // Ensure this field exists
      });
    };

    window.addEventListener('doctorSelected', handleDoctorSelected);
    
    return () => {
      window.removeEventListener('doctorSelected', handleDoctorSelected);
    };
  }, []);

  // Default sample data if no doctor selected
  const data = doctorData || {
    doctorName: "Select Doctor",
    doctorDescription: "Select Doctor",
    licenseStatus: "Select Doctor",
    assistantName: "Select Doctor",
    assistantPost: "Select Doctor",
    hospitalName: "Select Doctor",
    hospitalAddress: "Select Doctor",
    hospitalContact: "Select Doctor",
    assistantVerification: "Select Doctor"
  };

  return (
    <div className="bg-white p-6 rounded-md shadow-sm">
      <h2 className="text-xl font-semibold mb-4 text-teal-800" style={{ color: '#0e606e' }}>
        Doctor Details
      </h2>
      
      <div className="border rounded-md overflow-hidden">
        <table className="w-full">
          <tbody>
            <tr className="border-b">
              <td className="py-3 px-4 border-r font-medium text-teal-700" style={{ color: '#0e606e' }}>Doctor Name</td>
              <td className="py-3 px-4">{data.doctorName}</td>
            </tr>
            
            <tr className="border-b">
              <td className="py-3 px-4 border-r font-medium text-teal-700" style={{ color: '#0e606e' }}>Specialization</td>
              <td className="py-3 px-4">{data.doctorDescription}</td>
            </tr>
            
            <tr className="border-b">
              <td className="py-3 px-4 border-r font-medium text-teal-700" style={{ color: '#0e606e' }}>License Status</td>
              <td className="py-3 px-4">
                {data.licenseStatus}
                {data.licenseStatus === 'Verified' && (
                  <i className="ri-verified-badge-fill text-[#0e606e] ml-2" />
                )}
              </td>
            </tr>
            
            <tr className="border-b">
              <td className="py-3 px-4 border-r font-medium text-teal-700" style={{ color: '#0e606e' }}>Assistant Name</td>
              <td className="py-3 px-4">{data.assistantName}</td>
            </tr>
            
            <tr className="border-b">
              <td className="py-3 px-4 border-r font-medium text-teal-700" style={{ color: '#0e606e' }}>Assistant Post</td>
              <td className="py-3 px-4">{data.assistantPost}</td>
            </tr>

            <tr className="border-b">
              <td className="py-3 px-4 border-r font-medium text-teal-700" style={{ color: '#0e606e' }}>Assistant Status</td>
              <td className="py-3 px-4">{data.assistantVerification}</td>
            </tr>
            
            <tr className="border-b">
              <td className="py-3 px-4 border-r font-medium text-teal-700" style={{ color: '#0e606e' }}>Hospital Name</td>
              <td className="py-3 px-4">{data.hospitalName}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OtherDoctorList;