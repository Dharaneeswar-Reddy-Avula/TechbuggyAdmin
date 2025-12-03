import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiRefreshCw, FiEye, FiCheck, FiX } from 'react-icons/fi';
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

  const API_BASE_URL = 'http://localhost:8009/api/admin';
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    fetchProjects();
  }, [filter, token]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      if (!token) {
        toast.error('Please login first');
        setLoading(false);
        return;
      }
      const url = filter ? `${API_BASE_URL}/projects?status=${filter}` : `${API_BASE_URL}/projects`;
      
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setProjects(response.data.projects);
      setFilteredProjects(response.data.projects);
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

  const openModal = (project, action) => {
    setSelectedProject(project);
    setActionType(action);
    setAdminComment('');
    setShowModal(true);
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
    if (status === 'confirmed') return '✅';
    if (status === 'rejected') return '❌';
    return '⏳';
  };

  const stats = {
    total: projects.length,
    pending: projects.filter(p => p.status === 'pending').length,
    confirmed: projects.filter(p => p.status === 'confirmed').length,
    rejected: projects.filter(p => p.status === 'rejected').length
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Project Management</h1>
          <button
            onClick={fetchProjects}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <FiRefreshCw className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white shadow rounded-lg p-6 border-l-4 border-blue-500">
            <h3 className="text-gray-500 text-sm font-semibold">Total Projects</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6 border-l-4 border-yellow-500">
            <h3 className="text-gray-500 text-sm font-semibold">Pending Review</h3>
            <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6 border-l-4 border-green-500">
            <h3 className="text-gray-500 text-sm font-semibold">Approved</h3>
            <p className="text-3xl font-bold text-green-600">{stats.confirmed}</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6 border-l-4 border-red-500">
            <h3 className="text-gray-500 text-sm font-semibold">Rejected</h3>
            <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 flex gap-2 bg-white p-2 rounded-lg shadow">
          <button
            className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
              filter === 'pending' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setFilter('pending')}
          >
            Pending ({stats.pending})
          </button>
          <button
            className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
              filter === 'confirmed' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setFilter('confirmed')}
          >
            Approved ({stats.confirmed})
          </button>
          <button
            className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
              filter === 'rejected' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setFilter('rejected')}
          >
            Rejected ({stats.rejected})
          </button>
          <button
            className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
              filter === '' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'
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
            <p className="mt-4 text-gray-600">Loading projects...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-lg">No projects found</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredProjects.map((project) => (
              <div key={project._id} className="bg-white shadow-lg rounded-lg p-6 border-l-4 border-indigo-500 hover:shadow-xl transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{getStatusIcon(project.status)}</span>
                      <h3 className="text-xl font-semibold text-gray-800">{project.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(project.status)}`}>
                        {project.status.toUpperCase()}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{project.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <span className="text-sm font-semibold text-gray-700">Company:</span>
                        <p className="text-gray-900">{project.client?.companyName}</p>
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-gray-700">Contact:</span>
                        <p className="text-gray-900">{project.client?.userName}</p>
                      </div>
                      <div className=''>
                        <span className="text-sm font-semibold text-gray-700">Email:</span>
                        <p className="text-gray-900">{project.client?.email}</p>
                      </div>
                      
                    </div>
                    <div>
                        <span className="text-sm font-semibold text-gray-700">Budget:</span>
                        <p className="text-gray-900 font-semibold">₹{project.budget?.toLocaleString()}</p>
                      </div>

                    {project.adminComment && (
                      <div className={`mt-4 p-4 rounded-lg ${
                        project.status === 'confirmed' 
                          ? 'bg-green-50 border-l-4 border-green-500' 
                          : 'bg-red-50 border-l-4 border-red-500'
                      }`}>
                        <p className="font-semibold text-sm mb-1">
                          {project.status === 'confirmed' ? '💬 Admin Comment:' : '📋 Rejection Reason:'}
                        </p>
                        <p className="text-gray-700">{project.adminComment}</p>
                      </div>
                    )}

                    <div className="mt-3 text-sm text-gray-500">
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
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Review Modal */}
        {showModal && selectedProject && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">
                {actionType === 'approve' ? '✅ Approve Project' : '❌ Reject Project'}
              </h2>
              
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">{selectedProject.title}</h3>
                <p className="text-gray-600 mb-2">{selectedProject.description}</p>
                <p className="text-sm text-gray-500">
                  <span className="font-semibold">Company:</span> {selectedProject.client?.companyName}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-semibold">Budget:</span> ₹{selectedProject.budget?.toLocaleString()}
                </p>
              </div>

              <div className="mb-4">
                <label className="block font-semibold mb-2 text-gray-700">
                  {actionType === 'approve' 
                    ? 'Comment (optional):' 
                    : 'Rejection Reason (required):'}
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-3 h-24 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder={actionType === 'approve' 
                    ? 'Add an optional comment...' 
                    : 'Please provide a reason for rejection...'}
                  value={adminComment}
                  onChange={(e) => setAdminComment(e.target.value)}
                />
              </div>

              <div className="flex gap-3">
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
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-400 font-semibold transition-colors"
                  onClick={closeModal}
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
