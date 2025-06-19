import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const API_URL = "https://backteg.onrender.com/api";

const EditQuiz = () => {
  const { quizId } = useParams();

  const [quizTitle, setQuizTitle] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [category, setCategory] = useState("");
  const [time, setTime] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/tests/${quizId}`);
        setQuizTitle(data.title);
        setDescription(data.description);
        setInstructions(data.instructions || "");
        setCategory(data.category);
        setTime(data.time);
        setQuestions(data.questions);
      } catch (err) {
        console.error("Error fetching quiz:", err);
        setError("Failed to load quiz.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  const handleSubmitAll = async () => {
    console.log("going to handle submit")
    console.log(quizId)
    try {
      await axios.put(`${API_URL}/tests/${quizId}/updatetest`, {
        title: quizTitle,
        description,
        instructions,
        category,
        time,
        questions,
      });

      alert("Quiz and all questions updated successfully.");
    } catch (err) {
      console.error("Error updating quiz:", err);
      alert("Failed to update quiz.");
    }
  };

  if (loading) return <p className="text-center mt-10 text-blue-500">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">Edit Quiz</h2>

      {/* Quiz Info */}
      <div className="bg-white p-6 rounded shadow mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Quiz Details</h3>

        <input
          value={quizTitle}
          onChange={(e) => setQuizTitle(e.target.value)}
          placeholder="Quiz Title"
          className="w-full p-2 border rounded mb-3"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full p-2 border rounded mb-3"
        />

        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="Instructions"
          className="w-full p-2 border rounded mb-3"
        />

        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
          className="w-full p-2 border rounded mb-3"
        />

        <input
          type="number"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          placeholder="Time in minutes"
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Questions */}
      {questions.map((q, index) => (
        <div key={q._id} className="bg-white p-6 rounded-lg shadow mb-6">
          <h4 className="text-lg font-bold mb-2 text-gray-800">Question {index + 1}</h4>

          <textarea
            value={q.question}
            onChange={(e) => handleQuestionChange(index, "question", e.target.value)}
            className="w-full p-2 border rounded mb-3"
          />

          {/* Show image if present */}
          {q.image && (
            <img
              src={q.image}
              alt={`Question ${index + 1} image`}
              className="w-full max-w-md mb-3 rounded-lg shadow"
            />
          )}

          <label className="block font-semibold mb-1">Options:</label>
          {q.options.map((opt, optIdx) => (
            <input
              key={optIdx}
              type="text"
              value={opt}
              onChange={(e) => handleOptionChange(index, optIdx, e.target.value)}
              className="w-full p-2 border rounded mb-2"
            />
          ))}

          <label className="block font-semibold mb-1">Correct Answer:</label>
          <input
            type="text"
            value={q.correctAnswer}
            onChange={(e) => handleQuestionChange(index, "correctAnswer", e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
      ))}

      {/* Submit Button */}
      <div className="text-center mt-6">
        <button
          onClick={handleSubmitAll}
          className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg shadow-md"
        >
          Save All Changes
        </button>
      </div>
    </div>
  );
};

export default EditQuiz;
