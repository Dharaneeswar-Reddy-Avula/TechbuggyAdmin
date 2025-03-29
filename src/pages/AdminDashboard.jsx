import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
const AdminDashboard = () => {
    const navigate = useNavigate();  
  return (
    <div className="flex flex-col items-center justify-center h-screen">
    <h1 className="text-3xl font-bold mb-4">Admin Quiz Panel</h1>
    <Link to="/quizes/create-quiz"> {/* ✅ Absolute Path */}
<button className="bg-blue-500 text-white px-4 py-2 rounded-md">
Create Quiz
</button>
</Link>

</div>
   
  )
}

export default AdminDashboard
