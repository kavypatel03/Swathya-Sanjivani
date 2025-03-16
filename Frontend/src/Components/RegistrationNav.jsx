import React from 'react'
import logo from "../assets/logo.png";
import { RiLoginBoxLine } from '@remixicon/react'
import { Link } from 'react-router-dom'

const Navbar = () => (
    <nav className="w-full bg-white shadow-md py-2 px-6 flex items-center justify-between absolute top-0">
        <div className="flex items-center">
            <Link to="/">
                <img src={logo} alt="Swasthya Sanjivani" className="h-15" />
            </Link>
        </div>
        <Link to="/PatientLogin" className="text-[#0e606e] hover:underline text-md font-bold flex items-center">
            <RiLoginBoxLine
            size={24}
            color="currentColor"
            className="mr-1"
            />
            Login</Link>
    </nav>
);

function Nav() {
    return (
        <div>
            <Navbar/>
        </div>
    )
}

export default Nav