import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const PatientModification = () => {
  const [isMobileVerified, setisMobileVerified] = useState(true);
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState({
    fullname: "",
    mobile: "",
    email: "",
    password: "",
    birthDate: "",
    age: "",
    relation: "",
    gender: "Male",
  });

  // Convert YYYY-MM-DD to DD-MM-YYYY for display
  const formatToIndianDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB"); // DD-MM-YYYY format
  };

  const formatToISODate = (dateStr) => {
    if (!dateStr) return "";
    const [day, month, year] = dateStr.split("-");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/patient/get-patient-details",
          { withCredentials: true }
        );
        const data = response.data.data;

        const calculateAge = (dob) => {
          if (!dob) return "";
          const birthDate = new Date(dob);
          const today = new Date();
          let age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birthDate.getDate())
          ) {
            age--;
          }
          return age;
        };

        setPatientData({
          fullname: data.fullname || "",
          mobile: data.mobile || "",
          email: data.email || "",
          password: "••••••••••••",
          birthDate: data.dob
            ? new Date(data.dob).toISOString().split("T")[0]
            : "",
          age: calculateAge(data.dob),
          relation: data.relation || "",
          gender: data.gender || "Male",
        });
      } catch (error) {
        console.error("❌ Error fetching patient data:", error);
        alert("❌ Failed to load patient details.");
      }
    };

    fetchPatientData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "birthDate") {
      const calculateAge = (dob) => {
        if (!dob) return "";
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
          age--;
        }
        return age;
      };

      setPatientData({
        ...patientData,
        [name]: value,
        age: calculateAge(value),
      });
    } else {
      setPatientData({ ...patientData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedData = {
      ...patientData,
      dob: patientData.birthDate
        ? new Date(patientData.birthDate).toISOString()
        : null,
    };

    try {
      const response = await axios.put(
        "http://localhost:4000/patient/update-patient-details",
        updatedData,
        { withCredentials: true }
      );

      toast.success("Details updated successfully!", {
        position: "top-right",
        autoClose: 4000,
        theme: "colored",
      });

      setTimeout(() => {
        navigate("/PatientDashboard");
      }, 3500);
    } catch (error) {
      console.error("❌ Error updating patient data:", error);

      toast.error("❌ Failed to update details.", {
        position: "top-right",
        autoClose: 4000,
        theme: "colored",
      });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-[#0e606e] mb-4">
        Modify Family Member Details
      </h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block mb-2">
            Enter Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="fullname"
            className="w-full border border-gray-300 rounded p-2"
            value={patientData.fullname}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block mb-2">
            Enter Mobile Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="mobile"
            className="w-full border bg-slate-200 border-gray-300 rounded p-2"
            value={patientData.mobile}
            onChange={handleChange}
            disabled={isMobileVerified}
          />
        </div>

        <div>
          <label className="block mb-2">
            Enter E-mail Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            className="w-full border border-gray-300 rounded p-2"
            value={patientData.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block mb-2">
            Change Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            name="password"
            className="w-full border border-gray-300 rounded p-2"
            value={patientData.password}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block mb-2">
            Change Birth Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="birthDate"
            className="w-full border border-gray-300 rounded p-2"
            value={patientData.birthDate}
            onChange={handleChange}
          />
          <p className="text-sm text-gray-500 mt-1">
            Selected Date: {formatToIndianDate(patientData.birthDate)}
          </p>
        </div>

        <div>
          <label className="block mb-2">
            Change Age <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="age"
            className="w-full border bg-slate-200 border-gray-300 rounded p-2"
            value={patientData.age}
            readOnly
          />
        </div>

        <div>
          <label className="block mb-2">
            Select Relation With Main Person Of Family{" "}
            <span className="text-red-500">*</span>
          </label>
          <select
            name="relation"
            className="w-full border border-gray-300 rounded p-2"
            value={patientData.relation}
            onChange={handleChange}
          >
            <option value="">Select Relation</option>
            <option value="Self">Self</option>
            <option value="Father">Father</option>
            <option value="Mother">Mother</option>
            <option value="Brother">Brother</option>
            <option value="Sister">Sister</option>
          </select>
        </div>

        <div>
          <label className="block mb-2">
            Select Gender <span className="text-red-500">*</span>
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="Male"
                checked={patientData.gender === "Male"}
                onChange={handleChange}
              />
              <span className="ml-2">Male</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="Female"
                checked={patientData.gender === "Female"}
                onChange={handleChange}
              />
              <span className="ml-2">Female</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 rounded"
          >
            Clear
          </button>
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-[#0e606e] text-white rounded"
          >
            Save Changes
          </button>
        </div>
      </form>

      <ToastContainer />
    </div>
  );
};

export default PatientModification;
