// AdminPanel.jsx
import React, { useState } from 'react';
import Layout from '../Components/Layout';

const AdminPanel = () => {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 font-sans text-black dark:text-white">
      <Layout>
        <main className="flex-1 ml-64 mt-16 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
                {/* Heading text if needed */}
              </h1>
              <div className="space-y-6">
                {/* Sample Content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-indigo-50 dark:bg-indigo-900 p-6 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Total Revenue</h3>
                    <p className="text-3xl font-bold text-indigo-700 dark:text-indigo-300 mt-2">$24,500</p>
                  </div>
                  <div className="bg-indigo-50 dark:bg-indigo-900 p-6 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Active Users</h3>
                    <p className="text-3xl font-bold text-indigo-700 dark:text-indigo-300 mt-2">1,234</p>
                  </div>
                  <div className="bg-indigo-50 dark:bg-indigo-900 p-6 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Projects</h3>
                    <p className="text-3xl font-bold text-indigo-700 dark:text-indigo-300 mt-2">89</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </Layout>
    </div>
  );
};

export default AdminPanel;
