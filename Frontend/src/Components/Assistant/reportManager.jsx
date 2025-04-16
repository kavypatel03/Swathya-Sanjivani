import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const ReportManager = ({ onCategorySelect }) => {
  const [documents, setDocuments] = useState([]);
  const [categories, setCategories] = useState({
    'Prescriptions': { count: 0, icon: 'ri-file-list-line', color: 'bg-blue-100' },
    'Lab Reports': { count: 0, icon: 'ri-file-chart-line', color: 'bg-green-100' },
    'X-Rays': { count: 0, icon: 'ri-image-line', color: 'bg-purple-100' },
    'Others': { count: 0, icon: 'ri-file-copy-line', color: 'bg-yellow-100' },
    'All Documents': { count: 0, icon: 'ri-folder-open-line', color: 'bg-gray-100' }
  });

  useEffect(() => {
    const patientId = localStorage.getItem('selectedPatientId');
    const familyId = localStorage.getItem('selectedFamilyMemberId');

    if (patientId && familyId) {
      fetchDocuments(patientId, familyId);
    }

    const handleFamilyMemberChange = (event) => {  
      const { patientId, familyMemberId } = event.detail;
      if (patientId && familyMemberId) {
        fetchDocuments(patientId, familyMemberId);
      }
    };

    window.addEventListener('familyMemberSelected', handleFamilyMemberChange);
    return () => window.removeEventListener('familyMemberSelected', handleFamilyMemberChange);
  }, []);

  const fetchDocuments = async (patientId, familyId) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/patient/get-family-member-documents/${familyId}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        let docs = response.data.data;

        // Normalize document data structure
        docs = docs.map(doc => {
          // Handle potential nested document structure
          if (doc.document) {
            return {
              _id: doc.document._id || doc._id,
              documentName: doc.document.documentName || doc.document.name || "Untitled",
              documentType: doc.document.documentType || doc.document.type || "Others",
              uploadedAt: doc.uploadedAt || doc.document.uploadedAt || new Date()
            };
          }
          return doc;
        });

        // Update category counts with normalized case-insensitive comparison
        const counts = {
          'Prescriptions': { count: 0, icon: 'ri-file-list-line', color: 'bg-blue-100' },
          'Lab Reports': { count: 0, icon: 'ri-file-chart-line', color: 'bg-green-100' },
          'X-Rays': { count: 0, icon: 'ri-image-line', color: 'bg-purple-100' },
          'Others': { count: 0, icon: 'ri-file-copy-line', color: 'bg-yellow-100' },
          'All Documents': { count: 0, icon: 'ri-folder-open-line', color: 'bg-gray-100' }
        };

        // Count all documents
        counts['All Documents'].count = docs.length;

        docs.forEach(doc => {
          // Normalize document type for comparison
          const docType = (doc.documentType || '').trim().toLowerCase();
          
          if (docType === 'prescription' || docType === 'prescriptions') {
            counts['Prescriptions'].count++;
          } else if (docType === 'lab report' || docType === 'lab reports' || docType === 'labreport' || docType === 'labreports') {
            counts['Lab Reports'].count++;
          } else if (docType === 'x-ray' || docType === 'x-rays' || docType === 'xray' || docType === 'xrays') {
            counts['X-Rays'].count++;
          } else {
            counts['Others'].count++;
          }
        });

        setDocuments(docs);
        setCategories(counts);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
      Swal.fire({
        title: "Error!",
        text: "Failed to fetch documents",
        icon: "error",
        confirmButtonColor: "#ef4444"
      });
    }
  };

  const handleCategoryClick = (category) => {
    const categoryLower = category.toLowerCase();
    
    // Filter documents based on selected category
    let filteredDocs;
    
    if (categoryLower === 'all documents') {
      filteredDocs = documents;
    } else {
      filteredDocs = documents.filter(doc => {
        const docType = (doc.documentType || '').trim().toLowerCase();
        
        if (categoryLower === 'prescriptions' && (docType === 'prescription' || docType === 'prescriptions')) {
          return true;
        } else if (categoryLower === 'lab reports' && (
          docType === 'lab report' || 
          docType === 'lab reports' || 
          docType === 'labreport' || 
          docType === 'labreports' ||
          docType.includes('lab')
        )) {
          return true;
        } else if (categoryLower === 'x-rays' && (
          docType === 'x-ray' || 
          docType === 'x-rays' || 
          docType === 'xray' || 
          docType === 'xrays'
        )) {
          return true;
        } else if (categoryLower === 'others') {
          return ![
            'prescription', 'prescriptions', 
            'lab report', 'lab reports', 'labreport', 'labreports',
            'x-ray', 'x-rays', 'xray', 'xrays'
          ].some(type => docType.includes(type));
        }
        return false;
      });
    }
    
    // Ensure we're passing the correct category name and documents
    console.log(`Selected ${category} with ${filteredDocs.length} documents`);
    
    // Pass category and filtered documents to parent component
    onCategorySelect(category, filteredDocs);
  };
  
  // Convert categories object to array for rendering
  const documentCategories = Object.entries(categories).map(([title, data], index) => ({
    id: index + 1,
    title,
    count: data.count,
    icon: data.icon,
    color: data.color
  }));

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