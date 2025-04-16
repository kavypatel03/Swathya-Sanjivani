import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const formatDate = (date) => {
  if (!date) return "N/A";
  const dateObj = new Date(date);
  return `${dateObj.getDate().toString().padStart(2, "0")}-${(
    dateObj.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${dateObj.getFullYear()}`;
};

const FamilyMembers = () => {
  const [familyMembers, setFamilyMembers] = useState([]);
  const [selectedMemberId, setSelectedMemberId] = useState(
    localStorage.getItem('selectedFamilyId') || ''
  );
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/patient/get-patient-details?mobile=9426024009`,
          { withCredentials: true }
        );
        const { data } = response.data;

        if (data?.family && data.family.length > 0) {
          setFamilyMembers(data.family);

          // If there's no selected member yet but we have a stored ID
          const storedId = localStorage.getItem('selectedFamilyId');
          if (storedId && !selectedMemberId) {
            setSelectedMemberId(storedId);
          }
        } else {
          setFamilyMembers([]);
        }
      } catch (error) {
        console.error("Error fetching family data:", error);
      }
    };

    fetchData();
  }, [selectedMemberId]);

  const handleEditClick = (member) => {
    // Save selected member ID
    setSelectedMemberId(member._id);
    localStorage.setItem('selectedFamilyId', member._id);

    if (member.relationWithMainPerson === "Self") {
      navigate("/PatientFamilyPage");
    } else {
      navigate("/PatientAddMemPage", { state: { memberData: member } });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-[#0e606e] mb-4">
        Family Members
      </h2>
      {familyMembers.length > 0 ? (
        <div className="space-y-4">
          {familyMembers.map((member, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 border-l-4 ${selectedMemberId === member._id
                  ? "border-l-[#0e606e] bg-[#e0f7fa] shadow"
                  : "border-l-transparent hover:bg-gray-50"
                }`}
              onClick={() => handleEditClick(member)}
            >
              <div className="flex items-center">
                <div className={`w-12 h-12 rounded-full overflow-hidden border-2 ${selectedMemberId === member._id ? "border-[#0e606e]" : "border-gray-300"
                  }`}>
                  <img
                    src={
                      member.gender?.toLowerCase() === "female"
                        ? "https://avatar.iran.liara.run/public/girl"
                        : "https://avatar.iran.liara.run/public/boy"
                    }
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="ml-4">
                  <h3 className={`font-semibold ${selectedMemberId === member._id ? "text-[#0e606e]" : ""
                    }`}>
                    {member.fullName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    DOB: {formatDate(member.dob || member.birthDate)}
                  </p>
                  <p className="text-sm text-gray-600">Age: {member.age}</p>
                  <p className="text-sm text-gray-600">
                    Relation: {member.relationWithMainPerson}
                  </p>
                </div>
              </div>

              {selectedMemberId === member._id && (
                <div className="text-[#0e606e]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No family members found.</p>
      )}
    </div>
  );
};

export default FamilyMembers;