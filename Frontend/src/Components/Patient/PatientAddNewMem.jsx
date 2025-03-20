import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';  // 🚨 Added `useNavigate` for redirection
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Toastify Styles

const PatientAddNewFamilyMember = () => {
  const { state } = useLocation();
  const navigate = useNavigate();  // 🚨 Navigation Hook
  const [formData, setFormData] = useState({
    fullName: '',
    birthDate: '',
    age: '',
    relation: '',
    gender: '',
  });

  // 🚀 Pre-fill data if editing
  useEffect(() => {
    if (state?.memberData) {
      const { fullName, birthDate, relationWithMainPerson, gender } = state.memberData;
  
      const birthDateObject = new Date(birthDate);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDateObject.getFullYear();
      
      const monthDiff = today.getMonth() - birthDateObject.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObject.getDate())) {
        calculatedAge--;
      }
  
      setFormData({
        fullName,
        birthDate: birthDate.split('T')[0],
        age: calculatedAge,
        relation: relationWithMainPerson,
        gender,
      });
    }
  }, [state]);

  // 📝 Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'birthDate') {
      const birthDate = new Date(value);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }

      setFormData({ ...formData, birthDate: value, age: calculatedAge });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // 🚀 Handle Form Submission (Add or Update Logic)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const apiUrl = state?.memberData
      ? `http://localhost:4000/patient/update-family-member/${state.memberData._id}`
      : 'http://localhost:4000/patient/add-family-member';

    const method = state?.memberData ? 'put' : 'post';

    try {
      const response = await axios[method](apiUrl, formData, { withCredentials: true });

      toast.success(response.data.message || 'Family member updated successfully!', {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        newestOnTop: true,
        closeOnClick: true,
        rtl: false,
        pauseOnFocusLoss: true,
        draggable: true,
        pauseOnHover: true,
        theme: "colored"
      });

      // ✅ Redirect to Home Page after 3.5 seconds
      setTimeout(() => {
        navigate('/PatientDashboard');
      }, 3500);

    } catch (error) {
      console.error('❌ Error adding/updating family member:', error.response?.data || error.message);

      toast.error('❌ Failed to update family member.', {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        newestOnTop: true,
        closeOnClick: true,
        rtl: false,
        pauseOnFocusLoss: true,
        draggable: true,
        pauseOnHover: true,
        theme: "colored"
      });
    }
  };

  return (
    <>
      <ToastContainer />

      <h2 className="text-2xl font-semibold text-[#0e606e] mb-6">
        {state?.memberData ? 'Edit Family Member' : 'Add New Family Member'}
      </h2>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Full Name */}
        <div className="space-y-2">
          <label className="block font-medium">
            Enter Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            className="border rounded-md p-2 w-full"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>

        {/* Birth Date */}
        <div className="space-y-2">
          <label className="block font-medium">
            Enter Birth Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="birthDate"
            className="border rounded-md p-2 w-full"
            value={formData.birthDate}
            onChange={handleChange}
            required
          />
        </div>

        {/* Age */}
        <div className="space-y-2">
          <label className="block font-medium">
            Enter Age <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="age"
            placeholder="Enter Only Numeric Value"
            className="border rounded-md p-2 w-full"
            value={formData.age}
            onChange={handleChange}
            required
            readOnly
          />
        </div>

        {/* Relation */}
        <div className="space-y-2">
          <label className="block font-medium">
            Select Relation With Main Person Of Family <span className="text-red-500">*</span>
          </label>
          <select
            name="relation"
            className="border rounded-md p-2 w-full"
            value={formData.relation}
            onChange={handleChange}
            required
          >
            <option value="">Select Relation</option>
            <option value="Self">Self</option>
            <option value="Wife">Wife</option>
            <option value="Husband">Husband</option>
            <option value="Son">Son</option>
            <option value="Daughter">Daughter</option>
            <option value="Father">Father</option>
            <option value="Mother">Mother</option>
          </select>
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <label className="block font-medium">
            Select Gender <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-6">
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="Male"
                checked={formData.gender === 'Male'}
                onChange={handleChange}
              />
              <span className="ml-2">Male</span>
            </label>

            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="Female"
                checked={formData.gender === 'Female'}
                onChange={handleChange}
              />
              <span className="ml-2">Female</span>
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="submit"
            className="bg-[#0e606e] text-white px-6 py-2 rounded-md flex items-center"
          >
            <i className="ri-user-add-line mr-2"></i>
            {state?.memberData ? 'Update Member' : 'Add New Member'}
          </button>
        </div>
      </form>
    </>
  );
};

export default PatientAddNewFamilyMember;
