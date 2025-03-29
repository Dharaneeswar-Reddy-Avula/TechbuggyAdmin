import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import AdminDashboard from './AdminDashboard';
import CreateQuiz from './CreateQuiz';
const Quizes = () => {
    return (
      <>
      <div>Hello</div>
      {/* <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/create-quiz" element={<CreateQuiz />} />
     </Routes> */}
      </>
    );
};

export default Quizes;
