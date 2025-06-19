import React, { useState, useEffect } from "react";
import axios from "axios";
import { ImBin } from "react-icons/im";
import { MdEdit } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoCloseSharp } from "react-icons/io5";
import { AiOutlineEye } from "react-icons/ai";

const API_URL = "https://backteg.onrender.com/api";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSpinner, setShowSpinner] = useState(false); // New for delayed loader
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [visible, setVisible] = useState(false);
  const [viewUser, setViewUser] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (loading) setShowSpinner(true);
    }, 500); // Show spinner after 500ms
    return () => clearTimeout(delay);
  }, [loading]);

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
      setShowSpinner(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/User/users/${id}`);
      setUsers((prev) => prev.filter((n) => n._id !== id));
      toast.success("User deleted successfully");
    } catch (error) {
      toast.error("Failed to delete the user");
      console.error("Error deleting user:", error.response?.data || error.message);
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
      await axios.put(`${API_URL}/User/users/${selectedUser._id}`, formData);
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
        <div className="relative w-full sm:w-64 mb-3">
          <input
            type="text"
            value={search}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="Search Users..."
            onChange={(e) => setSearch(e.target.value)}
          />
          <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800">User Management</h2>
        </div>

        {/* Loader */}
        {loading && showSpinner && (
          <div className=" flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
            <p className="text-blue-600 text-sm font-medium animate-pulse">
              Loading users, please wait...
            </p>
          </div>
        )}

        {/* Error Message */}
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

        {/* Edit Modal */}
        {visible && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md relative">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Edit User</h2>
                <button
                  onClick={() => setVisible(false)}
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition"
                >
                  <span className="text-2xl font-bold leading-none">×</span>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    Update User
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* User Table */}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {["S.no", "Name", "Email", "Status", "Password", "Actions"].map((head, idx) => (
                    <th
                      key={idx}
                      className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user, index) => (
                  <tr key={user._id || index}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">{user.username}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 inline-flex text-sm font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-[150px]">
                      {user.password}
                    </td>
                    <td className="px-6 py-4 flex space-x-3 justify-end">
                      <button
                        className="text-green-600 hover:text-green-900"
                        title="View"
                        onClick={() => handleView(user)}
                      >
                        <AiOutlineEye className="text-xl" />
                      </button>
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit"
                        onClick={() => handleEdit(user)}
                      >
                        <MdEdit className="text-xl" />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                        onClick={() => handleDelete(user._id)}
                      >
                        <ImBin className="text-lg" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
