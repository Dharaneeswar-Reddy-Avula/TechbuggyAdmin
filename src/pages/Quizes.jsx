import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Quizes = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true); // 👈 loading state

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get("http://localhost:8009/api/tests/getTests");
        setQuizzes(response.data);
      } catch (error) {
        console.error("Failed to fetch quizzes", error);
      } finally {
        setLoading(false); // ✅ stop loading
      }
    };

    fetchQuizzes();
  }, []);

  const groupedByCategory = quizzes.reduce((acc, quiz) => {
    acc[quiz.category] = acc[quiz.category] || [];
    acc[quiz.category].push(quiz);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-6xl mx-auto bg-gradient-to-br from-blue-500 to-blue-800 dark:from-blue-700 dark:to-blue-900 p-8 rounded-2xl shadow-2xl">
        <h1 className="text-4xl font-extrabold text-white mb-6 text-center">
          Admin Quiz Panel
        </h1>

        <div className="text-center mb-8">
          <button
            className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 hover:bg-blue-700 hover:text-white dark:bg-gray-100 dark:hover:bg-blue-600 dark:hover:text-white"
            onClick={() => navigate("/createquiz")}
          >
            Create Quiz
          </button>
        </div>

        {Object.keys(groupedByCategory).map((category) => (
          <div key={category} className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-1">
              {category}
            </h2>
            <p className="text-white mb-4 text-sm font-medium">
              Total Quizzes: {groupedByCategory[category].length}
            </p>

            <div className="flex flex-wrap gap-4">
              {groupedByCategory[category].map((quiz) => (
                <div
                  key={quiz._id}
                  className="bg-white dark:bg-gray-100 w-full sm:w-[48%] md:w-[31%] p-4 rounded-lg shadow-md"
                >
                  <h3 className="text-lg font-semibold">{quiz.title}</h3>
                  <p>{quiz.description}</p>
                  <p className="text-sm text-gray-500">Category: {quiz.category}</p>
                  <p className="text-sm text-gray-500">Time: {quiz.time} mins</p>
                  <button
                    className="mt-2 text-blue-600 hover:underline"
                    onClick={() => navigate(`/getquestion/${quiz._id}`)}
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Quizes;
