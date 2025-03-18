import React, { useEffect, useState } from 'react';
import axios from 'axios';

const formatDate = (date) => {
    if (!date) return 'N/A';  // Handles null/undefined dates
    const dateObj = new Date(date);
    return `${dateObj.getDate().toString().padStart(2, '0')}-${(dateObj.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${dateObj.getFullYear()}`;
};

const FamilyMembers = () => {
    const [familyMembers, setFamilyMembers] = useState([]);

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
                } else {
                    setFamilyMembers([]); // Ensures fallback if no family data
                }
            } catch (error) {
                console.error('Error fetching family data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-[#0e606e] mb-4">Family Members</h2>
            {familyMembers.length > 0 ? (
                <div className="space-y-4">
                    {familyMembers.map((member, index) => (
                        <div key={index} className="flex items-center justify-between border-b pb-3">
                            <div className="flex items-center">
                                <div className="bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center text-2xl">
                                    {member.avatar || '👨'}
                                </div>
                                <div className="ml-4">
                                    <h3 className="font-semibold">{member.fullName}</h3>
                                    <p className="text-sm text-gray-600">DOB: {formatDate(member.dob || member.birthDate)}</p>
                                    <p className="text-sm text-gray-600">Age: {member.age}</p>
                                    <p className="text-sm text-gray-600">Relation: {member.relationWithMainPerson}</p>
                                </div>
                            </div>
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
