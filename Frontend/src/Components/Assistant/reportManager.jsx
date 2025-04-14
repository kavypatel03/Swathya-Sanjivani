import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReportManager = ({ onCategorySelect }) => {
  const [documents, setDocuments] = useState([]);
  const [counts, setCounts] = useState({
    'Prescriptions': 0,
    'Lab Reports': 0,
    'X-Rays': 0,
    'Others': 0,
    'All Documents': 0
  });

  useEffect(() => {
    // Fetch document categories/counts from the backend
    const fetchCategories = async () => {
      try {
        const patientId = localStorage.getItem('selectedPatientId');
        const familyId = localStorage.getItem('selectedFamilyMemberId');
        
        if (patientId && familyId) {
          const response = await axios.get(
            `http://localhost:4000/assistant/document-categories/${patientId}/${familyId}`,
            { withCredentials: true }
          );

          if (response.data.success) {
            setCounts(response.data.data);
          }
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const patientId = localStorage.getItem('selectedPatientId');
      const familyId = localStorage.getItem('selectedFamilyMemberId');
      
      if (patientId && familyId) {
        const response = await axios.get(
          `http://localhost:4000/assistant/patient-documents/${patientId}/${familyId}`,
          { withCredentials: true }
        );
  
        if (response.data.success) {
          const docs = response.data.data;
          setDocuments(docs);
          // No need to call updateCounts here since we're already getting counts from the backend
        }
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };
  
  const handleCategoryClick = (category) => {
    // This function sends the selected category to the parent component
    onCategorySelect(category);
  };

  const documentCategories = [
    {
      id: 1,
      title: "Prescriptions",
      count: counts['Prescriptions'],
      icon: "ri-file-list-line",
      color: "bg-blue-100"
    },
    {
      id: 2,
      title: "Lab Reports",
      count: counts['Lab Reports'],
      icon: "ri-file-chart-line",
      color: "bg-green-100"
    },
    {
      id: 3,
      title: "X-Rays",
      count: counts['X-Rays'],
      icon: "ri-image-line",
      color: "bg-purple-100"
    },
    {
      id: 4,
      title: "Others",
      count: counts['Others'],
      icon: "ri-file-copy-line",
      color: "bg-yellow-100"
    },
    {
      id: 5,
      title: "All Documents",
      count: counts['All Documents'],
      icon: "ri-folder-open-line",
      color: "bg-gray-100"
    }
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-[#0e606e] mb-6">Document Manager</h2>
      <div className="space-y-4">
        {documentCategories.map((category) => (
          <div 
            key={category.id} 
            onClick={() => handleCategoryClick(category.title)}
            className="border rounded-lg p-4 flex items-center hover:bg-gray-50 cursor-pointer"
          >
            <div className={`${category.color} p-4 rounded-md mr-4`}>
              <i className={`${category.icon} text-2xl`}></i>
            </div>
            <div>
              <h3 className="font-medium text-lg">{category.title}</h3>
              <p className="text-sm text-gray-600">{category.count} Files</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportManager;