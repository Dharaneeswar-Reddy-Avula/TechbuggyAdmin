import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react"; // Optional: Lucide icon

const CreateQuiz = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [category, setCategory] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateQuiz = async () => {
    if (!title || !description || !instructions || !category || !time) {
      alert("All fields are required!");
      return;
    }

    if (isNaN(time) || Number(time) <= 0) {
      alert("Please enter a valid time in minutes.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("https://backteg.onrender.com/api/tests/createquiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ title, category, description, time, instructions }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Quiz created successfully!");
        const quizId = data.quizId;
        navigate(`/addquestion/${quizId}`);
      } else {
        alert(`Failed to create quiz: ${data.message}`);
      }
    } catch (error) {
      alert("Failed to create quiz. Please try again.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center transition-colors duration-500">
      <div className="bg-white dark:bg-gray-900 p-10 rounded-3xl shadow-2xl w-full max-w-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center gap-2 mb-6">
          <PlusCircle className="text-blue-600 dark:text-blue-400" size={30} />
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Create New Quiz</h2>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Quiz Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Category</option>
            <option value="science">Science</option>
            <option value="math">Math</option>
            <option value="history">History</option>
            <option value="technology">Technology</option>
            <option value="sports">Sports</option>
          </select>

          <textarea
            rows={3}
            placeholder="Quiz Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>

          <textarea
            rows={3}
            placeholder="Quiz Instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>

          <input
            type="number"
            placeholder="Time in minutes"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={handleCreateQuiz}
            disabled={loading || !title || !category || !description || !instructions || !time}
            className={`w-full py-3 mt-4 text-lg font-semibold rounded-xl transition-all duration-300 ${
              loading
                ? "bg-blue-300 cursor-not-allowed text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 active:scale-95"
            }`}
          >
            {loading ? "Creating..." : "Create Quiz"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateQuiz;
