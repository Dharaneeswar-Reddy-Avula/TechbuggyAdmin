import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Quizes = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
<<<<<<< HEAD
        const response = await axios.get("https://backteg.onrender.com/api/tests/getTests");
=======
        const response = await axios.get(
          "https://backteg.onrender.com/api/tests/getTests"
        );
>>>>>>> 17043eefd119dc4b5bb0a13860d8a71652215655
        setQuizzes(response.data);
      } catch (error) {
        console.error("Failed to fetch quizzes", error);
      } finally {
        setLoading(false);
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
      <div className="max-w-6xl mx-auto bg-gray-200 dark:bg-gray-800 p-8 rounded-2xl ">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-6 text-center">
          Admin Quiz Panel
        </h1>

        <div className="text-center mb-8">
          <button
            className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 hover:bg-blue-700 hover:text-white dark:bg-gray-200 dark:hover:bg-blue-600 dark:hover:text-white"
            onClick={() => navigate("/createquiz")}
          >
            Create Quiz
          </button>
        </div>

        {Object.keys(groupedByCategory).map((category) => (
          <div key={category} className="mb-10">
            <h2 className="text-2xl font-bold dark:text-white text-black mb-1">
              {category}
            </h2>
            <p className="text-black dark:text-white mb-4 text-sm font-medium">
              Total Quizzes: {groupedByCategory[category].length}
            </p>

            <div className="flex flex-wrap gap-4">
              {groupedByCategory[category].map((quiz) => (
               <div
  key={quiz._id}
  className="relative bg-white/70 dark:bg-gray-900 backdrop-blur-md border border-gray-200 dark:border-gray-700 w-full sm:w-[48%] md:w-[31%] p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
>
  <div className="flex items-start justify-between mb-2">
    <h3 className="text-xl font-bold text-gray-800 dark:text-white">
      {quiz.title}
    </h3>
    <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-full">
      {quiz.time} min
    </span>
  </div>

  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-3">
    {quiz.description}
  </p>

  <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
    Category: <span className="font-medium">{quiz.category}</span>
  </p>

  <button
    className="inline-block px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg transition"
    onClick={() => navigate(`/getquestion/${quiz._id}`)}
  >
    Edit Quiz
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
