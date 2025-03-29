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
import ProtectedRoute from './Components/protectedRoute/ProtectedRoute';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<AdminLogin/>}/>

      </Routes>
      <ProtectedRoute>
      <Layout>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/quizes" element={<Quizes />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/users" element={<Users />} />
          <Route path="/complaint" element={<Complaints />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/subscription" element={<Subscription />} />
        </Routes>
      </Layout>
      </ProtectedRoute>
    </Router>
  );
};

export default App;