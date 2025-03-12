import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/patient/dashboard",
          {
            withCredentials: true, // Ensures cookies are sent with the request
          }
        );

        if (response.data.success) {
          setUserData(response.data.data);
        } else {
          setError(response.data.message || "Failed to load user data.");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
<<<<<<< HEAD
        navigate("/patientLogin");
        alert("You Need to login first!")
=======
        setError("Error fetching data. Please try again.");
>>>>>>> aae954db8b90537076a5c8c56e3ff237bd26c5c4
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

<<<<<<< HEAD
  const handleLogout = async () => {
    try {
      // Call the logout endpoint to clear the cookie on the server
      await axios.get("http://localhost:4000/patient/logout", {
        withCredentials: true, // Ensures cookies are included in the request
      });
  
      // Redirect to login page after successful logout
      navigate("/patientLogin");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  
=======
  const handleLogout = () => {
    // You can add any logout logic here (clearing tokens, etc.)
    navigate("/patientLogin");
  };
>>>>>>> aae954db8b90537076a5c8c56e3ff237bd26c5c4

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-indigo-600 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-white text-xl font-bold">MedPortal</span>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="mr-4 px-3 py-1 rounded bg-white text-indigo-700 hover:bg-indigo-100 font-medium text-sm"
              >
                Logout
              </button>
              <div className="ml-3 relative">
                <div>
                  <button className="bg-indigo-700 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white">
                    <div className="h-8 w-8 rounded-full bg-indigo-300 flex items-center justify-center text-indigo-900 font-bold">
                      JD
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* User Details Section */}

      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">
              Patient Dashboard
            </h1>
          </div>
        </header>

        {/* Existing Dashboard Content */}
        <main>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white shadow rounded-lg p-6 sm:rounded-md mt-3 mt-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome, {userData?.fullname || "Guest"}
              </h1>
              <p className="text-gray-500">
                Your registered email is : <span className="font-bold">{userData?.email}</span>
              </p>
              <p className="text-gray-500">
                Your mobile number is : <span className="font-bold">{userData?.mobile}</span>
              </p>
            </div>

            {/* Dashboard Stats */}
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {/* Card 1 */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                      <svg
                        className="h-6 w-6 text-indigo-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Upcoming Appointments
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">
                            0
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <a
                      href="#"
                      className="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Book an appointment
                    </a>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                      <svg
                        className="h-6 w-6 text-indigo-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Medical Records
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">
                            0
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <a
                      href="#"
                      className="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      View all records
                    </a>
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                      <svg
                        className="h-6 w-6 text-indigo-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Prescriptions
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">
                            0
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <a
                      href="#"
                      className="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      View prescriptions
                    </a>
                  </div>
                </div>
              </div>

              {/* Card 4 */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                      <svg
                        className="h-6 w-6 text-indigo-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Upcoming Payments
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">
                            $0.00
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <a
                      href="#"
                      className="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      View billing history
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="mt-6">
              <h2 className="text-lg font-medium text-gray-900">
                Recent Activity
              </h2>
              <div className="bg-white shadow overflow-hidden sm:rounded-md mt-3">
                <ul className="divide-y divide-gray-200">
                  <li>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-indigo-600 truncate">
                          Account Created
                        </p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Completed
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            Registration successful
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <svg
                            className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <p>Today</p>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
