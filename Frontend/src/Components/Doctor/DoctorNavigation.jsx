import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png"

function Navigation() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation(); // Get current route

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Function to check if the link is active
    const isActive = (path) => location.pathname === path ? "border-[#0e606e] text-[#0e606e]" : "border-transparent text-gray-500 hover:text-gray-700";

    return (
        <nav className="bg-white shadow z-50 relative py-2">
            <div className="mx-auto px-4">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0">
                            <img src={logo} alt="Swasthya Sanjivani" className="h-15" />
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="flex items-center">
                        <div className="flex space-x-4 lg:space-x-8">
                            <Link to="/DoctorDashbord" className={`border-b-2 px-1 inline-flex items-center text-md font-medium ${isActive("/DoctorDashbord")}`}>
                                Home
                            </Link>
                            <Link to="/patientFamily" className={`border-b-2 px-1 inline-flex items-center text-md font-medium ${isActive("/patientFamily")}`}>
                                Family
                            </Link>
                            <Link to="/PatientDoctorPage" className={`border-b-2 px-1 inline-flex items-center text-md font-medium ${isActive("/PatientDoctorPage")}`}>
                                Doctor
                            </Link>
                            <Link to="/DoctorGuide" className={`border-b-2 px-1 inline-flex items-center text-md font-medium ${isActive("/DoctorGuide")}`}>
                                Guide
                            </Link>
                        </div>
                    </div>

                    {/* Logout Button */}
                    <div className="flex items-center">
                        <a href="/PatientLogin" className="text-[#0e606e] hover:text-[#0e606e] flex items-center text-l font-bold">
                            <i className="ri-logout-box-line mr-1"></i>
                            Logout
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button 
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-[#0e606e] hover:text-[#0e606e] hover:bg-gray-100 focus:outline-none"
                        >
                            <span className="sr-only">Open main menu</span>
                            {!isMenuOpen ? (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            ) : (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link to="/DoctorDashboard" className={`block px-3 py-2 rounded-md text-base font-medium ${isActive("/DoctorDashbord")} hover:bg-gray-50`}>
                            Home
                        </Link>
                        <Link to="/patientFamilyPage" className={`block px-3 py-2 rounded-md text-base font-medium ${isActive("/patientFamilyPage")} hover:bg-gray-50`}>
                            Family
                        </Link>
                        <Link to="/DoctorPage" className={`block px-3 py-2 rounded-md text-base font-medium ${isActive("/DoctorPage")} hover:bg-gray-50`}>
                            Doctor
                        </Link>
                        <Link to="/DoctorGuide" className={`block px-3 py-2 rounded-md text-base font-medium ${isActive("/DoctorGuide")} hover:bg-gray-50`}>
                            Guide
                        </Link>
                        <Link to="/PatientLogin" className="block px-3 py-2 rounded-md text-base font-Bold text-[#0e606e] hover:text-[#0e606e] hover:bg-gray-50">
                            <i className="ri-logout-box-line mr-1"></i>
                            Logout
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navigation;
