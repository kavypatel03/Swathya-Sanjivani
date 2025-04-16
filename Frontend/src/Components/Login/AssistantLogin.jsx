import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AssistantLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    mobile: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Basic validation
    if (!formData.mobile && !formData.email) {
      toast.error('Please enter mobile number or email');
      setLoading(false);
      return;
    }

    if (!formData.password) {
      toast.error('Password is required');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/assistant/login', 
        {
          mobile: formData.mobile,
          email: formData.email,
          password: formData.password
        },
        {
          withCredentials: true // Important: This allows cookies to be sent and received
        }
      );

      if (response.data.success) {
        // Store token and assistantId in localStorage
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('assistantId', response.data.data.assistant._id);
        
        setTimeout(() => {
          navigate('/AssistantDashbord');
        }, 1000);
      } else {
        toast.error(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
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
      
      {/* Login Card */}
      <div className="bg-white rounded shadow p-6 w-full max-w-md mt-20">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        
        {/* User Type Buttons */}
        <div className="flex mb-6">
          <Link 
            to="/PatientLogin" 
            style={{ backgroundColor: "#0e606e" }} 
            className="text-white py-2 px-4 rounded text-center w-full mx-1 hover:bg-[#0b5058] transition-colors"
          >
            Patient
          </Link>
          <Link 
            to="/DoctorLogin" 
            style={{ backgroundColor: "#0e606e" }} 
            className="text-white py-2 px-4 rounded text-center w-full mx-1 hover:bg-[#0b5058] transition-colors"
          >
            Doctor
          </Link>
          <button 
            style={{ backgroundColor: "#ff9700" }} 
            className="text-white py-2 px-4 rounded w-full mx-1 cursor-default"
          >
            Assistant
          </button>
        </div>
        
        {/* Form Fields */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block">Enter Mobile Number</label>
            <input 
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="+91-94260-24009"
              className="w-full p-2 border rounded mt-1 focus:outline-none focus:ring-1 focus:ring-[#0e606e]" 
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block">Enter E-mail Address</label>
            <input 
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="assistant@example.com"
              className="w-full p-2 border rounded mt-1 focus:outline-none focus:ring-1 focus:ring-[#0e606e]" 
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block">Enter Password <span className="text-red-500">*</span></label>
            <input 
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter Your Password"
              className="w-full p-2 border rounded mt-1 focus:outline-none focus:ring-1 focus:ring-[#0e606e]" 
              required
            />
          </div>
          
          <div className="mb-6">
            <Link to="/ForgotPassword" className="text-blue-500 hover:text-blue-700">
              Forgot Password?
            </Link>
          </div>
          
          <button 
            type="submit" 
            style={{ backgroundColor: "#0e606e" }} 
            className="w-full text-white flex justify-center py-2 rounded hover:bg-[#0b5058] transition-colors disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AssistantLogin;