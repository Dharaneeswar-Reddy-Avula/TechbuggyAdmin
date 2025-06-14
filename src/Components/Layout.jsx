import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { toast } from "react-hot-toast";
import { FaUsers, FaPlus } from "react-icons/fa";
import { RiAlertFill } from "react-icons/ri";
import { MdSpaceDashboard, MdNotificationsActive, MdAdminPanelSettings, MdLogout, MdPerson, MdMenu } from "react-icons/md";
import { LuNotebookPen } from "react-icons/lu";
import { IoAlertCircle } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import logo from "../assets/logo.png";
import AdminRegister from "../pages/registerPage/Register";
import { logout } from "../store/authSlice";
import { ThemeToggleButton } from "../Components/themeProvider/ThemeToggleButton";

const Breadcrumb = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);

  return (
    <nav className="breadcrumb mt-4 mb-6 text-gray-700 dark:text-white">
      <ul className="flex items-center text-sm text-gray-500 dark:text-gray-300 space-x-2">
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
  const dispatch = useDispatch();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dropdownRef = useRef(null);
  const admin = useSelector((state) => state.auth);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 768);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-800">
      <ToastContainer position="top-center" />
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed md:relative md:translate-x-0 z-30 w-64 h-full bg-white dark:bg-gray-900 border-r dark:border-gray-800 transition-transform duration-300 ease-in-out`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4">
            <Link
              to="/"
              className="flex text-2xl items-center gap-2 font-bold text-blue-600"
            >
              <img src={logo} className="w-[50px] h-[50px]" />
              <span className="font">TechBuggy</span>
            </Link>
          </div>
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {sidebarItems.map((item, index) => (
              <Link
                key={index}
                to={`/${item.path}`}
                className={`flex items-center px-4 py-3 text-gray-700 hover:bg-blue-100 dark:hover:bg-gray-800 hover:text-blue-600 rounded-lg transition-colors duration-200 ${
                  isActive(item.path)
                    ? "bg-blue-100 dark:bg-blue-600 dark:text-white text-blue-600"
                    : "dark:text-gray-300"
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t dark:border-gray-800">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center px-4 py-2 text-red-700 hover:bg-red-100 dark:hover:bg-red-700 dark:text-white hover:text-red-600 rounded-lg transition-colors duration-200"
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
        <header className="bg-white dark:bg-gray-900 border dark:border-gray-800 shadow-sm z-20">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-4 gap-4 flex md:justify-end justify-between items-center">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-gray-500 hover:text-gray-600 dark:text-gray-300 md:hidden"
            >
              <MdMenu className="w-6 h-6" />
            </button>
            <div className="flex flex-row gap-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#2664eb] flex justify-center items-center px-2 py-1 gap-2 text-white rounded-md"
            >
              <FaPlus />
              ADD ADMIN
            </button>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center rounded-md space-x-2 focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                  {admin.admin?.charAt(0) || "U"}
                </div>
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50">
                  <div className="h-px bg-gray-200 dark:bg-gray-700 my-1" />
                  <div className="w-full px-4 py-2 text-left text-gray-700 dark:text-white hover:bg-blue-50 dark:hover:bg-gray-700">
                    {admin.admin}
                  </div>
                  <button
                    className="w-full px-4 py-2 text-left text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 flex items-center"
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
            <div className="text-black dark:text-white">
              <ThemeToggleButton />
            </div>
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
          <div className="container mx-auto p-4 text-black dark:text-white">
            <Breadcrumb />
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Modal */}
      <AdminRegister isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Layout;
