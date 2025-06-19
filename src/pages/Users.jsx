import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { ImBin } from "react-icons/im";
import { MdEdit } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoCloseSharp } from "react-icons/io5";
const API_URL = "https://backteg.onrender.com/api";
// const API_URL = "http://localhost:8009/api";
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

  const [deleteUserId, setDeleteUserId] = useState(null);
  const [deleteReason, setDeleteReason] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const admin = useSelector((state) => state.auth);

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

  const handleDelete = (id) => {
    setDeleteUserId(id);
    setConfirmDeleteModal(true);
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await axios.delete(`${API_URL}/User/users/${deleteUserId}`, {
        data: { reason: deleteReason,admin:admin.email },
      });
      setUsers((prev) => prev.filter((n) => n._id !== deleteUserId));
      toast.success("User deleted and email sent successfully.");
    } catch (error) {
      toast.error("Failed to delete the user");
      console.error("Error deleting user:", error);
    } finally {
      setDeleting(false);
      setConfirmDeleteModal(false);
      setDeleteReason("");
      setDeleteUserId(null);
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
      const { data } = await axios.put(`
        ${API_URL}/User/users/${selectedUser._id},
        formData`);

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
          <div className="p-6 bg-red-50 dark:bg-red-200 text-red-600 rounded-md mx-6 my-4 flex justify-between items-center">
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

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  {[
                    "S.no",
                    "Name",
                    "Email",
                    "Status",
                    "Registered On",
                    "Actions",
                  ].map((head, idx) => (
                    <th
                      key={idx}
                      scope="col"
                      className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {users.map((user, index) => (
                  <tr
                    key={user._id || index}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4">{user.username}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 inline-flex text-sm font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("en-GB")
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
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
                  <span className="font-medium text-base">
                    {viewUser.username}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-xs text-gray-400">Email</span>
                  <span className="font-medium text-base">
                    {viewUser.email}
                  </span>
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

        {confirmDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">
                Delete User
              </h2>
              <p className="text-sm mb-2 text-gray-600">
                Please enter the reason for deleting this user:
              </p>
              <textarea
                rows={3}
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                placeholder="Reason for deletion..."
                className="w-full border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring focus:border-blue-500"
              />
              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                  onClick={() => setConfirmDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
  className={`px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center justify-center ${
    deleting ? "cursor-not-allowed opacity-70" : ""
  }`}
  onClick={confirmDelete}
  disabled={!deleteReason.trim() || deleting}
>
  {deleting ? (
    <span className="flex items-center gap-2">
      <svg
        className="animate-spin h-4 w-4 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        ></path>
      </svg>
      Deleting...
    </span>
  ) : (
    "Confirm Delete"
  )}
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
              <button className="px-4 py-2 border rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                Previous
              </button>
              <button className="px-4 py-2 border rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
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
