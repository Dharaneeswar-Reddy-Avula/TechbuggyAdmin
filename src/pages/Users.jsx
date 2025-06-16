import React, { useState, useEffect } from "react";
import axios from "axios";
import { ImBin } from "react-icons/im";
import { MdEdit } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoCloseSharp } from "react-icons/io5";
// const API_URL = "https://backteg.onrender.com/api";
const API_URL = "http://localhost:8009/api";
import { AiOutlineEye } from "react-icons/ai";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [visible, setVisible] = useState(false);
  const [viewUser, setViewUser] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_URL}/User/users`);
      setUsers(data.data);
      setError(null);
    } catch (error) {
      console.error("Failed to fetch the users", error);
      setError("Failed to load users. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/User/users/${id}`);
      setUsers((prev) => prev.filter((n) => n._id !== id));
      toast.success("Notification deleted successfully");
    } catch (error) {
      toast.error("Failed to delete the notification");
      console.error(
        "Error deleting notification:",
        error.response?.data || error.message
      );
    }
  };
  const handleView = (user) => {
    setViewUser(user);
    setViewModalOpen(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      email: user.email,
    });
    setVisible(true);
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedUser) return;

    try {
      const { data } = await axios.put(
        `${API_URL}/User/users/${selectedUser._id}`,
        formData
      );

      // Update users in UI
      setUsers((prev) =>
        prev.map((u) =>
          u._id === selectedUser._id ? { ...u, ...formData } : u
        )
      );

      toast.success("User updated successfully");
      setVisible(false);
      setSelectedUser(null);
      setFormData({ username: "", email: "" });
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto md:px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-end mt-[-80px]">
        <div className="relative w-full sm:w-64 mb-3 ">
          <input
            type="text"
            value={search}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="Search Users..."
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
          <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800">
            User Management
          </h2>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="p-6 flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {error && (
          <div className="p-6 bg-red-50 text-red-600 rounded-md mx-6 my-4 flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={fetchUsers}
              className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-colors"
            >
              Retry
            </button>
          </div>
        )}
        {visible && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md relative">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {selectedUser ? "Edit User" : "Create New User"}
                </h2>
                <button
                  onClick={() => setVisible(false)}
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition"
                >
                  <span className="text-2xl font-bold leading-none">×</span>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="Enter username"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="Enter email"
                    required
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-md"
                  >
                    {selectedUser ? "Update User" : "Create User"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Table */}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
                  >
                    S.no
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-sm font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user, index) => (
                  <tr
                    key={user._id || index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                        {user.username}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        {/* <button
                          className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50 transition-all"
                          title="Edit"
                          onClick={() => handleEdit(user)}
                        >
                          <MdEdit className="text-xl" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50 transition-all"
                          title="Delete"
                          onClick={() => handleDelete(user._id)}
                        >
                          <ImBin className="text-lg" />
                        </button> */}
                        <div className="flex justify-end space-x-3">
                          <button
                            className="text-green-600 hover:text-green-900 p-1 rounded-md hover:bg-green-50 transition-all"
                            title="View"
                            onClick={() => handleView(user)}
                          >
                            <AiOutlineEye className="text-xl" />
                          </button>
                          <button
                            className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50 transition-all"
                            title="Edit"
                            onClick={() => handleEdit(user)}
                          >
                            <MdEdit className="text-xl" />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50 transition-all"
                            title="Delete"
                            onClick={() => handleDelete(user._id)}
                          >
                            <ImBin className="text-lg" />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

{viewModalOpen && viewUser && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-all">
    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md relative animate-fade-in-up">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-3 mb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <span className="inline-block w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
          User Details
        </h2>
        <button
          onClick={() => setViewModalOpen(false)}
          className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition"
        >
          <IoCloseSharp className="text-2xl" />
        </button>
      </div>

      {/* Details Section */}
      <div className="space-y-4 text-sm text-gray-700">
        <div className="flex flex-col">
          <span className="text-xs text-gray-400">Username</span>
          <span className="font-medium text-base">{viewUser.username}</span>
        </div>

        <div className="flex flex-col">
          <span className="text-xs text-gray-400">Email</span>
          <span className="font-medium text-base">{viewUser.email}</span>
        </div>

        {/* Uncomment/add if available */}
        {/* 
        <div className="flex flex-col">
          <span className="text-xs text-gray-400">User ID</span>
          <span className="font-mono text-sm text-gray-600">{viewUser._id}</span>
        </div>

        <div className="flex flex-col">
          <span className="text-xs text-gray-400">Role</span>
          <span className="font-medium text-base">{viewUser.role}</span>
        </div> 
        */}
      </div>

      {/* Footer (optional) */}
      <div className="mt-6 text-right">
        <button
          onClick={() => setViewModalOpen(false)}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

        {/* Pagination would go here */}
        {users.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">1</span> to{" "}
              <span className="font-medium">{users.length}</span> of{" "}
              <span className="font-medium">{users.length}</span> results
            </div>
            <div className="flex space-x-2">
              <button className="px-4 py-2 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                Previous
              </button>
              <button className="px-4 py-2 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
