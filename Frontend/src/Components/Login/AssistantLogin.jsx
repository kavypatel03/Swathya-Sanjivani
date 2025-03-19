import React from 'react';
import { Link } from 'react-router-dom';

function Login() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">

      {/* Login Card */}
      <div className="bg-white rounded shadow p-6 w-full max-w-md mt-20">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        
        {/* User Type Buttons */}
        <div className="flex mb-6">
          <Link to={"/PatientLogin"} style={{ backgroundColor: "#0e606e" }} className="text-white py-2 px-4 rounded text-center w-full mx-1">Patient</Link>
          <Link to={"/DoctorLogin"} style={{ backgroundColor: "#0e606e" }} className="text-white py-2 px-4 rounded text-center w-full mx-1">Doctor</Link>
          <button style={{ backgroundColor: "#ff9700" }} className="text-white py-2 px-4 rounded w-full mx-1">Assistant</button>
        </div>
        
        {/* Form Fields */}
        <div className="mb-4">
          <label>Enter Mobile Number <span className="text-red-500">*</span></label>
          <input 
            type="tel"
            placeholder="+91-94260-24009"
            className="w-full p-2 border rounded mt-1" 
          />
        </div>
        
        <div className="mb-4">
          <label>Enter E-mail Address <span className="text-red-500">*</span></label>
          <input 
            type="email"
            placeholder="Mahesh123@gmail.com"
            className="w-full p-2 border rounded mt-1" 
          />
        </div>
        
        <div className="mb-4">
          <label>Enter Password <span className="text-red-500">*</span></label>
          <input 
            type="password"
            placeholder="Enter Your Created Password"
            className="w-full p-2 border rounded mt-1" 
          />
        </div>
        
        <div className="mb-6">
          <a href="#" className="text-blue-500">Forgot Password?</a>
        </div>
        
        <Link to={'/AssistantDashbord'} style={{ backgroundColor: "#0e606e" }} className="w-full text-white flex justify-center py-2 rounded">Login</Link>
      </div>
    </div>
  );
}

export default Login;