import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

function Navigation() {
    return (
        <nav className="bg-white shadow z-50 relative py-2 mb-1 ">
            <div className="mx-auto px-4">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0">
                            <img src={logo} alt="Swasthya Sanjivani" className="h-12" />
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="flex items-center">
                        <div className="flex space-x-4 lg:space-x-8">
                            <Link to="/Dashbord" className="border-b-2 border-[#0e606e] px-1 inline-flex items-center text-md font-medium text-[#0e606e]">
                                Home
                            </Link>
                            <Link to="/" className="border-b-2 border-transparent px-1 inline-flex items-center text-md font-medium text-gray-500 hover:text-gray-700">
                                Guide
                            </Link>
                        </div>
                    </div>

                    {/* Logout Button */}
                    <div className="flex items-center">
                        <Link to="/PatientLogin" className="text-[#0e606e] hover:text-[#0e606e] flex items-center text-l font-bold">
                            <i className="ri-logout-box-line mr-1"></i>
                            Logout
                        </Link>
                    </div>
                </div>
            </div>

            {/* Static Mobile Menu - Always Hidden on Desktop */}
            <div className="hidden">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-[#0e606e] hover:bg-gray-50">
                        Home
                    </Link>
                    <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50">
                        Family
                    </Link>
                    <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50">
                        Doctor
                    </Link>
                    <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50">
                        Guide
                    </Link>
                    <Link to="/PatientLogin" className="block px-3 py-2 rounded-md text-base font-Bold text-[#0e606e] hover:text-[#0e606e] hover:bg-gray-50">
                        <i className="ri-logout-box-line mr-1"></i>
                        Logout
                    </Link>
                </div>
            </div>
        </nav>
    );
}

export default Navigation;