import React,{ useState } from 'react'
import { Link } from "react-router-dom";
const CreateQuiz = () => {
   const [quiz, setQuiz] = useState({
          title: "",
          category: "", 
          description: "",
          questions: [{ question: "", options: ["", "", "", ""], correctAnswer: "" }]
      });
  
      const handleChange = (e, index, field) => {
          const updatedQuestions = [...quiz.questions];
          if (field === "question") {
              updatedQuestions[index].question = e.target.value;
          } else if (field === "correctAnswer") {
              updatedQuestions[index].correctAnswer = e.target.value;
          } else {
              updatedQuestions[index].options[field] = e.target.value;
          }
          setQuiz({ ...quiz, questions: updatedQuestions });
      };
  
      const addQuestion = () => {
          setQuiz({
              ...quiz,
              questions: [...quiz.questions, { question: "", options: ["", "", "", ""], correctAnswer: "" }]
          });
      };
  
      return (
          <div className="p-6 max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-4">Create a Quiz</h2>
              <input 
                  type="text" 
                  placeholder="Quiz Title" 
                  className="border p-2 w-full mb-2" 
                  onChange={(e) => setQuiz({ ...quiz, title: e.target.value })} 
              />
              <input 
                  type="text" 
                  placeholder="Category" 
                  className="border p-2 w-full mb-2" 
                  onChange={(e) => setQuiz({ ...quiz, category: e.target.value })} 
              />
              <textarea 
                  placeholder="Quiz Description" 
                  className="border p-2 w-full mb-2" 
                  onChange={(e) => setQuiz({ ...quiz, description: e.target.value })} 
              />
              {quiz.questions.map((q, index) => (
                  <div key={index} className="border p-4 mb-4">
                      <input 
                          type="text" 
                          placeholder="Question" 
                          className="border p-2 w-full mb-2" 
                          onChange={(e) => handleChange(e, index, "question")} 
                      />
                      {q.options.map((option, i) => (
                          <input 
                              key={i} 
                              type="text" 
                              placeholder={`Option ${i + 1}`} 
                              className="border p-2 w-full mb-2" 
                              onChange={(e) => handleChange(e, index, i)} 
                          />
                      ))}
                      <input 
                          type="text" 
                          placeholder="Correct Answer" 
                          className="border p-2 w-full mb-2" 
                          onChange={(e) => handleChange(e, index, "correctAnswer")} 
                      />
                  </div>
              ))}
              <button className="bg-green-500 text-white px-4 py-2 rounded-md mb-2" onClick={addQuestion}>
                  Add Question
              </button>
          </div>
      );
}

export default CreateQuiz
