import React, { useState, useEffect } from "react";
import axios from "axios";
import { ImBin } from "react-icons/im";
import { MdEdit } from "react-icons/md";

const API_URL = "https://backteg.onrender.com/api";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="max-w-6xl mx-auto md:px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800">User Management</h2>
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

        {/* Table */}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    S.no
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user, index) => (
                  <tr key={user._id || index} className="hover:bg-gray-50 transition-colors">
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
                        <button
                          className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50 transition-all"
                          title="Edit"
                        >
                          <MdEdit className="text-xl" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50 transition-all"
                          title="Delete"
                        >
                          <ImBin className="text-lg" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination would go here */}
        {users.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{users.length}</span> of{' '}
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