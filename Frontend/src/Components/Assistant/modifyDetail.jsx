import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    const fetchAssistantDetails = async () => {
      setFetchingData(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:4000/assistant/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          const assistantData = response.data.data;

          let isoBirthDate = '';
          let calculatedAge = '';
          if (assistantData.birthDate) {
            const date = new Date(assistantData.birthDate);
            const isoBirthDate = rawDate.split('T')[0];

            const dob = new Date(isoBirthDate);
            const today = new Date();
            let calculatedAge = today.getFullYear() - dob.getFullYear();
            const monthDiff = today.getMonth() - dob.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
              calculatedAge--;
            }
          }

          const dataToSet = {
            fullName: assistantData.fullName || '',
            mobile: assistantData.mobile || '',
            email: assistantData.email || '',
            password: '',
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

    fetchAssistantDetails();
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (name === "birthDate") {
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
      const changedData = {};
      for (const key in formData) {
        if (formData[key] !== originalData[key] && formData[key] !== '') {
          changedData[key] = formData[key];
        }
      }

      const assistantId = localStorage.getItem('assistantId');
      if (assistantId) {
        changedData.assistantId = assistantId;
      }

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
        toast.success('Profile updated successfully', {
          onClose: () => {
            window.location.reload();
          }
        });

        setOriginalData({ ...formData });

        if (changedData.email || changedData.mobile) {
          toast.info('Contact info updated. Some changes may require re-login.');
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
    <>
      <form onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold text-[#0e606e] mb-6">Modify Your Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div>
            {/* Full Name */}
            <div className="mb-4">
              <label className="block mb-2">Enter Full Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>

            {/* Mobile */}
            <div className="mb-4">
              <label className="block mb-2">Enter Mobile Number <span className="text-red-500">*</span></label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
                disabled
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block mb-2">Enter E-mail Address <span className="text-red-500">*</span></label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="block mb-2">Enter Password <span className="text-gray-500">(leave blank to keep current)</span></label>
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

            {/* Gender */}
            <div className="mb-4">
              <label className="block mb-2">Select Gender <span className="text-red-500">*</span></label>
              <div className="flex items-center space-x-6">
                {['Male', 'Female', 'Other'].map(g => (
                  <label key={g} className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      checked={formData.gender === g}
                      onChange={handleChange}
                      className="w-4 h-4 accent-[#0e606e]"
                    />
                    <span className="ml-2">{g}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div>
            {/* Post */}
            <div className="mb-4">
              <label className="block mb-2">Select Your Post / Work <span className="text-red-500">*</span></label>
              <select
                name="post"
                value={formData.post}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              >
                <option value="">Select Post</option>
                <option value="Receptionist">Receptionist</option>
                <option value="Nurse">Nurse</option>
                <option value="Lab Technician">Lab Technician</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Birth Date */}
            <div className="mb-4">
              <label className="block mb-2">Enter Birth Date</label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            {/* Age */}
            <div className="mb-4">
              <label className="block mb-2">Enter Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                className="w-full border border-gray-300 rounded px-3 py-2"
                disabled
              />
            </div>

            {/* Hospital */}
            <div className="mb-4">
              <label className="block mb-2">Select Hospital <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="hospital"
                value={formData.hospital}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>

            {/* Doctor Name */}
            <div className="mb-4">
              <label className="block mb-2">Enter Your Doctor Name <span className="text-red-500">*</span></label>
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

        {/* Buttons */}
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

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
};

export default ModifyDetails;
