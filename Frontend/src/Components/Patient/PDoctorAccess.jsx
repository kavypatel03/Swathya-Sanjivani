import React from 'react';
import { useNavigate } from 'react-router-dom';

function PDoctorAccess({ doctors, onSelect, onRevoke }) {
  const navigate = useNavigate();

  const handleSeeAll = () => {
    navigate('/patient/doctors'); // Adjust route as needed
  };

  return (
    <div className="container mx-auto">
      <div className="bg-white rounded-lg shadow p-6" style={{ height: "570px" }}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium text-[#0e606e]">Doctor Access</h2>
        </div>

        <div
          className="space-y-4 overflow-y-auto pr-2"
          style={{ height: "calc(525px - 98px)" }} // 525px container - 74px header - 24px padding
        >
          {doctors.map(doctor => (
            <div key={doctor._id} className="flex items-center justify-between border-b pb-4 mb-6">
              <div
                className="flex items-center cursor-pointer"
                onClick={() => onSelect(doctor)}
              >
                <div className="h-14 w-14 rounded-full overflow-hidden border-2 border-[#0e606e]">
                <img
                    src={
                      doctor.gender === "Female"
                        ? "https://avatar.iran.liara.run/public/girl"
                        : "https://avatar.iran.liara.run/public/boy"
                    }
                    alt="doctor avatar"
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="ml-4">
                  <div className="flex items-center gap-1">
                    <p className="font-medium">
                      Dr. {doctor.fullName.split(' ').slice(0, 2).join(' ')}
                    </p>
                    {doctor.licenseStatus === "Verified" && (
                      <i className="ri-verified-badge-fill text-[#0e606e] text-lg"></i>
                    )}
                  </div>
                  <p className="text-gray-500 text-sm">{doctor.specialization}</p>
                </div>
              </div>
              <button
                className="bg-white text-red-500 border border-red-500 px-4 py-1 rounded text-sm hover:bg-red-50"
                onClick={(e) => {
                  e.stopPropagation();
                  onRevoke(doctor._id);
                }}
              >
                Revoke
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PDoctorAccess;