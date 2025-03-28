import React from 'react';
import Logo from '../assets/logo.png'; // Ensure this path is correct
import { FaCircleUser, FaBars } from 'react-icons/fa6'; // Added FaBars for hamburger icon

const Navbar = ({ toggleSideMenu }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-20">
      <div className="flex items-center gap-4">
        <button
          className="text-2xl text-gray-700 md:hidden" // Visible only on mobile
          onClick={toggleSideMenu}
        >
          <FaBars />
        </button>
        <div className="text-2xl font-bold text-indigo-600 flex items-center gap-[20px]">
          <img src={Logo} className="h-10 w-10" alt="TechBuggy Logo" />
          <h1 className="text-3xl font-lg hidden md:block">TechBuggy</h1>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-md text-gray-700 font-semibold">Username</span>
        <div className="relative">
          <FaCircleUser className="text-xl" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;