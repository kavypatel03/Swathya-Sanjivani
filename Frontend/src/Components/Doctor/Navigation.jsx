import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

function Navigation() {
    const navigate = useNavigate();
    const navLinkClasses = ({ isActive }) =>
        isActive
            ? "border-b-2 border-[#0e606e] px-1 inline-flex items-center text-md font-medium text-[#0e606e]"
            : "border-b-2 border-transparent px-1 inline-flex items-center text-md font-medium text-gray-500 hover:text-gray-700";

    const handleLogout = () => {
        localStorage.clear();
        navigate('/DoctorLogin');
    };

    return (
        <nav className="bg-white shadow z-50 relative py-2 mb-1">
            <div className="mx-auto px-4">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <NavLink to="/" className="flex-shrink-0">
                            <img src={logo} alt="Swasthya Sanjivani" className="h-12" />
                        </NavLink>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="flex items-center">
                        <div className="flex space-x-4 lg:space-x-8">
                            <NavLink to="/Dashbord" className={navLinkClasses}>
                                Home
                            </NavLink>
                            <NavLink to="/Guide" className={navLinkClasses}>
                                Guide
                            </NavLink>
                        </div>
                    </div>

                    {/* Logout Button */}
                    <div className="flex items-center">
                        <button 
                            onClick={handleLogout}
                            className="text-[#0e606e] hover:text-[#0e606e] flex items-center text-l font-bold"
                        >
                            <i className="ri-logout-box-line mr-1"></i>
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Static Mobile Menu - Always Hidden on Desktop */}
            <div className="hidden">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    <NavLink to="/Dashbord" className={navLinkClasses}>
                        Home
                    </NavLink>
                    <NavLink to="/Guide" className={navLinkClasses}>
                        Guide
                    </NavLink>
                    <button 
                        onClick={handleLogout}
                        className="block px-3 py-2 rounded-md text-base font-bold text-[#0e606e] hover:text-[#0e606e] hover:bg-gray-50"
                    >
                        <i className="ri-logout-box-line mr-1"></i>
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Navigation;
