import React from 'react';

const FamilyMembers = () => {
  const familyMembers = [
    {
      name: "Sanjaybhai B. Gohil",
      dob: "15-1-1987",
      age: 38,
      relation: "Self",
      avatar: "👨"
    },
    {
      name: "Rashmiben S. Gohil",
      dob: "18-08-1985",
      age: 32,
      relation: "Wife",
      avatar: "👩"
    },
    {
      name: "Param S. Gohil",
      dob: "8-5-2010",
      age: 15,
      relation: "Son",
      avatar: "👦"
    },
    {
      name: "Babubhai M. Gohil",
      dob: "10-12-1937",
      age: 88,
      relation: "Father",
      avatar: "👴"
    },
    {
      name: "Shardaben B. Gohil",
      dob: "23-09-1945",
      age: 80,
      relation: "Mother",
      avatar: "👵"
    }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-[#0e606e] mb-4">Family Members</h2>
      <div className="space-y-4">
        {familyMembers.map((member, index) => (
          <div key={index} className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center">
              <div className="bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center text-2xl">
                {member.avatar}
              </div>
              <div className="ml-4">
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-sm text-gray-600">DOB: {member.dob}</p>
                <p className="text-sm text-gray-600">Age: {member.age}</p>
                <p className="text-sm text-gray-600">Relation: {member.relation}</p>
              </div>
            </div>
            <i class="ri-close-large-line text-red-500 cursor-pointer"></i>
            {/* <IconClose className="text-red-500 cursor-pointer" /> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FamilyMembers;