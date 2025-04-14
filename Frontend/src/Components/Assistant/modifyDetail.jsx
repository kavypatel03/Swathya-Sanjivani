// ModifyDetails.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const ModifyDetails = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    password: '',
    gender: 'Male',
    post: '',
    birthDate: '',
    age: '',
    hospital: '',
    doctorName: ''
  });

  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [originalData, setOriginalData] = useState({});

  useEffect(() => {
    // In your fetchAssistantDetails function:
const fetchAssistantDetails = async () => {
  setFetchingData(true);
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:4000/assistant/dashboard', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.data.success) {
      const assistantData = response.data.data;

      // Format birthDate from database to YYYY-MM-DD format
      let isoBirthDate = '';
      let calculatedAge = '';
      if (assistantData.birthDate) {
        const date = new Date(assistantData.birthDate);
        isoBirthDate = date.toISOString().split('T')[0];
        // Calculate age
        const today = new Date();
        calculatedAge = today.getFullYear() - date.getFullYear();
        const monthDiff = today.getMonth() - date.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
          calculatedAge--;
        }
      }

      const dataToSet = {
        fullName: assistantData.fullName || '',
        mobile: assistantData.mobile || '',
        email: assistantData.email || '',
        password: '', // Don't pre-fill actual password
        gender: assistantData.gender || 'Male',
        post: assistantData.post || '',
        birthDate: isoBirthDate,
        age: calculatedAge || assistantData.age || '',
        hospital: assistantData.hospital || '',
        doctorName: assistantData.doctorName || ''
      };

      setFormData(dataToSet);
      setOriginalData(dataToSet);
    }
  } catch (error) {
    console.error('Error fetching assistant details:', error.response?.data || error.message);
    toast.error('Failed to load your profile details');
  } finally {
    setFetchingData(false);
  }
};

// In your handleSubmit function:
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  
  try {
    // Only send changed fields to minimize data transfer
    const changedData = {};
    for (const key in formData) {
      if (formData[key] !== originalData[key] && formData[key] !== '') {
        changedData[key] = formData[key];
      }
    }

    // Add assistantId from localStorage
    const assistantId = localStorage.getItem('assistantId');
    if (assistantId) {
      changedData.assistantId = assistantId;
    }

    // Don't send empty updates
    if (Object.keys(changedData).length === 0) {
      toast.info('No changes to save');
      setLoading(false);
      return;
    }
    
    const token = localStorage.getItem('token');
    const response = await axios.put(
      'http://localhost:4000/assistant/update-profile',
      changedData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    if (response.data.success) {
      toast.success('Profile updated successfully');
      setOriginalData({...formData});
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    const errorMessage = error.response?.data?.message || 'Failed to update profile';
    toast.error(errorMessage);
  } finally {
    setLoading(false);
  }
};

    fetchAssistantDetails();
  }, []);

  // Helper to convert "DD / MM / YYYY" to "YYYY-MM-DD"
  const toISODate = (str) => {
    if (!str) return '';
    const [day, month, year] = str.split(' / ');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  // Helper to convert "YYYY-MM-DD" to "DD / MM / YYYY"
  const toDisplayDate = (str) => {
    if (!str) return '';
    const [year, month, day] = str.split('-');
    return `${day.padStart(2, '0')} / ${month.padStart(2, '0')} / ${year}`;
  };

  // When birthDate changes, recalculate age
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (name === "birthDate") {
      // Calculate age from ISO date
      let age = '';
      if (value) {
        const dob = new Date(value);
        const today = new Date();
        age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
          age--;
        }
      }
      setFormData(prev => ({
        ...prev,
        birthDate: value,
        age: age
      }));
    } else if (type === 'radio') {
      setFormData(prev => ({ ...prev, [name]: value }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Only send changed fields to minimize data transfer
      const changedData = {};
      for (const key in formData) {
        if (formData[key] !== originalData[key] && formData[key] !== '') {
          // Special handling for birthDate - convert from "DD / MM / YYYY" to ISO date
          if (key === 'birthDate' && formData[key]) {
            const [day, month, year] = formData[key].split(' / ');
            changedData[key] = `${year}-${month}-${day}`;
          } else {
            changedData[key] = formData[key];
          }
        }
      }

      // Add assistantId from localStorage
      const assistantId = localStorage.getItem('assistantId');
      if (assistantId) {
        changedData.assistantId = assistantId;
      }

      // Don't send empty updates
      if (Object.keys(changedData).length === 0) {
        toast.info('No changes to save');
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('token'); // Get token from local storage
      const response = await axios.put(
        'http://localhost:4000/assistant/update-profile',
        changedData,
        { headers: { Authorization: `Bearer ${token}` } } // Pass token in headers
      );

      if (response.data.success) {
        toast.success('Profile updated successfully');

        // Update original data to reflect the new state
        setOriginalData({ ...formData });

        // Refresh the page data to ensure all displayed information is current
        if (changedData.email || changedData.mobile) {
          toast.info('Contact information updated. Some changes may require re-login to take effect.');
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original data
    setFormData({ ...originalData });
    toast.info('Changes discarded');
  };

  if (fetchingData) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0e606e]"></div>
        <span className="ml-2 text-gray-600">Loading your details...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold text-[#0e606e] mb-6">Modify Your Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div>
          <div className="mb-4">
            <label className="block mb-2">
              Enter Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">
              Enter Mobile Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
              disabled // Make mobile number not editable
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">
              Enter E-mail Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">
              Enter Password <span className="text-gray-500">(leave blank to keep current)</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Enter new password"
                minLength={6}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2"
                onClick={togglePasswordVisibility}
              >
                <i className={`ri-eye${showPassword ? '' : '-off'}-line text-gray-400`}></i>
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-2">
              Select Gender <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="male"
                  name="gender"
                  value="Male"
                  checked={formData.gender === "Male"}
                  onChange={handleChange}
                  className="w-4 h-4 accent-[#0e606e]"
                />
                <label htmlFor="male" className="ml-2">Male</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="female"
                  name="gender"
                  value="Female"
                  checked={formData.gender === "Female"}
                  onChange={handleChange}
                  className="w-4 h-4 accent-[#0e606e]"
                />
                <label htmlFor="female" className="ml-2">Female</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="other"
                  name="gender"
                  value="Other"
                  checked={formData.gender === "Other"}
                  onChange={handleChange}
                  className="w-4 h-4 accent-[#0e606e]"
                />
                <label htmlFor="other" className="ml-2">Other</label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div>
          <div className="mb-4">
            <label className="block mb-2">
              Select Your Post / Work <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="post"
                value={formData.post}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 appearance-none"
                required
              >
                <option value="">Select Post</option>
                <option value="Receptionist">Receptionist</option>
                <option value="Nurse">Nurse</option>
                <option value="Lab Technician">Lab Technician</option>
                <option value="Other">Other</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <i className="ri-arrow-down-s-line"></i>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-2">
              Enter Birth Date
            </label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              autoComplete="off"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">
              Enter Age
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              className="w-full border border-gray-300 rounded px-3 py-2"
              disabled
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">
              Select Hospital <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="hospital"
              value={formData.hospital}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">
              Enter Your Doctor Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="doctorName"
              value={formData.doctorName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-6 space-x-4">
        <button
          type="button"
          className="px-6 py-2 border border-gray-300 rounded text-gray-700"
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-[#0e606e] text-white rounded flex items-center"
          disabled={loading}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : "Save Changes"}
        </button>
      </div>
    </form>
  );
};

export default ModifyDetails;