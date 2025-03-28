import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMdCloseCircleOutline } from "react-icons/io";

const SideMenu = ({ setActiveComponent, setIsSideMenuVisible,isVisible, toggleSideMenu }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate=useNavigate();
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', component: 'DASHBOARD' },
    { id: 'quizes', label: 'Quizes', component: 'QUIZES' }, // Adjusted for consistency
    { id: 'plans', label: 'Plans', component: 'PLANS' },
    { id: 'notifications', label: 'Notifications', component: 'NOTIFICATIONS' },
    { id: 'logout', label: 'Logout', component: 'DASHBOARD' },
  ];

  const handleMenuClick = (item) => {
    navigate(`/${item.id}`);
    setActiveTab(item.id);
    setActiveComponent(item.component); // Update the active component in Layout
    if (window.innerWidth < 768) toggleSideMenu(); // Close menu on mobile after selection
  };

  return (
    <aside
      className={`fixed z-[100] top-16 left-0 w-64 h-full  bg-white border-r border-gray-200 p-4 transition-all duration-300 ${
        isVisible ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 `}
    >
      <div className='text-2xl text-purple-600 flex w-full justify-end md:hidden' onClick={()=>{setIsSideMenuVisible(false)}} >      <IoMdCloseCircleOutline />
      </div>

      <ul className="space-y-1">
        {menuItems.map((item) => (
          <li
            key={item.id}
            onClick={() => handleMenuClick(item)}
            className={`px-4 py-3 text-lg rounded-lg cursor-pointer font-medium transition-all duration-200 ${
              activeTab === item.id
                ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-700'
            }`}
          >
            {item.label}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default SideMenu;