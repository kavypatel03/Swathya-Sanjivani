import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function FamilyMembers({ setSelectedMember }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState(localStorage.getItem('selectedFamilyId') || '');

  useEffect(() => {
    const fetchFamilyMembers = async () => {
      try {
        const response = await fetch('http://localhost:4000/patient/get-family-members', {
          method: 'GET',
          credentials: 'include'
        });
        
        const data = await response.json();
        if (data.success) {
          setMembers(data.data);
          
          // If there's a selected ID in localStorage but no member is selected yet
          const storedId = localStorage.getItem('selectedFamilyId');
          if (storedId && data.data.length > 0) {
            const foundMember = data.data.find(m => m._id === storedId);
            if (foundMember) {
              setSelectedMember(foundMember);
            }
          }
        } else {
          setError('❌ Failed to load family members.');
        }
      } catch (error) {
        console.error('❌ Error fetching family members:', error);
        setError('❌ Unable to fetch data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchFamilyMembers();
  }, [setSelectedMember]);

  const handleMemberSelect = (member) => {
    setSelectedMember(member);
    setSelectedId(member._id);
    localStorage.setItem('selectedFamilyId', member._id);
  };
  
  // Custom scrollbar styles for webkit browsers
  const scrollbarWebkitStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 10px; // Increase this value to make the scrollbar wider
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #0e606e;
    border-radius: 20px;
  }
  .custom-scrollbar::-webkit-scrollbar-button {
    height: 0;
    width: 0;
    background: transparent;
  }
`;

  return (
    <div className="bg-white rounded-lg shadow p-3">
      <style>{scrollbarWebkitStyles}</style>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-medium text-[#0e606e]">Family Members</h2>
        <Link to={'/PatientAddMemPage'} className="text-blue-500 hover:text-blue-700">
          Add New
        </Link>
      </div>
      
      {loading ? (
        <p className="text-center text-gray-500">⏳ Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
          <div
          className="space-y-4 custom-scrollbar overflow-y-auto h-[225px]"
          style={{
            scrollbarWidth: 'auto', // Changed from 'thin' to 'auto' for wider scrollbar in Firefox
            scrollbarColor: '#0e606e transparent',
            paddingRight: '10px', // Increased padding to accommodate wider scrollbar
          }}
        >
          {members.map((member) => (
            <div
              key={member._id}
              className={`flex justify-between items-center cursor-pointer p-2 rounded-md transition-colors duration-200 border-l-4 ${
                selectedId === member._id 
                  ? 'bg-[#e0f7fa] border-l-[#0e606e] shadow' 
                  : 'border-l-transparent hover:bg-gray-50'
              }`}
              onClick={() => handleMemberSelect(member)}
            >
              <div className="flex items-center">
                <div className={`h-10 w-10 rounded-full text-xl ${
                  selectedId === member._id ? 'bg-[#0e606e] text-white' : 'bg-[#e0f7fa] text-gray-600'
                } flex items-center justify-center`}>
                  {member.avatar || "👨"}
                </div>
                
                <div className="ml-3">
                  <div className={`font-medium ${selectedId === member._id ? 'text-[#0e606e]' : ''}`}>
                    {member.fullName}
                  </div>
                  <div className="text-sm text-gray-500">
                    Age: {member.calculatedAge || member.age || 'N/A'}
                  </div>
                </div>
              </div>
              
              {selectedId === member._id && (
                <div className="text-[#0e606e]">
                  <i className="ri-check-line"></i>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FamilyMembers;