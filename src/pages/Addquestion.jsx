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
  });

  const handleQuestionChange = (value) => {
    setCurrentQuestion({ ...currentQuestion, question: value });
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...currentQuestion.options];
    updatedOptions[index] = value;
    setCurrentQuestion({ ...currentQuestion, options: updatedOptions });
  };

  const handleCorrectAnswerChange = (value) => {
    setCurrentQuestion({ ...currentQuestion, correctAnswer: value });
  };

  const handleNextQuestion = () => {
    if (currentQuestion.question.trim()) {
      setQuestions([...questions, currentQuestion]);
      setCurrentQuestion({ question: "", options: ["", "", "", ""], correctAnswer: "" });
    }
  };

  const handleDelete = async (questionIndex) => {
    console.log(questionIndex);
    try {
      const response = await axios.put(
        `http://localhost:8009/api/tests/deletequestion/${quizId}?deleteIndex=${questionIndex}`
      );

      if (response.status === 200) {
        setQuestions((prevQuestions) =>
          prevQuestions.filter((_, index) => index !== questionIndex)
        );
      }
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  const handleEdit = (index) => {
    setCurrentQuestion(questions[index]);
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    console.log("Quiz ID:", quizId);

    if (!quizId) {
      alert("Quiz ID is missing. Cannot submit.");
      return;
    }

    const trimmedOptions = currentQuestion.options.map((opt) => opt.trim());
    const isCurrentQuestionValid =
      currentQuestion.question.trim() !== "" &&
      trimmedOptions.every((opt) => opt !== "") &&
      trimmedOptions.includes(currentQuestion.correctAnswer.trim());

    const finalQuestions = isCurrentQuestionValid
      ? [...questions, currentQuestion]
      : [...questions];

    if (finalQuestions.length === 0) {
      alert("No valid questions to submit");
      return;
    }

    const payload = { quizId, questions: finalQuestions };

    console.log("Payload being sent:", JSON.stringify(payload, null, 2));

    try {
      const response = await fetch(`http://localhost:8009/api/tests/addquestion/${quizId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("Server error:", errorResponse);
        throw new Error(errorResponse.message || "Failed to submit quiz");
      }

      alert("Quiz submitted successfully!");
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto text-black dark:text-white">
      <h2 className="text-3xl font-bold mb-6">Add a Question</h2>
      <div className="bg-gradient-to-r from-blue-500 to-blue-800 dark:from-blue-900 dark:to-blue-700 text-white p-6 rounded-lg shadow-lg">
        <input
          type="text"
          placeholder="Enter your question"
          className="p-2 w-full mb-2 rounded-md text-black dark:text-white dark:bg-gray-800"
          value={currentQuestion.question}
          onChange={(e) => handleQuestionChange(e.target.value)}
        />
        {currentQuestion.options.map((option, optIndex) => (
          <input
            key={optIndex}
            type="text"
            placeholder={`Option ${optIndex + 1}`}
            className="p-2 w-full mb-2 rounded-md text-black dark:text-white dark:bg-gray-800"
            value={option}
            onChange={(e) => handleOptionChange(optIndex, e.target.value)}
          />
        ))}
        <input
          type="text"
          placeholder="Correct Answer"
          className="p-2 w-full mb-2 rounded-md text-black dark:text-white dark:bg-gray-800"
          value={currentQuestion.correctAnswer}
          onChange={(e) => handleCorrectAnswerChange(e.target.value)}
        />
      </div>

      <div className="mt-6">
        {questions.map((q, qIndex) => (
          <div
            key={qIndex}
            className="flex items-center justify-between bg-white dark:bg-gray-800 shadow-md p-4 rounded-lg mb-3"
          >
            <div>
              <p className="font-semibold">Q{qIndex + 1}: {q.question}</p>
              <p className="text-gray-600 dark:text-gray-300">
                Correct Answer: {q.correctAnswer}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                className="text-blue-500 dark:text-blue-300"
                onClick={() => {
                  console.log("Delete button clicked for index:", qIndex);
                  handleEdit(qIndex);
                }}
              >
                <FaEdit />
              </button>
              <button
                className="text-red-500 dark:text-red-400"
                onClick={() => handleDelete(qIndex)}
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <button
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white px-4 py-2 rounded-md"
          onClick={handleNextQuestion}
        >
          Next Question
        </button>
        <button
          className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white px-4 py-2 rounded-md"
          onClick={handleSubmit}
        >
          Submit Quiz
        </button>
      </div>
    </div>
  );
};

export default Addquestion;
