import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom'
const CreateQuiz = () => {
    const navigate=useNavigate()
    const [title,setTitle]=useState("");
    const [description,setDescription]=useState("");
    const[category,setCategory]=useState("");
    const[loading,setLoading]=useState("");
    const handleCreateQuiz=async()=>{
      if(!title||!description||!category){
        alert("All fields are required!");
        return;
      }
      setLoading(true);
      try{
        console.log("going to try block")
        const response=await  fetch("http://localhost:8009/api/tests/createquiz",{
          method:"POST",
          headers:{
            "Content-Type":"application/json",
          },
          credentials:"include",
          body:JSON.stringify({title,category,description}),
        });
        
        const data=await response.json();
        if(response.ok){
          alert("Quiz created successfully!");
          const quizId=data.quizId;
          navigate(`/addquestion/${quizId}`);
        }else{
          alert(`Failed to create quiz:${data.message}`);
        }
      }catch(error){
        alert("Failed to create quiz.Please try again");
        console.error("Error",error);
      }finally{
        setLoading(false);
      }
     
    }
  return (
    <div className="p-6 max-w-3xl mx-auto">
    <h2 className="text-2xl font-bold mb-4">Create a Quiz</h2>
    <input type="text" placeholder="Quiz Title" value={title} onChange={(e)=>setTitle(e.target.value)} className="border p-2 w-full mb-2" />
    <select className="border p-2 w-full mb-2"value={category}
        onChange={(e) => setCategory(e.target.value)}>
        <option value="">Select Category</option>
        <option value="science">Science</option>
        <option value="math">Math</option>
        <option value="history">History</option>
        <option value="technology">Technology</option>
        <option value="sports">Sports</option>
    </select>
    <textarea placeholder="Quiz Description"  value={description}
        onChange={(e) => setDescription(e.target.value)} className="border p-2 w-full mb-2" />
    <button className="bg-green-500 text-white px-4 py-2 rounded-md"onClick={handleCreateQuiz} disabled={!title||!category||!description}>{loading ? "Creating..." : "Create Quiz"}</button>
    </div>
  )
}

export default CreateQuiz
