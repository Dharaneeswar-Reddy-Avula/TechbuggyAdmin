import React, { useState } from "react";
import { useParams } from "react-router-dom";

const Addquestion = () => {
  const { quizId } = useParams();
  const [questions, setQuestions] = useState([]);
  // Initialize currentQuestion as an object with empty properties
  const [currentQuestion, setCurrentQuestion] = useState({
    question: "",
    options: ["", "", "", ""], // Assuming 4 options
    correctAnswer: ""
  });

  // Handle changes to the question text input
  const handleQuestionChange = (value) => {
    setCurrentQuestion({
      ...currentQuestion,
      question: value,
    });
  };

  // Handle changes to the option inputs
  const handleOptionChange = (index, value) => {
    const updatedOptions = [...currentQuestion.options];
    updatedOptions[index] = value;
    setCurrentQuestion({
      ...currentQuestion,
      options: updatedOptions,
    });
  };

  // Handle changes to the correct answer input
  const handleCorrectAnswerChange = (value) => {
    setCurrentQuestion({
      ...currentQuestion,
      correctAnswer: value,
    });
  };

  // Handle adding the current question to the list of questions
  const handleNextQuestion = () => {
    if (currentQuestion.question.trim()) {
      setQuestions([...questions, currentQuestion]);
      setCurrentQuestion({
        question: "",
        options: ["", "", "", ""],
        correctAnswer: "",
      });
    }
  };

  // Handle quiz submission
  const handleSubmit = async () => {
    try {
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

      const response = await fetch(`http://localhost:8009/api/tests/addquestion/${quizId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to submit: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Success:", data);
    } catch (error) {
      console.error("Error submitting quiz:", error.message);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add a Question</h2>

      {/* Current Question Input */}
      <div className="border p-4 mb-4 rounded-md shadow-md">
        <input
          type="text"
          placeholder="Enter your question"
          className="border p-2 w-full mb-2"
          value={currentQuestion.question}
          onChange={(e) => handleQuestionChange(e.target.value)}
        />

        {/* Options Inputs */}
        {currentQuestion.options.map((option, optIndex) => (
          <input
            key={optIndex}
            type="text"
            placeholder={`Option ${optIndex + 1}`}
            className="border p-2 w-full mb-2"
            value={option}
            onChange={(e) => handleOptionChange(optIndex, e.target.value)}
          />
        ))}

        {/* Correct Answer Input */}
        <input
          type="text"
          placeholder="Correct Answer"
          className="border p-2 w-full mb-2"
          value={currentQuestion.correctAnswer}
          onChange={(e) => handleCorrectAnswerChange(e.target.value)}
        />
      </div>

      {/* Previously Added Questions List */}
      {questions.map((q, qIndex) => (
        <div key={qIndex} className="border p-4 mb-4 rounded-md shadow-md">
          <p className="font-semibold">Q{qIndex + 1}: {q.question}</p>
          <ul>
            {q.options.map((option, index) => (
              <li key={index}>- {option}</li>
            ))}
          </ul>
          <p className="text-green-600">Correct Answer: {q.correctAnswer}</p>
        </div>
      ))}

      {/* Buttons */}
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
        onClick={handleNextQuestion}
      >
        Next Question
      </button>

      <button
        className="bg-green-500 text-white px-4 py-2 rounded-md"
        onClick={handleSubmit}
      >
        Submit Quiz
      </button>
    </div>
  );
};

export default Addquestion;
