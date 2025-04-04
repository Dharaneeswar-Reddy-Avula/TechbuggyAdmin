import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { toast } from "react-hot-toast";
import { FaUsers } from "react-icons/fa";
import { RiAlertFill } from "react-icons/ri";
import logo from "../assets/logo.png";
import { FaPlus } from "react-icons/fa";
import AdminRegister from "../pages/registerPage/Register";
import { logout } from "../store/authSlice";
import {
  MdSpaceDashboard,
  MdNotificationsActive,
  MdAdminPanelSettings,
  MdLogout,
  MdPerson,
  MdMenu,
} from "react-icons/md";
import { LuNotebookPen } from "react-icons/lu";
import { FaPersonBreastfeeding } from "react-icons/fa6";
import { IoAlertCircle } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";

const Breadcrumb = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);
  
  return (
    <nav className="breadcrumb mt-4 mb-6">
      <ul className="flex items-center text-sm text-gray-500 space-x-2">
        {pathSegments.map((segment, index) => {
          const path = `/${pathSegments.slice(0, index + 1).join("/")}`;
          const isLast = index === pathSegments.length - 1;

          return (
            <li key={index} className="flex items-center space-x-2">
              {index > 0 && <span className="text-gray-400">/</span>}
              {isLast ? (
                <span className="text-lg font-semibold text-blue-600 capitalize">
                  {segment}
                </span>
              ) : (
                <Link
                  to={path}
                  className="hover:text-blue-600 text-lg font-semibold capitalize"
                >
                  {segment}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const dispatch=useDispatch();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dropdownRef = useRef(null);
  const admin=useSelector((state)=>state.auth)

  const sidebarItems = [
    { label: "Dashboard", path: "dashboard", icon: MdSpaceDashboard },
    { label: "Notifications", path: "notifications", icon: RiAlertFill },
   
    { label: "Users", path: "users", icon: FaUsers },
    { label: "Quizes", path: "quizes", icon: IoAlertCircle },

    { label: "Complaints", path: "complaint", icon: LuNotebookPen },
    { label: "Subscriptions", path: "subscription", icon: IoAlertCircle },
  ];

  const isActive = (path) => location.pathname.includes(path);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logout successful");
    navigate("/");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <div><ToastContainer position="top-center"/></div>
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed md:relative md:translate-x-0 z-30 w-64 h-full bg-white border-r transition-transform duration-300 ease-in-out`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 ">
            <Link
              to="/"
              className="flex text-2xl items-center gap-2 font-bold text-blue-600"
            >
              <img src={logo} className="w-[50px] h-[50px]" />
              <span class="font">TechBuggy</span>
            </Link>
          </div>
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {sidebarItems.map((item, index) => (
              <Link
                key={index}
                to={`/${item.path}`}
                className={`flex items-center px-4 py-3 text-gray-700 hover:bg-blue-100 hover:text-blue-600 rounded-lg transition-colors duration-200 ${
                  isActive(item.path) ? "bg-blue-100 text-blue-600" : ""
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center px-4 py-2 text-red-700 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors duration-200"
            >
              <MdLogout className="w-5 h-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border shadow-sm z-20">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex md:justify-end  justify-between items-center">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-gray-500 hover:text-gray-600 focus:outline-none md:hidden"
            >
              <MdMenu className="w-6 h-6" />
            </button>
            <button
                onClick={() => setIsModalOpen(true)}
                className="bg-[#2664eb] mx-6 flex justify-center items-center px-2 py-1 gap-2 text-white rounded-md"
              >
                <FaPlus />
                ADD ADMIN
              </button>
            <div className="relative " ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center  rounded-md space-x-2 focus:outline-none"
              >
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                  {admin.admin?.charAt(0) || "U"}
                </div>
               

                
                </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <div className="h-px bg-gray-200 my-1" />
                   <div className=" w-full px-4 py-2 text-left text-gray-700 hover:bg-blue-50">
                  {admin.admin} 
                </div> 
                  <button
                    className="w-full px-4 py-2 text-left text-red-700 hover:bg-red-50 flex items-center"
                    onClick={() => {
                      handleLogout();
                      setIsDropdownOpen(false);
                    }}
                  >
                    <MdLogout className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              )} 

              
            </div>
           
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto p-4">
            <Breadcrumb />
            {children}
          </div>
        </main>

      </div>
       
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Modal - Only renders when isModalOpen is true */}
      <AdminRegister
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                />
              
    </div>
  );
};

export default Layout;
