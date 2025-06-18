import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateQuiz = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [time, setTime] = useState(""); // ⏱️ New time state
  const [loading, setLoading] = useState(false);

  const handleCreateQuiz = async () => {
    if (!title || !description || !category || !time) {
      alert("All fields are required!");
      return;
    }

    if (isNaN(time) || Number(time) <= 0) {
      alert("Please enter a valid time in minutes.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8009/api/tests/createquiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ title, category, description, time }), // 🧩 Include time
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
  <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
    <div className="bg-gradient-to-br from-blue-500 to-blue-800 dark:from-blue-600 dark:to-blue-900 p-8 rounded-2xl shadow-2xl w-[450px] text-white">
      <h2 className="text-3xl font-extrabold mb-6 text-center">Create a Quiz</h2>

      <input
        type="text"
        placeholder="Quiz Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-4 py-3 mb-4 rounded-lg text-black dark:text-white dark:bg-gray-800 dark:placeholder-gray-400 outline-none shadow-md focus:ring-2 focus:ring-blue-300"
      />

      <select
        className="w-full px-4 py-3 mb-4 rounded-lg text-black dark:text-white dark:bg-gray-800 dark:placeholder-gray-400 outline-none shadow-md focus:ring-2 focus:ring-blue-300"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">Select Category</option>
        <option value="science">Science</option>
        <option value="math">Math</option>
        <option value="history">History</option>
        <option value="technology">Technology</option>
        <option value="sports">Sports</option>
      </select>

      <textarea
        placeholder="Quiz Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full px-4 py-3 mb-4 rounded-lg text-black dark:text-white dark:bg-gray-800 dark:placeholder-gray-400 outline-none shadow-md focus:ring-2 focus:ring-blue-300"
      ></textarea>

      <input
        type="number"
        placeholder="Time in minutes"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        className="w-full px-4 py-3 mb-4 rounded-lg text-black dark:text-white dark:bg-gray-800 dark:placeholder-gray-400 outline-none shadow-md focus:ring-2 focus:ring-blue-300"
      />

      <button
        className={`w-full font-semibold px-6 py-3 rounded-lg shadow-lg transition-all duration-300 transform ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-white text-blue-700 hover:bg-blue-700 hover:text-white hover:scale-105 active:scale-95 dark:bg-gray-100 dark:text-blue-800 dark:hover:bg-blue-600 dark:hover:text-white"
        }`}
        onClick={handleCreateQuiz}
        disabled={loading || !title || !category || !description || !time}
      >
        {loading ? "Creating..." : "Create Quiz"}
      </button>
    </div>
  </div>
);
}

export default CreateQuiz;
