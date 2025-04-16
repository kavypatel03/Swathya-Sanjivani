import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import 'remixicon/fonts/remixicon.css';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AssistantRegistrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    post: '',
    doctorId: '',
    doctorName: '',
    hospital: '',
    email: '',
    mobile: '',
    password: '',
    otp: '',
    idCard: null,
  });

  const [firstFormSubmitted, setFirstFormSubmitted] = useState(false);
  const [mobileVerified, setMobileVerified] = useState(false);
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [uploadText, setUploadText] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [doctorsList, setDoctorsList] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);

  // Fetch doctors list on component mount
  React.useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoadingDoctors(true);
        const response = await axios.get('http://localhost:4000/assistant/doctors-list');
        if (response.data.success) {
          setDoctorsList(response.data.data);
        }
      } catch (error) {
        toast.error('Failed to load doctors list');
      } finally {
        setLoadingDoctors(false);
      }
    };
    
    fetchDoctors();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      // Check file size (5MB limit)
      if (file && file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }
      // Check file type
      if (file && !['image/jpeg', 'image/jpg', 'application/pdf'].includes(file.type)) {
        toast.error("Only JPG, JPEG and PDF files are allowed");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        idCard: file,
      }));
      setUploadText(file?.name || '');
    } else {
      // If doctor selection changed, update both doctorId and doctorName
      if (name === 'doctorId') {
        const selectedDoctor = doctorsList.find(doc => doc._id === value);
        setFormData(prev => ({
          ...prev,
          doctorId: value,
          doctorName: selectedDoctor ? selectedDoctor.fullName : ''
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: value,
        }));
      }
    }
  };

  const normalizeMobile = (mobile) => {
    if (!mobile) return "";
    let formatted = mobile.trim();
    if (formatted.startsWith('+')) return formatted;
    if (formatted.startsWith('91')) return `+${formatted}`;
    return `+91${formatted}`;
  };

  const handleSendOtp = async () => {
    if (!formData.mobile) {
      return toast.error("Please enter your mobile number");
    }
    
    setLoadingOtp(true);
    const formattedMobile = normalizeMobile(formData.mobile);
    
    try {
      const res = await axios.post('http://localhost:4000/assistant/send-otp', { 
        mobile: formattedMobile
      });

      if (res.data.success) {
        toast.success('OTP sent to your mobile.');
      } else {
        toast.error(res.data.message || 'Failed to send OTP');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    }
    setLoadingOtp(false);
  };

  const handleVerifyOtp = async () => {
    if (!formData.otp) {
      return toast.error("Please enter the OTP");
    }
    
    const formattedMobile = normalizeMobile(formData.mobile);
    
    try {
      const res = await axios.post('http://localhost:4000/assistant/verify-otp', {
        mobile: formattedMobile,
        otp: formData.otp.toString()
      });
      
      if (res.data.success) {
        setMobileVerified(true);
        toast.success('OTP verified successfully!');
      } else {
        toast.error(res.data?.message || "OTP verification failed.");
      }
    } catch (err) {
      toast.error("Error verifying OTP.");
    }
  };

  const handleFirstFormSubmit = (e) => {
    e.preventDefault();
    
    // Validate first form
    if (!formData.fullName) return toast.error("Full name is required");
    if (!formData.post) return toast.error("Post/work is required");
    if (!formData.doctorId) return toast.error("Doctor selection is required");
    if (!formData.hospital) return toast.error("Hospital name is required");
    if (!formData.idCard) return toast.error("ID card document is required");
    
    setFirstFormSubmitted(true);
    toast.success('Personal information saved. Please complete contact details.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstFormSubmitted) {
      return toast.error('Please submit personal information first');
    }
    
    if (!mobileVerified) {
      return toast.error('Please verify your mobile number first');
    }

    // Validate password
    if (!formData.password) {
      return toast.error('Password is required');
    }

    // Validate email
    if (!formData.email) {
      return toast.error('Email is required');
    }

    const formDataToSend = new FormData();
    formDataToSend.append('fullName', formData.fullName);
    formDataToSend.append('post', formData.post);
    formDataToSend.append('doctorId', formData.doctorId);
    formDataToSend.append('doctorName', formData.doctorName);
    formDataToSend.append('hospital', formData.hospital);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('mobile', normalizeMobile(formData.mobile));
    formDataToSend.append('password', formData.password);
    
    if (formData.idCard) {
      formDataToSend.append('idCard', formData.idCard);
    }

    try {
      const res = await axios.post(
        'http://localhost:4000/assistant/register', 
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      if (res.data.success) {
        toast.success('Registration Successful');
        setTimeout(() => {
          navigate("/AssistantLogin");
        }, 3000);
      } else {
        toast.error(res.data.message || 'Registration failed');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="h-full bg-gray-100 flex items-center justify-center pt-24 mt-6">
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
      
      <div className="bg-white rounded-lg shadow-lg w-full max-w-5xl overflow-hidden mb-8">
        {/* Header and Tabs */}
        <div className="text-center m-4">
          <h2 className="text-2xl font-bold text-gray-800">Register / Sign Up</h2>
        </div>
        <div className="flex justify-center">
          <div className="flex gap-4 w-[28rem]">
            <Link to="/PatientRegistration" className="flex-1 bg-[#0e606e] hover:bg-[#0b5058] text-white py-2 text-sm rounded-md font-medium text-center">
              Patient
            </Link>
            <Link to="/DoctorRegistration" className="flex-1 bg-[#0e606e] hover:bg-[#0b5058] text-white py-2 text-sm rounded-md font-medium text-center">
              Doctor
            </Link>
            <button type="button" className="flex-1 bg-[#ff9700] text-white py-2 text-sm rounded-md font-medium text-center">
              Assistant
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row m-2">
          {/* Left - Personal Information */}
          <div className="w-full md:w-1/2 p-6 border-r border-gray-200">
            <form onSubmit={handleFirstFormSubmit}>
              <h2 className="text-xl font-semibold text-[#0e606e] mb-6">Personal Information</h2>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Full Name <span className="text-red-500">*</span></label>
                <input 
                  name="fullName" 
                  value={formData.fullName} 
                  onChange={handleChange} 
                  type="text" 
                  placeholder="Enter Your Full Name"
                  className="w-full p-1 border rounded" 
                  disabled={firstFormSubmitted}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Select Your Post/Work <span className="text-red-500">*</span></label>
                <select
                  name="post"
                  className="w-full border border-gray-300 p-1 rounded text-sm"
                  value={formData.post}
                  onChange={handleChange}
                  required
                  disabled={firstFormSubmitted}
                >
                  <option value="">Select your post/work</option>
                  <option value="Receptionist">Receptionist</option>
                  <option value="Nurse">Nurse</option>
                  <option value="Lab Technician">Lab Technician</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Select The Doctor <span className="text-red-500">*</span></label>
                <select
                  name="doctorId"
                  className="w-full border border-gray-300 p-1 rounded text-sm"
                  value={formData.doctorId}
                  onChange={handleChange}
                  required
                  disabled={firstFormSubmitted || loadingDoctors}
                >
                  <option value="">Select doctor you're working with</option>
                  {doctorsList.map((doctor) => (
                    <option key={doctor._id} value={doctor._id}>
                      {doctor.fullName} ({doctor.hospitalName})
                    </option>
                  ))}
                </select>
                {loadingDoctors && <p className="text-xs text-gray-500">Loading doctors...</p>}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Hospital Name <span className="text-red-500">*</span></label>
                <input 
                  name="hospital" 
                  value={formData.hospital} 
                  onChange={handleChange} 
                  type="text" 
                  placeholder="Hospital Name"
                  className="w-full p-1 border rounded" 
                  disabled={firstFormSubmitted}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Upload Your Medical ID Card <span className="text-red-500">*</span></label>
                <div className="flex">
                  <input 
                    type="text" 
                    value={uploadText} 
                    placeholder="Format: JPG, JPEG, PDF (5MB)" 
                    readOnly
                    className="flex-grow p-1 border rounded-l" 
                  />
                  <label 
                    htmlFor="fileUpload" 
                    className={`cursor-pointer px-4 py-1 rounded-r ${firstFormSubmitted 
                      ? "bg-gray-400 cursor-not-allowed" 
                      : "bg-[#0e606e] text-white"}`}
                  >
                    Upload
                  </label>
                  <input 
                    name="idCard" 
                    id="fileUpload" 
                    type="file" 
                    onChange={handleChange} 
                    className="hidden" 
                    disabled={firstFormSubmitted}
                  />
                </div>
              </div>

              <div className="mt-7 mb-0">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2 h-4 w-4" required />
                  <span className="text-sm">I agree to the Terms & Conditions</span>
                </label>
                <p className="text-xs text-gray-600 mt-1">
                  By uploading your documents, you confirm that the information provided is accurate and genuine.
                  <a href="#" className="text-blue-500 ml-1">Read More</a>
                </p>
              </div>

              <button 
                type="submit" 
                className={`w-[28rem] py-1 mt-7 rounded-md font-medium text-sm ${
                  firstFormSubmitted 
                    ? "bg-gray-400 cursor-not-allowed" 
                    : "bg-[#0e606e] text-white hover:bg-[#0b5058]"
                }`}
                disabled={firstFormSubmitted}
              >
                {firstFormSubmitted ? "Details Submitted ✓" : "Submit Details"}
              </button>
            </form>
          </div>

          {/* Right - Contact Details */}
          <div className="w-full md:w-1/2 p-6">
            <form onSubmit={handleSubmit}>
              <h2 className="text-xl font-semibold text-[#0e606e] mb-5">Contact Details</h2>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Enter Your Full Name</label>
                <input 
                  value={formData.fullName} 
                  readOnly 
                  type="text" 
                  className="w-full p-1 border rounded bg-gray-100" 
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Mobile Number <span className="text-red-500">*</span></label>
                <div className="flex">
                  <input 
                    name="mobile" 
                    value={formData.mobile} 
                    onChange={handleChange} 
                    placeholder="+91-90000-99000"
                    className="flex-grow p-1 border rounded-l" 
                    disabled={!firstFormSubmitted || mobileVerified}
                    required
                  />
                  <button 
                    type="button" 
                    onClick={handleSendOtp} 
                    disabled={!firstFormSubmitted || loadingOtp || mobileVerified}
                    className={`bg-[#0e606e] hover:bg-[#0b5058] text-white px-2 py-1 text-sm rounded-r w-24 ${
                      !firstFormSubmitted || mobileVerified 
                        ? "bg-[#0e606e] cursor-not-allowed" 
                        : "bg-[#0e606e] text-white hover:bg-[#0b5058]"
                    }`}
                  >
                    {loadingOtp ? 'Sending...' : mobileVerified ? 'Verified ✓' : 'Send OTP'}
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Enter OTP <span className="text-red-500">*</span></label>
                <div className="flex">
                  <input 
                    name="otp" 
                    value={formData.otp} 
                    onChange={handleChange} 
                    placeholder="Enter 6-digit OTP"
                    className="flex-grow p-1 border rounded-l" 
                    disabled={!firstFormSubmitted || mobileVerified}
                    required
                  />
                  <button 
                    type="button" 
                    onClick={handleVerifyOtp}
                    disabled={!firstFormSubmitted || mobileVerified}
                    className={`bg-[#0e606e] hover:bg-[#0b5058] text-white px-2 py-1 text-sm rounded-r w-24 ${
                      !firstFormSubmitted || mobileVerified 
                        ? "bg-[#0e606e] cursor-not-allowed" 
                        : "bg-[#0e606e] text-white hover:bg-[#0b5058]"
                    }`}
                  >
                    {mobileVerified ? 'Verified ✓' : 'Verify OTP'}
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Email Address <span className="text-red-500">*</span></label>
                <input 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  type="email" 
                  placeholder="assistant@example.com"
                  className="w-full p-1 border rounded" 
                  disabled={!firstFormSubmitted}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Create Password <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input 
                    name="password" 
                    value={formData.password} 
                    onChange={handleChange} 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••"
                    className="w-full p-1 border rounded pr-10" 
                    disabled={!firstFormSubmitted}
                    required
                  />
                  <div 
                    className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i className={showPassword ? "ri-eye-off-line text-gray-500" : "ri-eye-line text-gray-500"}></i>
                  </div>
                </div>
                
              </div>

              <div className="mb-8 mt-9">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2 h-4 w-4" required />
                  <span className="text-sm">I agree to the Terms & Conditions</span>
                </label>
                <p className="text-xs text-gray-600 mt-1">
                  By registering, you agree to securely manage your credentials.
                  <a href="#" className="text-blue-500 ml-1">Read More</a>
                </p>
              </div>

              <button 
                type="submit" 
                className={`w-full py-1 rounded-md font-medium text-sm ${
                  !firstFormSubmitted || !mobileVerified
                    ? "bg-gray-400 cursor-not-allowed" 
                    : "bg-[#0e606e] text-white hover:bg-[#0b5058]"
                }`}
                disabled={!firstFormSubmitted || !mobileVerified}
              >
                Register/Sign Up
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistantRegistrationForm;