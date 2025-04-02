// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Components/Layout';
import Dashboard from './pages/Dashboard';
import Quizes from './pages/Quizes';
import Plans from './pages/Plans';
import Notifications from './pages/Notifications';
import Users from './pages/Users';
import Complaints from './pages/Complaints';
import Subscription from './pages/Subscription';
import AdminLogin from './pages/loginPage/Login';
import AdminRegister from './pages/registerPage/Register';
import Page404 from './Components/Page404';
import ProtectedRoute from './Components/protectedRoute/ProtectedRoute';
const App = () => {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<AdminLogin />} />
      <Route path="/register" element={<AdminRegister />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/quizes"
        element={
          <ProtectedRoute>
            <Layout>
              <Quizes />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/plans"
        element={
          <ProtectedRoute>
            <Layout>
              <Plans />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <Layout>
              <Users />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/complaint"
        element={
          <ProtectedRoute>
            <Layout>
              <Complaints />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Layout>
              <Notifications />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/subscription"
        element={
          <ProtectedRoute>
            <Layout>
              <Subscription />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Page404 />} />
    </Routes>
  </Router>
  );
};

export default App;