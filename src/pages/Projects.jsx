import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiRefreshCw, FiEye, FiCheck, FiX, FiCheckCircle, FiXCircle, FiClock, FiCreditCard, FiMessageSquare, FiFileText } from 'react-icons/fi';
import { useSelector } from 'react-redux';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('pending');
  const [selectedProject, setSelectedProject] = useState(null);
  const [adminComment, setAdminComment] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState(null); // 'approve' or 'reject'
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestAmount, setRequestAmount] = useState('');
  const [requestDescription, setRequestDescription] = useState('');

  const API_BASE_URL = 'https://backteg-38ub.onrender.com/api/admin';
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (projects.length > 0) {
      if (filter) {
        setFilteredProjects(projects.filter(p => p.status === filter));
      } else {
        setFilteredProjects(projects);
      }
    }
  }, [filter, projects]);

  useEffect(() => {
    fetchProjects();
  }, [token]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      if (!token) {
        toast.error('Please login first');
        setLoading(false);
        return;
      }
      const url = `${API_BASE_URL}/projects`;

      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setProjects(response.data.projects);
      if (filter) {
        setFilteredProjects(response.data.projects.filter(p => p.status === filter));
      } else {
        setFilteredProjects(response.data.projects);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedProject) return;
    if (!token) {
      toast.error('Please login first');
      return;
    }

    try {
      await axios.put(
        `${API_BASE_URL}/projects/${selectedProject._id}/approve`,
        { adminComment },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      toast.success('Project approved successfully!');
      setShowModal(false);
      setAdminComment('');
      setSelectedProject(null);
      fetchProjects();
    } catch (error) {
      console.error('Error approving project:', error);
      toast.error(error.response?.data?.message || 'Failed to approve project');
    }
  };

  const handleReject = async () => {
    if (!selectedProject) return;
    if (!adminComment.trim()) {
      toast.warning('Please provide a reason for rejection');
      return;
    }
    if (!token) {
      toast.error('Please login first');
      return;
    }

    try {
      await axios.put(
        `${API_BASE_URL}/projects/${selectedProject._id}/reject`,
        { adminComment },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      toast.success('Project rejected successfully!');
      setShowModal(false);
      setAdminComment('');
      setSelectedProject(null);
      fetchProjects();
    } catch (error) {
      console.error('Error rejecting project:', error);
      toast.error(error.response?.data?.message || 'Failed to reject project');
    }
  };

  const handleRequestPayment = async () => {
    if (!selectedProject) return;
    if (!requestAmount || Number(requestAmount) <= 0) {
      toast.warning('Please enter a valid amount');
      return;
    }
    if (!requestDescription.trim()) {
      toast.warning('Please enter a description for the payment request');
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/projects/${selectedProject._id}/payment-requests`,
        {
          amount: Number(requestAmount),
          description: requestDescription
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      toast.success('Payment request created successfully!');
      setShowRequestModal(false);
      setRequestAmount('');
      setRequestDescription('');
      setSelectedProject(null);
      fetchProjects();
    } catch (error) {
      console.error('Error creating payment request:', error);
      toast.error(error.response?.data?.message || 'Failed to create payment request');
    }
  };

  const openModal = (project, action) => {
    setSelectedProject(project);
    setActionType(action);
    setAdminComment('');
    setShowModal(true);
  };

  const openRequestModal = (project) => {
    setSelectedProject(project);
    setRequestAmount('');
    setRequestDescription('');
    setShowRequestModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProject(null);
    setAdminComment('');
    setActionType(null);
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      confirmed: 'bg-green-100 text-green-800 border-green-300',
      rejected: 'bg-red-100 text-red-800 border-red-300'
    };
    return badges[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getStatusIcon = (status) => {
    if (status === 'confirmed') return <FiCheckCircle className="text-green-500" />;
    if (status === 'rejected') return <FiXCircle className="text-red-500" />;
    return <FiClock className="text-yellow-500" />;
  };

  const stats = {
    total: projects.length,
    pending: projects.filter(p => p.status === 'pending').length,
    confirmed: projects.filter(p => p.status === 'confirmed').length,
    rejected: projects.filter(p => p.status === 'rejected').length
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-colors">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Project Approvals</h1>
          <button
            onClick={fetchProjects}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors w-full sm:w-auto justify-center"
          >
            <FiRefreshCw className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border-l-4 border-blue-500">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-semibold">Total Projects</h3>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border-l-4 border-yellow-500">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-semibold">Pending Review</h3>
            <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border-l-4 border-green-500">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-semibold">Approved</h3>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.confirmed}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border-l-4 border-red-500">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-semibold">Rejected</h3>
            <p className="text-3xl font-bold text-red-600 dark:text-red-400">{stats.rejected}</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 flex gap-2 bg-white dark:bg-gray-800 p-2 rounded-lg shadow overflow-x-auto whitespace-nowrap hide-scrollbar">
          <button
            className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${filter === 'pending' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            onClick={() => setFilter('pending')}
          >
            Pending ({stats.pending})
          </button>
          <button
            className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${filter === 'confirmed' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            onClick={() => setFilter('confirmed')}
          >
            Approved ({stats.confirmed})
          </button>
          <button
            className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${filter === 'rejected' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            onClick={() => setFilter('rejected')}
          >
            Rejected ({stats.rejected})
          </button>
          <button
            className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${filter === '' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            onClick={() => setFilter('')}
          >
            All Projects ({stats.total})
          </button>
        </div>

        {/* Projects List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading projects...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No projects found</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredProjects.map((project) => (
              <div key={project._id} className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 border-l-4 border-indigo-500 hover:shadow-xl transition-shadow">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="flex-1 w-full">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getStatusIcon(project.status)}</span>
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{project.title}</h3>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border inline-block ${getStatusBadge(project.status)}`}>
                        {project.status.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{project.description}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-400">Company:</span>
                        <p className="text-gray-900 dark:text-gray-200">{project.client?.companyName}</p>
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-400">Contact:</span>
                        <p className="text-gray-900 dark:text-gray-200">{project.client?.userName}</p>
                      </div>
                      <div className=''>
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-400">Email:</span>
                        <p className="text-gray-900 dark:text-gray-200">{project.client?.email}</p>
                      </div>

                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-400">Budget:</span>
                      <p className="text-gray-900 dark:text-gray-200 font-semibold">₹{project.budget?.toLocaleString()}</p>
                    </div>

                    {project.adminComment && (
                      <div className={`mt-4 p-4 rounded-lg ${project.status === 'confirmed'
                        ? 'bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500'
                        : 'bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500'
                        }`}>
                        <p className="font-semibold text-sm mb-1 dark:text-gray-200 flex items-center gap-2">
                          {project.status === 'confirmed' ? <><FiMessageSquare /> Admin Comment:</> : <><FiFileText /> Rejection Reason:</>}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">{project.adminComment}</p>
                      </div>
                    )}

                    <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                      Submitted: {new Date(project.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>

                  {/* Action Buttons (only for pending projects) */}
                  {project.status === 'pending' && (
                    <div className="ml-4 flex flex-col gap-2">
                      <button
                        onClick={() => openModal(project, 'approve')}
                        className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                      >
                        <FiCheck /> Approve
                      </button>
                      <button
                        onClick={() => openModal(project, 'reject')}
                        className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <FiX /> Reject
                      </button>
                    </div>
                  )}

                  {project.status === 'confirmed' && (
                    <div className="ml-4 flex flex-col gap-2">
                      <button
                        onClick={() => openRequestModal(project)}
                        className="flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors whitespace-nowrap"
                      >
                        <FiCreditCard /> Request Payment
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Review Modal */}
        {showModal && selectedProject && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4 dark:text-white flex items-center gap-2">
                {actionType === 'approve' ? <><FiCheckCircle className="text-green-500" /> Approve Project</> : <><FiXCircle className="text-red-500" /> Reject Project</>}
              </h2>

              <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 dark:text-white">{selectedProject.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-2">{selectedProject.description}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Company:</span> {selectedProject.client?.companyName}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Budget:</span> ₹{selectedProject.budget?.toLocaleString()}
                </p>
              </div>

              <div className="mb-4">
                <label className="block font-semibold mb-2 text-gray-700 dark:text-gray-200">
                  {actionType === 'approve'
                    ? 'Comment (optional):'
                    : 'Rejection Reason (required):'}
                </label>
                <textarea
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg p-3 h-24 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder={actionType === 'approve'
                    ? 'Add an optional comment...'
                    : 'Please provide a reason for rejection...'}
                  value={adminComment}
                  onChange={(e) => setAdminComment(e.target.value)}
                />
              </div>

              <div className="flex gap-3 mt-4">
                {actionType === 'approve' ? (
                  <button
                    className="flex-1 bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 font-semibold transition-colors"
                    onClick={handleApprove}
                  >
                    Confirm Approval
                  </button>
                ) : (
                  <button
                    className="flex-1 bg-red-500 text-white px-4 py-3 rounded-lg hover:bg-red-600 font-semibold transition-colors"
                    onClick={handleReject}
                  >
                    Confirm Rejection
                  </button>
                )}
                <button
                  className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-4 py-3 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 font-semibold transition-colors"
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Request Payment Modal */}
        {showRequestModal && selectedProject && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4 dark:text-white flex items-center gap-2"><FiCreditCard className="text-blue-500" /> Request Custom Payment</h2>

              <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 dark:text-white">Project: {selectedProject.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  <span className="font-semibold">Client:</span> {selectedProject.client?.companyName} ({selectedProject.client?.userName})
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Amount (₹)</label>
                <input
                  type="number"
                  min="1"
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g. 5000"
                  value={requestAmount}
                  onChange={(e) => setRequestAmount(e.target.value)}
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Description / Reason</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g. Extra server setup fee"
                  value={requestDescription}
                  onChange={(e) => setRequestDescription(e.target.value)}
                />
              </div>

              <div className="flex gap-3">
                <button
                  className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 font-semibold transition-colors"
                  onClick={handleRequestPayment}
                >
                  Create Request
                </button>
                <button
                  className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-4 py-3 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 font-semibold transition-colors"
                  onClick={() => setShowRequestModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
