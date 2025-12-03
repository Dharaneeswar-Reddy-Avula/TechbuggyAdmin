import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { currentAdmin } from "./store/authSlice";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Components/Layout";
import Dashboard from "./pages/Dashboard";
import Quizes from "./pages/Quizes";
import Plans from "./pages/Plans";
import Notifications from "./pages/Notifications";
import Users from "./pages/Users";
import Complaints from "./pages/Complaints";
import Subscription from "./pages/Subscription";
import AdminLogin from "./pages/loginPage/Login";
import AdminRegister from "./pages/registerPage/Register";
import ForgotPassword from "./pages/loginPage/ForgotPassword";
import Page404 from "./Components/Page404";
import ProtectedRoute from "./Components/protectedRoute/ProtectedRoute";
import CreateQuiz from "./pages/CreateQuiz";
import Addquestion from "./pages/Addquestion";
import { ToastContainer } from "react-toastify";
import Getquestion from "./pages/registerPage/Getquestion";
import "react-toastify/dist/ReactToastify.css";
import Projects from "./pages/Projects";
const App = () => {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      dispatch(currentAdmin());
    }
  }, [token, dispatch]);

  return (
    <Router>
      
      <Routes>
        {/* Public Routes */}

        <Route path="/" element={<AdminLogin />} />
        <Route path="/register" element={<AdminRegister />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="quizes" element={<Quizes />} />
          <Route path="plans" element={<Plans />} />
          <Route path="users" element={<Users />} />
          <Route path="complaint" element={<Complaints />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="subscription" element={<Subscription />} />
          <Route path="createquiz" element={<CreateQuiz />} />
          <Route path="addquestion/:quizId" element={<Addquestion />} />
          <Route path="getquestion/:quizId" element={<Getquestion />} />
       <Route  path="projects" element={<Projects />}/>
        </Route>

        {/* 404 fallback */}
        <Route path="*" element={<Page404 />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        
      />
    </Router>
  );
};

export default App;
