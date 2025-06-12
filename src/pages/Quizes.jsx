import React from "react";
import { useNavigate } from "react-router-dom";

const Quizes = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-full">
      <div className="bg-gradient-to-br from-blue-500 to-blue-800 p-8 rounded-2xl shadow-2xl w-[400px] text-center">
        <h1 className="text-4xl font-extrabold text-white mb-6 drop-shadow-lg">
          Admin Quiz Panel
        </h1>

        <button
          className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 hover:bg-blue-700 hover:text-white active:scale-95"
          onClick={() => navigate("/createquiz")}
        >
          Create Quiz
        </button>
      </div>
    </div>
  );
};

export default Quizes;
