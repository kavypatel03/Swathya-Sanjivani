import React from 'react';

const PatientPrescription = () => {
  const prescriptionData = [
    {
      id: 1,
      title: "Blood Test Reports",
      uploadDate: "11 January 2025"
    },
    {
      id: 2,
      title: "X-Ray Report (Left Leg)",
      uploadDate: "11 January 2025"
    },
    {
      id: 3,
      title: "Blood Test Reports",
      uploadDate: "11 August 2024"
    },
    {
      id: 4,
      title: "X-Ray Report (Left Leg)",
      uploadDate: "11 August 2024"
    },
    {
      id: 5,
      title: "Routine Check-up",
      uploadDate: "10 March 2024"
    }
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-[#0e606e]">Sanjaybhai's Prescriptions</h2>
        <div className="flex items-center space-x-2">
          <button className="p-2 border rounded-md">
            <i className="ri-calendar-line text-[#0e606e]"></i>
          </button>
          <button className="bg-[#0e606e] text-white px-4 py-2 rounded-md flex items-center">
            <i className="ri-upload-line mr-1"></i>
            Upload New
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {prescriptionData.map((item) => (
          <div key={item.id} className="border rounded-lg p-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium">{item.title}</h3>
              <p className="text-sm text-gray-600">Uploaded on: {item.uploadDate}</p>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-600 hover:text-[#0e606e]">
                <i className="ri-eye-line"></i>
              </button>
              <button className="p-2 text-gray-600 hover:text-[#0e606e]">
                <i className="ri-download-line"></i>
              </button>
              <button className="p-2 text-gray-600 hover:text-[#0e606e]">
                <i className="ri-printer-line"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientPrescription;