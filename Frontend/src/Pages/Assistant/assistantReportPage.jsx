import React, { useState, useEffect } from 'react';
import Navigation from '../../Components/Assistant/AssistantNav';
import UserProfile from '../../Components/Assistant/userProfile';
import PatientPrescription from '../../Components/Assistant/patientPrescription';
import DocumentManager from '../../Components/Assistant/reportManager';
import axios from 'axios';

const AssistantReportsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All Documents');
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDocuments = async (category = 'All Documents') => {
    try {
      setLoading(true);
      const patientId = localStorage.getItem('selectedPatientId');
      const familyId = localStorage.getItem('selectedFamilyMemberId');
      
      if (patientId && familyId) {
        const response = await axios.get(
          `http://localhost:4000/assistant/patient-documents/${patientId}/${familyId}`,
          { withCredentials: true }
        );
  
        if (response.data.success) {
          let filteredDocs = response.data.data;
          
          if (category !== 'All Documents') {
            filteredDocs = filteredDocs.filter(doc => {
              const docType = doc.documentType.trim().toLowerCase();
              // Normalize the category by removing trailing 's' to handle singular/plural mismatch
              const normalizedCategory = category.toLowerCase().replace(/s$/,'');
              
              if (category === 'Others') {
                return !['prescription', 'lab report', 'x-ray'].includes(docType);
              }
              // Use includes() instead of exact matching
              return docType.includes(normalizedCategory);
            });
          }
  
          setDocuments(filteredDocs);
        }
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    fetchDocuments(category);
  };

  const handleViewDocument = (document) => {
    // Implement view document logic
    console.log('View document:', document);
    // You can open a modal or new window to view the document
  };

  const handleDownloadDocument = (document) => {
    // Implement download document logic
    window.open(`http://localhost:4000/assistant/download-document/${document._id}`, '_blank');
  };

  const handleDeleteDocument = async (documentId) => {
    try {
      if (window.confirm('Are you sure you want to delete this document?')) {
        await axios.delete(
          `http://localhost:4000/assistant/delete-document/${documentId}`,
          { withCredentials: true }
        );
        fetchDocuments(selectedCategory); // Refresh the documents list
      }
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return (
    <div className="min-h-screen bg-gray-200">
      <Navigation />
      <div className="container mx-auto px-4 py-6">
        <UserProfile />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <PatientPrescription 
              category={selectedCategory}
              documents={documents}
              onBack={() => setSelectedCategory('All Documents')}
              onView={handleViewDocument}
              onDownload={handleDownloadDocument}
              onDelete={handleDeleteDocument}
              loading={loading}
            />
          </div>
          <div>
            <DocumentManager onCategorySelect={handleCategorySelect} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistantReportsPage;