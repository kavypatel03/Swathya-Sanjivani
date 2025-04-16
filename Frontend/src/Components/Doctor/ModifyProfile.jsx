// ModifyProfile.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


const ModifyProfile = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    mobile: '',
    email: '',
    password: '',
    gender: '',
    mciRegistrationNumber: '',
    birthDate: '',
    age: '',
    hospitalName: '',
    assistantName: '',
    specialization: ''
  });

  useEffect(() => {
    const doctorId = localStorage.getItem('doctorId');
    const token = localStorage.getItem('token');
    if (!doctorId || !token) {
      toast.error("Authentication required");
      return;
    }

    fetch(`http://localhost:4000/doctor/doctor/${doctorId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include' // Important for cookies/sessions
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (data.success && data.data) {
          const doctorData = data.data;
          // Calculate age from birthDate (DOB)
          let age = '';
          if (doctorData.birthDate) {
            const dob = new Date(doctorData.birthDate);
            const diffMs = Date.now() - dob.getTime();
            const ageDt = new Date(diffMs);
            age = Math.abs(ageDt.getUTCFullYear() - 1970).toString();
          }
          setForm({
            fullName: doctorData.fullName || '',
            mobile: doctorData.mobile || '',
            email: doctorData.email || '',
            password: '', // Never prefill password for security
            gender: doctorData.gender || '',
            mciRegistrationNumber: doctorData.mciRegistrationNumber || '',
            birthDate: doctorData.birthDate ? doctorData.birthDate.slice(0, 10) : '',
            age: age,
            hospitalName: doctorData.hospitalName || '',
            // Use assistant's fullName if populated, else empty string
            assistantName: (doctorData.assistants && doctorData.assistants[0]?.fullName) || '',
            specialization: doctorData.specialization || ''
          });
        }
      })
      .catch(err => {
        console.error('Error fetching doctor data:', err);
        toast.error("Failed to load profile data");
      });
  }, []);

  const handleChange = e => {
    const { name, value, type } = e.target;
    // If birthDate changes, recalculate age
    if (name === "birthDate") {
      let age = '';
      if (value) {
        const dob = new Date(value);
        const diffMs = Date.now() - dob.getTime();
        const ageDt = new Date(diffMs);
        age = Math.abs(ageDt.getUTCFullYear() - 1970).toString();
      }
      setForm(prev => ({
        ...prev,
        birthDate: value,
        age: age
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: type === 'radio' ? value : value
      }));
    }
  };

  // In ModifyProfile.jsx, enhance error handling in the handleSubmit function:

  const handleSubmit = async (e) => {
    e.preventDefault();
    const doctorId = localStorage.getItem('doctorId');
    const token = localStorage.getItem('token');
    if (!doctorId || !token) {
      toast.error("Authentication required");
      return;
    }

    // Only send fields that match your schema
    const updateData = {
      fullName: form.fullName,
      specialization: form.specialization,
      hospitalName: form.hospitalName,
      gender: form.gender,
      mciRegistrationNumber: form.mciRegistrationNumber,
      birthDate: form.birthDate,
      email: form.email
    };

    // Only include password if changed
    if (form.password?.trim()) {
      updateData.password = form.password;
    }

    try {
      const response = await fetch(`http://localhost:4000/doctor/doctor/${doctorId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify(updateData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      if (data.success) {
        toast.success("Profile updated successfully", {
          onClose: () => {
            window.location.reload();
          }
        });
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error(`Update failed: ${err.message}`);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
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

      <h2 className="text-xl font-medium text-[#0e606e] mb-6">Modify Your Details</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border rounded">
          {/* Left Column */}
          <div className="space-y-4 border-r rounded p-6">
            <div>
              <label className="block mb-1">
                Enter Full Name <span className="text-red-500">*</span>
              </label>
              <div>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  className="border rounded p-2 w-full"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block mb-1">
                Enter Mobile Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                className="border rounded p-2 w-full"
                required
                readOnly
              />
            </div>
            <div>
              <label className="block mb-1">
                Enter E-mail Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="border rounded p-2 w-full"
                required
              />
            </div>
            <div>
              <label className="block mb-1">
                Enter New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Leave blank to keep current password"
                  className="border rounded p-2 w-full"
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`text-gray-500 ${showPassword ? "ri-eye-line" : "ri-eye-off-line"}`}></i>
                </button>
              </div>
            </div>
            <div>
              <label className="block mb-1">
                Select Gender <span className="text-red-500">*</span>
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    checked={form.gender === "Male"}
                    onChange={handleChange}
                    className="w-4 h-4 text-[#0e606e]"
                  />
                  <span className="ml-2">Male</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    checked={form.gender === "Female"}
                    onChange={handleChange}
                    className="w-4 h-4 text-[#0e606e]"
                  />
                  <span className="ml-2">Female</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="Other"
                    checked={form.gender === "Other"}
                    onChange={handleChange}
                    className="w-4 h-4 text-[#0e606e]"
                  />
                  <span className="ml-2">Other</span>
                </label>
              </div>
            </div>
          </div>
          {/* Right Column */}
          <div className="space-y-4 p-6">
            <div>
              <label className="block mb-1">
                Enter MCI Registration Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="mciRegistrationNumber"
                value={form.mciRegistrationNumber}
                onChange={handleChange}
                className="border rounded p-2 w-full"
                required
              />
            </div>
            <div>
              <label className="block mb-1">
                Enter Birth Date
              </label>
              <div>
                <input
                  type="date"
                  name="birthDate"
                  value={form.birthDate}
                  onChange={handleChange}
                  className="border rounded p-2 w-full"
                />
              </div>
            </div>
            <div>
              <label className="block mb-1">
                Enter Age
              </label>
              <input
                type="number"
                name="age"
                value={form.age}
                className="border rounded p-2 w-full"
                readOnly
                disabled
              />
            </div>
            <div>
              <label className="block mb-1">
                Specialization <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="specialization"
                value={form.specialization}
                onChange={handleChange}
                className="border rounded p-2 w-full"
                required
              />
            </div>
            <div>
              <label className="block mb-1">
                Select Hospital <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="hospitalName"
                  value={form.hospitalName}
                  onChange={handleChange}
                  className="border rounded p-2 w-full appearance-none"
                  required
                >
                  <option value={form.hospitalName}>{form.hospitalName || "Select Hospital"}</option>
                </select>
                <i className="ri-arrow-down-s-line absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
              </div>
            </div>
            <div>
              <label className="block mb-1">
                Your Assistant Name
              </label>
              <input
                type="text"
                name="assistantName"
                value={form.assistantName}
                onChange={handleChange}
                className="border rounded p-2 w-full"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-8 space-x-4">
          <button
            type="button"
            className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[#0e606e] text-white rounded hover:bg-[#0a4c57]"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default ModifyProfile;