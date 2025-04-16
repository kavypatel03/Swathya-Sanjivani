import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toast CSS

function Login() {

  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const normalizeMobile = (mobile) => {
    if (!mobile) return "";
    let formatted = mobile.trim();
    if (formatted.startsWith("+")) return formatted;
    if (formatted.startsWith("91")) return `+${formatted}`;
    return `+91${formatted}`;
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:4000/patient/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ mobile, email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store the token correctly
        const token = data.data.token;
        const patientId = data.data.patient._id;
  
        
        localStorage.setItem("token", token);
        localStorage.setItem("patientId", patientId);
        
        document.cookie = `token=${token}; path=/; SameSite=Strict`;
        toast.success("✅ Login successful!");
        navigate("/PatientDashboard");
      } else {
        toast.error(data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to connect to the server");
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
          <button
            style={{ backgroundColor: "#ff9700" }}
            className="text-white py-2 px-4 rounded w-full mx-1"
          >
            Patient
          </button>
          <Link
            to={"/DoctorLogin"}
            style={{ backgroundColor: "#0e606e" }}
            className="text-white py-2 px-4 rounded text-center w-full mx-1"
          >
            Doctor
          </Link>
          <Link
            to={"/AssistantLogin"}
            style={{ backgroundColor: "#0e606e" }}
            className="text-white py-2 px-4 rounded text-center w-full mx-1"
          >
            Assistant
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label>
              Enter Mobile Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="mobile"
              placeholder="+91-94260-24009"
              className="w-full p-2 border rounded mt-1"
              onChange={(e) => setMobile(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label>
              Enter E-mail Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="Mahesh123@gmail.com"
              className="w-full p-2 border rounded mt-1"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label>
              Enter Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter Your Created Password"
              className="w-full p-2 border rounded mt-1"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <a href="#" className="text-blue-500">
              Forgot Password?
            </a>
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