import React from 'react';

import Dashboard from './pages/Dashboard';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import Quizes from './pages/Quizes';
import Plans from './pages/Plans';
import Notifications from './pages/Notifications';
import Layout from './Components/Layout';
import Users from './pages/Users';
import Complaints from './pages/Complaints';
import Subscription from './pages/Subscription';
import AdminLogin from './pages/loginPage/Login';
import AdminRegister from './pages/registerPage/Register';
const App = () => {
  return (
    <Router>
      
    <Routes>
    <Route path="/login" element={<AdminLogin/>} />
    <Route path="/register" element={<AdminRegister/>} />
      <Route path="/" element={<Layout />}>
        <Route path='dashboard' element={<Dashboard />} />
        <Route path="quizes" element={<Quizes />} />
        <Route path="plans" element={<Plans />} />
        <Route path="users" element={<Users />} />
        <Route path="complaint" element={<Complaints />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="Subscription" element={<Subscription />} /> 
      </Route>
    </Routes>
    </Router>
  );
};

export default App;