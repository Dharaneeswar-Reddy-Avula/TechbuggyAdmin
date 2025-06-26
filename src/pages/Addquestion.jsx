import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";

const Addquestion = () => {
  const { quizId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    image: null,
  });

  const handleQuestionChange = (value) => {
    setCurrentQuestion({ ...currentQuestion, question: value });
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...currentQuestion.options];
    updatedOptions[index] = value;
    setCurrentQuestion({ ...currentQuestion, options: updatedOptions });
  };

  const handleCorrectAnswerChange = (selectedOption) => {
    setCurrentQuestion((prev) => ({
      ...prev,
      correctAnswer: selectedOption.trim(),
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentQuestion((prev) => ({
          ...prev,
          image: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNextQuestion = () => {
    if (
      currentQuestion.question.trim() &&
      currentQuestion.options.every((opt) => opt.trim() !== "") &&
      currentQuestion.correctAnswer
    ) {
      setQuestions([...questions, currentQuestion]);
      setCurrentQuestion({
        question: "",
        options: ["", "", "", ""],
        correctAnswer: "",
        image: null,
      });
    } else {
      alert("Please complete the question, all options, and select the correct answer.");
    }
  };

  const handleDelete = async (questionIndex) => {
    try {
      await axios.put(
        `https://backteg.onrender.com/api/tests/deletequestion/${quizId}?deleteIndex=${questionIndex}`
      );
    } catch (error) {
      console.warn("Backend delete failed (ignored for local delete):", error.message);
    }

    setQuestions((prev) => prev.filter((_, index) => index !== questionIndex));
  };

  const handleEdit = (index) => {
    setCurrentQuestion(questions[index]);
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const isValid =
      currentQuestion.question.trim() &&
      currentQuestion.options.every((opt) => opt.trim() !== "") &&
      currentQuestion.correctAnswer.trim();

    const finalQuestions = [...questions];

    if (isValid) {
      finalQuestions.push({ ...currentQuestion });
    }

    if (!quizId || finalQuestions.length === 0) {
      alert("No valid questions to submit.");
      return;
    }

    try {
      const res = await fetch(
        `https://backteg.onrender.com/api/tests/addquestion/${quizId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quizId, questions: finalQuestions }),
        }
      );
     

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to submit quiz.");
      }

      alert("Quiz submitted successfully!");
      setQuestions([]);
      setCurrentQuestion({ question: "", options: ["", "", "", ""], correctAnswer: "", image: null });
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  return (
    <div className="min-h-screen px-4 py-10 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-8 text-center">Add Questions</h2>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg mb-10">
          <input
            type="text"
            placeholder="Enter your question"
            value={currentQuestion.question}
            onChange={(e) => handleQuestionChange(e.target.value)}
            className="w-full p-3 mb-5 rounded-lg border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
          />

          {currentQuestion.options.map((option, index) => {
            const isCorrect = currentQuestion.correctAnswer === option;
            return (
              <div key={index} className="flex items-center gap-4 mb-4">
                <input
                  type="text"
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="flex-grow p-3 rounded-lg border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <button
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    isCorrect ? "bg-green-600 text-white" : "bg-gray-300 text-gray-800"
                  }`}
                  onClick={() => handleCorrectAnswerChange(option)}
                >
                  {isCorrect ? "Correct" : "Mark"}
                </button>
              </div>
            );
          })}

          <div className="mb-4">
            <label className="font-medium">Attach Image (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-2 block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:bg-blue-100 file:text-blue-700
              hover:file:bg-blue-200"
            />
            {currentQuestion.image && (
              <img
                src={currentQuestion.image}
                alt="Preview"
                className="mt-3 max-h-48 rounded-lg shadow-md"
              />
            )}
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={handleNextQuestion}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-all"
            >
              Add Another
            </button>
            <button
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg transition-all"
            >
              Submit Quiz
            </button>
          </div>
        </div>

        {/* Question Preview List */}
        {questions.length > 0 && (
          <div className="space-y-5">
            {questions.map((q, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 rounded-xl shadow-md flex justify-between items-start"
              >
                <div className="w-full">
                  <h3 className="font-bold mb-2 text-lg">Q{index + 1}: {q.question}</h3>
                  {q.image && (
                    <img
                      src={q.image}
                      alt="Question Visual"
                      className="mb-3 rounded-lg max-h-40"
                    />
                  )}
                  <ul className="list-disc ml-6 text-sm space-y-1">
                    {q.options.map((opt, i) => (
                      <li
                        key={i}
                        className={`${
                          opt === q.correctAnswer
                            ? "text-green-600 dark:text-green-400 font-medium"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {opt}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col gap-3 pl-4">
                  <button
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                    onClick={() => handleEdit(index)}
                    title="Edit"
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800 dark:text-red-400"
                    onClick={() => handleDelete(index)}
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Addquestion;
