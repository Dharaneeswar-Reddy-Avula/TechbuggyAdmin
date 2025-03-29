import React, { useState, useEffect } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import axios from "axios";
const API_URL = "https://backteg.onrender.com/api";
import { ToastContainer, toast } from "react-toastify";
import { ImBin } from "react-icons/im";
import { MdEditNotifications } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { Link } from "react-router-dom";
const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [expandedNotification, setExpandedNotification] = useState(null);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
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
      console.error(
        "Error fetching events:",
        error.response?.data || error.message
      );
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

      await axios({
        method,
        url,
        data: formData,
      });

      fetchNotifications(); // Refresh notifications list
      setVisible(false);
      setSelectedNotification(null);
      setFormData({ title: "", description: "", links: "" }); // Reset form
      toast.success(
        selectedNotification
          ? "Notification updated successfully!"
          : "Notification added successfully!"
      );
    } catch (error) {
      toast.error("Error saving notification!");
      console.error(
        "Error saving notification:",
        error.response?.data || error.message
      );
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
      console.error(
        "Error deleting notification:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="min-h-screen  py-8 px-4 sm:px-6 lg:px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Notifications
          </h1>
          <p className="text-gray-600">
            Manage and view all your notifications
          </p>
        </div>

        {/* Search and Create */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={search}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Search notifications..."
              onChange={(e) => {
                setSearch(e.target.value);
              }}
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
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100 mt-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                <h2 className="text-xl font-semibold text-gray-800">
                  {selectedNotification
                    ? "Edit Notification"
                    : "Create New Notification"}
                </h2>{" "}
              </h2>
              <button
                onClick={() => setVisible(false)}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition"
              >
                <IoCloseSharp className="text-2xl" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Important update"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Detailed notification message..."
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="links"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Links (Optional)
                </label>
                <input
                  type="url"
                  id="links"
                  name="links"
                  value={formData.links}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="https://example.com"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-md"
                >
                  <h2 className="text-xl font-semibold text-white">
                    {selectedNotification
                      ? "Edit Notification"
                      : "Create New Notification"}
                  </h2>{" "}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className=" rounded-xl  overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-3xl font-semibold text-gray-800">
              Active Notifications
            </h2>
          </div>

          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </div>
              <p className="text-gray-500 text-lg">
                No notifications available
              </p>
              <p className="text-gray-400 mt-1">
                Create your first notification to get started
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="grid grid-cols-12 bg-white mb-[10px] rounded-md shadow-sm px-6 py-4 gap-4 font-medium text-gray-700 min-w-[700px]">
                <div className="col-span-3">Title</div>
                <div className="col-span-5">Description</div>
                <div className="col-span-2">Links</div>
                <div className="col-span-1 text-center">Update</div>
                <div className="col-span-1 text-center">Delete</div>
              </div>
              <div className="min-w-[700px]">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification._id}
                    className="grid grid-cols-12 bg-white hover:bg-gray-50 transition-colors mb-[10px] duration-150 rounded-md shadow px-6 py-4 gap-4 items-center"
                  >
                    <div className="col-span-3">
                      <h3 className="text-md font-medium text-gray-900 truncate">
                        {notification.title}
                      </h3>
                    </div>

                    <div className="col-span-5 pr-[30px] ">
                      <p className="text-gray-600 text-md whitespace-nowrap overflow-hidden text-ellipsis line-clamp-1 ">
                        {notification.description}
                      </p>

                      {/* Only show "View more" if text is truncated */}
                      {notification.description.length > 20 && (
                        <button
                          onClick={() => setIsModalOpen(true)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          View more ...
                        </button>
                      )}
                    </div>

                    <div className="col-span-2">
                      {notification.links ? (
                        <a
                          href={notification.links}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm truncate flex items-center"
                        >
                          <span className="truncate">{notification.links}</span>
                        </a>
                      ) : (
                        <span className="text-gray-400 text-sm">No link</span>
                      )}
                    </div>

                    <div className="col-span-1 flex justify-center">
                      <button
                        className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50 transition-colors"
                        title="Edit"
                        onClick={() => handleEdit(notification)}
                      >
                        <MdEditNotifications className="text-xl" />
                      </button>
                    </div>

                    <div className="col-span-1 flex justify-center">
                      <button
                        className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                        onClick={() => handleDelete(notification._id)}
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
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Notifications;
