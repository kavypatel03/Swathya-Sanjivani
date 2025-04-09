import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // ✅ Normalize Mobile Number
  const normalizeMobile = (mobile) => {
    if (!mobile) return "";
    return `+91${mobile.replace(/^\+?91/, "").trim()}`;
  };
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formattedMobile = normalizeMobile(mobile);
  
    try {
      const response = await fetch("http://localhost:4000/doctor/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important for cookies
        body: JSON.stringify({ 
          mobile: formattedMobile, 
          email, 
          password 
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }
  
      // Store token and redirect
      localStorage.setItem("token", data.data.token);
      toast.success("✅ Login successful!");
      navigate("/Dashbord"); // Fixed typo in route
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <div className="bg-white rounded shadow p-6 w-full max-w-md mt-20">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        <div className="flex mb-6">
          <Link to={"/PatientLogin"} style={{ backgroundColor: "#0e606e" }} className="text-white py-2 px-4 rounded text-center w-full mx-1">Patient</Link>
          <button style={{ backgroundColor: "#ff9700" }} className="text-white py-2 px-4 rounded w-full mx-1">Doctor</button>
          <Link to={"/AssistantLogin"} style={{ backgroundColor: "#0e606e" }} className="text-white py-2 px-4  text-center rounded w-full mx-1">Assistant</Link>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label>Enter Mobile Number <span className="text-red-500">*</span></label>
            <input 
              type="tel"
              placeholder="+91-94260-24009"
              className="w-full p-2 border rounded mt-1" 
              onChange={(e) => setMobile(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label>Enter E-mail Address <span className="text-red-500">*</span></label>
            <input 
              type="email"
              placeholder="Mahesh123@gmail.com"
              className="w-full p-2 border rounded mt-1" 
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label>Enter Password <span className="text-red-500">*</span></label>
            <input 
              type="password"
              placeholder="Enter Your Created Password"
              className="w-full p-2 border rounded mt-1" 
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <a href="#" className="text-blue-500">Forgot Password?</a>
          </div>

          <button
            type="submit"
            style={{ backgroundColor: "#0e606e" }}
            className="w-full flex justify-center text-white py-2 rounded"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
