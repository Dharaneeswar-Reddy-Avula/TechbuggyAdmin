import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
const Quizes = () => {
  const navigate=useNavigate()
    return (
      <>
       <div className="flex flex-col items-center justify-center h-full">
        <div>
          <h1 className="text-3xl font-bold mb-4">Admin Quiz Panel</h1>
       
       <button className="bg-blue-500 text-white px-4 py-2 rounded-md"onClick={()=>navigate("/createquiz")}>Create Quiz</button>
    
        </div>
      
      </div>
      
      </>
    );
};

export default Quizes;
