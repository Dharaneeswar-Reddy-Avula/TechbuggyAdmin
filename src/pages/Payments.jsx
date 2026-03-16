import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiRefreshCw, FiCheck, FiX } from 'react-icons/fi';
import { useSelector } from 'react-redux';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('pending');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [adminComment, setAdminComment] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState(null); // 'confirm' or 'reject'

  const API_BASE_URL = 'http://localhost:8009/api/admin';
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    fetchPayments();
  }, [filter, token]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      if (!token) {
        toast.error('Please login first');
        setLoading(false);
        return;
      }
      const url = filter ? `${API_BASE_URL}/payments?status=${filter}` : `${API_BASE_URL}/payments`;
      
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setPayments(response.data.payments);
      setFilteredPayments(response.data.payments);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!selectedPayment) return;
    if (!token) {
      toast.error('Please login first');
      return;
    }

    try {
      await axios.put(
        `${API_BASE_URL}/payments/${selectedPayment._id}/confirm`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      toast.success('Payment confirmed successfully!');
      closeModal();
      fetchPayments();
    } catch (error) {
      console.error('Error confirming payment:', error);
      toast.error(error.response?.data?.message || 'Failed to confirm payment');
    }
  };

  const handleReject = async () => {
    if (!selectedPayment) return;
    if (!adminComment.trim()) {
      toast.warning('Please provide a reason for rejection (this will be sent to the user)');
      return;
    }
    if (!token) {
      toast.error('Please login first');
      return;
    }

    try {
      await axios.put(
        `${API_BASE_URL}/payments/${selectedPayment._id}/reject`,
        { adminComment },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      toast.success('Payment rejected successfully!');
      closeModal();
      fetchPayments();
    } catch (error) {
      console.error('Error rejecting payment:', error);
      toast.error(error.response?.data?.message || 'Failed to reject payment');
    }
  };

  const openModal = (payment, action) => {
    setSelectedPayment(payment);
    setActionType(action);
    setAdminComment('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPayment(null);
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
    total: payments.length,
    pending: payments.filter(p => p.status === 'pending').length,
    confirmed: payments.filter(p => p.status === 'confirmed').length,
    rejected: payments.filter(p => p.status === 'rejected').length
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Payment Verifications</h1>
          <button
            onClick={fetchPayments}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <FiRefreshCw className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white shadow rounded-lg p-6 border-l-4 border-blue-500">
            <h3 className="text-gray-500 text-sm font-semibold">Total Submissions</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6 border-l-4 border-yellow-500">
            <h3 className="text-gray-500 text-sm font-semibold">Pending Verification</h3>
            <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6 border-l-4 border-green-500">
            <h3 className="text-gray-500 text-sm font-semibold">Confirmed</h3>
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
            Confirmed ({stats.confirmed})
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
            All Submissions ({stats.total})
          </button>
        </div>

        {/* Payments List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Loading payments...</p>
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-lg">No payment submissions found</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredPayments.map((payment) => (
              <div key={payment._id} className="bg-white shadow-lg rounded-lg p-6 border-l-4 border-indigo-500 hover:shadow-xl transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{getStatusIcon(payment.status)}</span>
                      <h3 className="text-xl font-semibold text-gray-800">Payment for: {payment.project?.title || 'Unknown Project'}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(payment.status)}`}>
                        {payment.status.toUpperCase()}
                      </span>
                    </div>
                    
                    <p className="text-indigo-600 font-bold text-lg mb-4">Amount: ₹{payment.amount?.toLocaleString()} (Phase {payment.phase})</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <span className="text-sm font-semibold text-gray-700">Client Info:</span>
                        <p className="text-gray-900">{payment.client?.companyName} ({payment.client?.userName})</p>
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-gray-700">Method:</span>
                        <p className="text-gray-900 font-medium">{payment.paymentMethod}</p>
                      </div>
                      <div className='col-span-2'>
                        <span className="text-sm font-semibold text-gray-700">UTR / Transaction No:</span>
                        <p className="text-gray-900 font-mono bg-gray-100 px-2 py-1 inline-block rounded border border-gray-200">{payment.utrNumber}</p>
                      </div>
                    </div>

                    {payment.adminComment && (
                      <div className={`mt-4 p-4 rounded-lg bg-red-50 border-l-4 border-red-500`}>
                        <p className="font-semibold text-sm mb-1">📋 Rejection Reason:</p>
                        <p className="text-gray-700">{payment.adminComment}</p>
                      </div>
                    )}

                    <div className="mt-3 text-sm text-gray-500">
                      Submitted: {new Date(payment.createdAt).toLocaleDateString('en-IN', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>

                  {/* Action Buttons (only for pending payments) */}
                  {payment.status === 'pending' && (
                    <div className="ml-4 flex flex-col gap-2">
                      <button
                        onClick={() => openModal(payment, 'confirm')}
                        className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors shadow-sm"
                      >
                        <FiCheck /> Confirm Payment
                      </button>
                      <button
                        onClick={() => openModal(payment, 'reject')}
                        className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors shadow-sm"
                      >
                        <FiX /> Reject Payment
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Review Modal */}
        {showModal && selectedPayment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">
                {actionType === 'confirm' ? '✅ Confirm Payment' : '❌ Reject Payment'}
              </h2>
              
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Project: {selectedPayment.project?.title}</h3>
                <p className="text-gray-600 mb-2">Phase: <span className="font-semibold">{selectedPayment.phase}</span></p>
                <p className="text-indigo-600 text-xl font-bold mb-2">Amount: ₹{selectedPayment.amount?.toLocaleString()}</p>
                <p className="text-sm text-gray-500 mb-1">
                  <span className="font-semibold">Client:</span> {selectedPayment.client?.userName} ({selectedPayment.client?.companyName})
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-semibold">UTR / Trans No:</span> <span className="font-mono bg-white px-1 border rounded">{selectedPayment.utrNumber}</span>
                </p>
              </div>

              {actionType === 'confirm' && (
                <div className="mb-4 p-3 bg-blue-50 text-blue-800 rounded border border-blue-200 text-sm">
                  Confirming this payment will mark the project phase as fully paid and automatically send an email receipt to the client. Ensure the UTR has been verified in your bank statement.
                </div>
              )}

              {actionType === 'reject' && (
                <div className="mb-4">
                  <label className="block font-semibold mb-2 text-gray-700">
                    Rejection Reason (required - will be emailed to client):
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg p-3 h-24 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="e.g., UTR not found in bank statement, amount mismatch..."
                    value={adminComment}
                    onChange={(e) => setAdminComment(e.target.value)}
                  />
                </div>
              )}

              <div className="flex gap-3 mt-6">
                {actionType === 'confirm' ? (
                  <button
                    className="flex-1 bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 font-semibold transition-colors"
                    onClick={handleConfirm}
                  >
                    Confirm Payment
                  </button>
                ) : (
                  <button
                    className="flex-1 bg-red-500 text-white px-4 py-3 rounded-lg hover:bg-red-600 font-semibold transition-colors disabled:opacity-50"
                    onClick={handleReject}
                    disabled={!adminComment.trim()}
                  >
                    Reject Payment
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

export default Payments;
