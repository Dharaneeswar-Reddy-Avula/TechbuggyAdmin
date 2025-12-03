import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:8009/api";

const Complaints = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10; // Fixed size of 10 complaints per page

  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);
      // Fetch complaints for the current page with a limit of 10
      const response = await axios.get(`${API_URL}/help/submissions?page=${page}&limit=${itemsPerPage}`);
      
      // Ensure the response data is an array
      const complaints = Array.isArray(response.data.data) ? response.data.data : [];
      
      // Validate that we don't receive more than itemsPerPage
      if (complaints.length > itemsPerPage) {
        console.warn(`Received ${complaints.length} items, expected up to ${itemsPerPage}. Check API pagination.`);
      }
      
      // Set complaints for the current page
      setUsers(complaints);
      
      // Set totalItems from API response (assuming API returns a 'total' field)
      setTotalItems(response.data.total || complaints.length);
      setError(null);
    } catch (error) {
      console.error("Failed to fetch complaints:", error);
      const message =
        error.response?.status === 404
          ? "API endpoint not found. Please check the server configuration."
          : "Failed to load complaints. Please try again later.";
      setError(message);
      setUsers([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < Math.ceil(totalItems / itemsPerPage)) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <div className="max-w-6xl mx-auto md:px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Complaints
          </h2>
        </div>

        {loading && (
          <div className="p-6 flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {error && (
          <div className="p-6 bg-red-50 dark:bg-red-200 text-red-600 rounded-md mx-6 my-4 flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={() => fetchUsers(currentPage)}
              className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-colors"
              aria-label="Retry fetching complaints"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && users.length === 0 && (
          <div className="p-6 text-center text-gray-500 dark:text-gray-300">
            No complaints found.
          </div>
        )}

        {!loading && !error && users.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600" aria-label="Complaints table">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  {["S.no", "Name", "Email", "Incident", "Message"].map((title) => (
                    <th
                      key={title}
                      scope="col"
                      className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      {title}
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-xs" title={user.name}>
                        {user.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-300 truncate max-w-xs" title={user.userEmail}>
                        {user.userEmail}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-sm leading-5 font-semibold rounded-full bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100">
                        {user.incident}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-sm leading-5 font-semibold rounded-full bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100" title={user.message}>
                        {user.message}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalItems > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-600 flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-300">
              Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
              <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of{" "}
              <span className="font-medium">{totalItems}</span> results
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handlePrevious}
                className="px-4 py-2 border rounded-md text-sm font-medium text-gray-700 dark:text-white bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                className="px-4 py-2 border rounded-md text-sm font-medium text-gray-700 dark:text-white bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
                disabled={currentPage >= Math.ceil(totalItems / itemsPerPage)}
                aria-label="Next page"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Complaints;