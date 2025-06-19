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
        image: reader.result, // base64 string
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
      });
    } else {
      alert("Please complete the question, all options, and select the correct answer.");
    }
  };

  const handleDelete = async (questionIndex) => {
    const questionToDelete = questions[questionIndex];

    try {
      await axios.put(
        `http://localhost:8009/api/tests/deletequestion/${quizId}?deleteIndex=${questionIndex}`
      );
    } catch (error) {
      console.warn("Backend delete failed (ignored for local delete):", error.message);
    }

    setQuestions((prev) =>
      prev.filter((_, index) => index !== questionIndex)
    );
  };


  const handleEdit = (index) => {
    setCurrentQuestion(questions[index]);
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!quizId) {
      alert("Quiz ID is missing. Cannot submit.");
      return;
    }

    const trimmedOptions = currentQuestion.options.map((opt) => opt.trim());
    const isCurrentQuestionValid =
      currentQuestion.question.trim() !== "" &&
      trimmedOptions.every((opt) => opt !== "") &&
      trimmedOptions.includes(currentQuestion.correctAnswer.trim());

    const finalQuestions = [...questions];

    if (isCurrentQuestionValid) {
      finalQuestions.push({
        ...currentQuestion,
        options: trimmedOptions,
      });
    }

    if (finalQuestions.length === 0) {
      alert("No valid questions to submit.");
      return;
    }

    const payload = { quizId, questions: finalQuestions };

    try {
      const response = await fetch(
        `http://localhost:8009/api/tests/addquestion/${quizId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("Server error:", errorResponse);
        throw new Error(errorResponse.message || "Failed to submit quiz");
      }

      alert("Quiz submitted successfully!");

      setQuestions([]);
      setCurrentQuestion({ question: "", options: ["", "", "", ""], correctAnswer: "" });
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto text-black dark:text-white dark:bg-gray-900 transition-colors duration-300 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">Add a Question</h2>

      <div className="bg-gradient-to-r from-blue-500 to-blue-800 dark:from-blue-600 dark:to-blue-900 text-white p-6 rounded-lg shadow-lg mb-6">
        <input
          type="text"
          placeholder="Enter your question"
          className="p-2 w-full mb-4 rounded-md text-black dark:text-white dark:bg-gray-800 dark:placeholder-gray-400"
          value={currentQuestion.question}
          onChange={(e) => handleQuestionChange(e.target.value)}
        />

        {currentQuestion.options.map((option, index) => {
          const isCorrect = currentQuestion.correctAnswer === option;
          return (
            <div
              key={index}
              className={`relative flex items-center gap-3 mb-3 border-2 rounded-md p-2 ${
                isCorrect ? "border-green-500 bg-green-50 dark:bg-green-900" : "border-transparent"
              }`}
            >
              <input
                type="text"
                placeholder={`Option ${index + 1}`}
                className="flex-grow p-2 rounded-md text-black dark:text-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
              />
              <div
                className={`w-5 h-5 border-2 rounded-sm cursor-pointer ${
                  isCorrect
                    ? "bg-green-500 border-green-700"
                    : "border-white dark:border-gray-400"
                }`}
                onClick={() => handleCorrectAnswerChange(option)}
              ></div>
            </div>
          );
        })}
        {/* Image Upload Section */}
<div className="mb-4">
  <label className="block mb-1 font-semibold">Attach Image (optional)</label>
  <input
    type="file"
    accept="image/*"
    onChange={handleImageChange}
    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
      file:rounded-md file:border-0
      file:text-sm file:font-semibold
      file:bg-blue-50 file:text-blue-700
      hover:file:bg-blue-100"
  />
  {currentQuestion.image && (
    <img
      src={currentQuestion.image}
      alt="Question Preview"
      className="mt-2 rounded-md max-h-40"
    />
  )}
</div>


        <div className="flex justify-end gap-4 mt-4">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            onClick={handleNextQuestion}
          >
            Next Question
          </button>
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
            onClick={handleSubmit}
          >
            Submit Quiz
          </button>
        </div>
      </div>

      <div className="mt-6">
        {questions.map((q, qIndex) => (
          <div
            key={qIndex}
            className="flex items-start justify-between bg-white dark:bg-gray-800 shadow-md p-4 rounded-lg mb-3"
          >
            <div>
              <p className="font-semibold">Q{qIndex + 1}: {q.question}</p>
              {q.image && (
        <img
          src={q.image}
          alt={`Q${qIndex + 1} Preview`}
          className="my-2 rounded-md max-h-40"
        />
      )}
              <ul className="list-disc ml-5 text-gray-600 dark:text-gray-300">
                {q.options.map((opt, i) => (
                  <li
                    key={i}
                    className={`${
                      opt === q.correctAnswer ? "text-green-600 font-bold dark:text-green-400" : ""
                    }`}
                  >
                    {opt}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-2">
              <button
                className="text-blue-600 dark:text-blue-400"
                onClick={() => handleEdit(qIndex)}
              >
                <FaEdit />
              </button>
              <button
                className="text-red-600 dark:text-red-400"
                onClick={() => handleDelete(qIndex)}
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Addquestion;