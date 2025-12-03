// Notifications.jsx
import React, { useState, useEffect } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import axios from "axios";
const API_URL = "http://localhost:8009/api";
import { ToastContainer, toast } from "react-toastify";
import { ImBin } from "react-icons/im";
import { MdEditNotifications } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { Link } from "react-router-dom";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    links: "",
  });

  const filteredNotifications = notifications.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase())
  );

  const fetchNotifications = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/notifications`);
      setNotifications(data);
    } catch (error) {
      toast.error("Error in fetching the notifications");
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = selectedNotification
        ? `${API_URL}/notifications/${selectedNotification._id}`
        : `${API_URL}/notifications`;
      const method = selectedNotification ? "put" : "post";
      await axios({ method, url, data: formData });
      fetchNotifications();
      setVisible(false);
      setSelectedNotification(null);
      setFormData({ title: "", description: "", links: "" });
      toast.success(
        selectedNotification
          ? "Notification updated successfully!"
          : "Notification added successfully!"
      );
    } catch (error) {
      toast.error("Error saving notification!");
    }
  };

  const handleEdit = (notification) => {
    setSelectedNotification(notification);
    setFormData({
      title: notification.title,
      description: notification.description,
      links: notification.links || "",
    });
    setVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      toast.success("Notification deleted successfully");
    } catch (error) {
      toast.error("Failed to delete the notification");
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-4 bg-gray-100 dark:bg-gray-900 text-black dark:text-white transition-all">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Notifications
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage and view all your notifications
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notifications..."
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white px-4 py-2 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
            <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
          </div>
          <button
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2 transition-colors shadow-md"
            onClick={() => {
              setVisible(true);
              setSelectedNotification(null);
            }}
          >
            <FaPlus className="text-lg" />
            Create Notification
          </button>
        </div>

        {visible && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-100 dark:border-gray-700 mt-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                {selectedNotification ? "Edit Notification" : "Create New Notification"}
              </h2>
              <button
                onClick={() => setVisible(false)}
                className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <IoCloseSharp className="text-2xl" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>

              <div>
                <label htmlFor="links" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Links (Optional)
                </label>
                <input
                  type="url"
                  name="links"
                  value={formData.links}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-md"
                >
                  {selectedNotification ? "Edit Notification" : "Create Notification"}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="rounded-xl overflow-hidden mt-6">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Active Notifications</h2>
          </div>

          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-400 dark:text-gray-500">
              <svg className="h-12 w-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <p className="text-lg">No notifications available</p>
              <p>Create your first notification to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="grid grid-cols-8 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 mb-2 rounded-md shadow-sm px-6 py-4 gap-4 font-medium min-w-[700px]">
                <div className="col-span-3">Title</div>
                {/* <div className="col-span-5">Description</div> */}
                <div className="col-span-2">Links</div>
                <div className="col-span-1 text-center">Update</div>
                <div className="col-span-1 text-center">Delete</div>
              </div>
              <div className="min-w-[700px]">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification._id}
                    className="grid grid-cols-8 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors mb-2 duration-150 rounded-md shadow px-6 py-4 gap-4 items-center"
                  >
                    <div className="col-span-3 truncate">{notification.title}</div>
                    {/* <div className="col-span-5 truncate">{notification.description}</div> */}
                    <div className="col-span-2">
                      {notification.links ? (
                        <a
                          href={notification.links}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline truncate"
                        >
                          {notification.links}
                        </a>
                      ) : (
                        <span className="text-gray-400 text-sm">No link</span>
                      )}
                    </div>
                    <div className="col-span-1 flex justify-center">
                      <button
                        onClick={() => handleEdit(notification)}
                        className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-300 p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900"
                        title="Edit"
                      >
                        <MdEditNotifications className="text-xl" />
                      </button>
                    </div>
                    <div className="col-span-1 flex justify-center">
                      <button
                        onClick={() => handleDelete(notification._id)}
                        className="text-red-500 hover:text-red-700 dark:hover:text-red-400 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900"
                        title="Delete"
                      >
                        <ImBin className="text-lg" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* <ToastContainer position="top-right" autoClose={3000} /> */}
    </div>
  );
};

export default Notifications;
