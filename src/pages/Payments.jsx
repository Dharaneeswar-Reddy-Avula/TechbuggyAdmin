import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiRefreshCw, FiCheck, FiX, FiCheckCircle, FiXCircle, FiClock, FiFileText } from 'react-icons/fi';
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

  const API_BASE_URL = 'https://backteg-38ub.onrender.com/api/admin';
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (payments.length > 0) {
      if (filter) {
        setFilteredPayments(payments.filter(p => p.status === filter));
      } else {
        setFilteredPayments(payments);
      }
    }
  }, [filter, payments]);

  useEffect(() => {
    fetchPayments();
  }, [token]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      if (!token) {
        toast.error('Please login first');
        setLoading(false);
        return;
      }
      const url = `${API_BASE_URL}/payments`;

      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setPayments(response.data.payments);
      if (filter) {
        setFilteredPayments(response.data.payments.filter(p => p.status === filter));
      } else {
        setFilteredPayments(response.data.payments);
      }
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
    if (status === 'confirmed') return <FiCheckCircle className="text-green-500" />;
    if (status === 'rejected') return <FiXCircle className="text-red-500" />;
    return <FiClock className="text-yellow-500" />;
  };

  const stats = {
    total: payments.length,
    pending: payments.filter(p => p.status === 'pending').length,
    confirmed: payments.filter(p => p.status === 'confirmed').length,
    rejected: payments.filter(p => p.status === 'rejected').length
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-colors">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Payment Verifications</h1>
          <button
            onClick={fetchPayments}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors w-full sm:w-auto justify-center"
          >
            <FiRefreshCw className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border-l-4 border-blue-500">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-semibold">Total Submissions</h3>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border-l-4 border-yellow-500">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-semibold">Pending Verification</h3>
            <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border-l-4 border-green-500">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-semibold">Confirmed</h3>
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
            Confirmed ({stats.confirmed})
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
            All Submissions ({stats.total})
          </button>
        </div>

        {/* Payments List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading payments...</p>
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No payment submissions found</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredPayments.map((payment) => (
              <div key={payment._id} className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 border-l-4 border-indigo-500 hover:shadow-xl transition-shadow">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="flex-1 w-full">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getStatusIcon(payment.status)}</span>
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Payment for: {payment.project?.title || 'Unknown Project'}</h3>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border inline-block ${getStatusBadge(payment.status)}`}>
                        {payment.status.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-indigo-600 dark:text-indigo-400 font-bold text-lg mb-4">Amount: ₹{payment.amount?.toLocaleString()} (Phase {payment.phase})</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-400">Client Info:</span>
                        <p className="text-gray-900 dark:text-gray-200">{payment.client?.companyName} ({payment.client?.userName})</p>
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-400">Method:</span>
                        <p className="text-gray-900 dark:text-gray-200 font-medium">{payment.paymentMethod}</p>
                      </div>
                      <div className='col-span-2'>
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-400">UTR / Transaction No:</span>
                        <p className="text-gray-900 dark:text-gray-200 font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 inline-block rounded border border-gray-200 dark:border-gray-600">{payment.utrNumber}</p>
                      </div>
                    </div>

                    {payment.adminComment && (
                      <div className={`mt-4 p-4 rounded-lg bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500`}>
                        <p className="font-semibold text-sm mb-1 dark:text-gray-200 flex items-center gap-2"><FiFileText /> Rejection Reason:</p>
                        <p className="text-gray-700 dark:text-gray-300">{payment.adminComment}</p>
                      </div>
                    )}

                    <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
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
                    <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0 w-full sm:w-auto">
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
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4 dark:text-white flex items-center gap-2">
                {actionType === 'confirm' ? <><FiCheckCircle className="text-green-500"/> Confirm Payment</> : <><FiXCircle className="text-red-500"/> Reject Payment</>}
              </h2>

              <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 dark:text-white">Project: {selectedPayment.project?.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-2">Phase: <span className="font-semibold">{selectedPayment.phase}</span></p>
                <p className="text-indigo-600 dark:text-indigo-400 text-xl font-bold mb-2">Amount: ₹{selectedPayment.amount?.toLocaleString()}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  <span className="font-semibold">Client:</span> {selectedPayment.client?.userName} ({selectedPayment.client?.companyName})
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">UTR / Trans No:</span> <span className="font-mono bg-white dark:bg-gray-600 dark:text-white px-1 border dark:border-gray-500 rounded">{selectedPayment.utrNumber}</span>
                </p>
              </div>

              {actionType === 'confirm' && (
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded border border-blue-200 dark:border-blue-800 text-sm">
                  Confirming this payment will mark the project phase as fully paid and automatically send an email receipt to the client. Ensure the UTR has been verified in your bank statement.
                </div>
              )}

              {actionType === 'reject' && (
                <div className="mb-4">
                  <label className="block font-semibold mb-2 text-gray-700 dark:text-gray-200">
                    Rejection Reason (required - will be emailed to client):
                  </label>
                  <textarea
                    className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg p-3 h-24 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                  className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-4 py-3 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 font-semibold transition-colors"
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
