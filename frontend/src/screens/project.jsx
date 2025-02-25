/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const Project = () => {
  const location = useLocation();

const [isSidePanelOpen, setIsSidePanelOpen]=useState(false)

  console.log(location.state);

  return (
    <main className="h-screen w-screen overflow-x-hidden overflow-y-auto flex bg-gray-200">
      <section className="left flex flex-col h-full w-full min-w-4=8 max-w-lg bg-slate-300 shadow-lg relative">


        {/* Header */}
        <header className="flex justify-between items-center p-3 px-4 bg-slate-100">

          <h2 className="text-lg font-semibold">Chat</h2>

          <button 
          onClick={()=>setIsSidePanelOpen(!isSidePanelOpen)}
          className="p-2 px-2 text-xl ">
            <i className="ri-group-fill  "></i>
          </button>
        </header>

     
     
     {/* Conversation Area */}
<div className="conversation-area flex-grow flex flex-col p-4 space-y-2 overflow-y-auto">
  

  {/* Incoming Message (Other User) */}
  <div className="message-box flex flex-col items-start">
    <div className="incoming message bg-white text-black p-2 rounded-lg max-w-[75%] shadow-md">
      <small className="text-gray-500">exam@gmail.com</small>
      <p>Lorem ipsum dolor sit amet.</p>
    </div>
  </div>
{/* 
  Outgoing Message (Current User) */}
  <div className="message-box flex flex-col items-end">
    <div className="outgoing message bg-blue-600 text-white p-3 rounded-lg max-w-[75%] shadow-md">
      <p>Hello! How are you?</p>
    </div>
  </div>

</div>


        {/* Input Field - Inside the Left Column */}
        <div className="inputField flex items-center bg-white border-t border-gray-300 p-2 w-full">
         
          <input
            className="flex-grow p-3 px-4 border border-gray-300 rounded-lg outline-none text-left bg-white"
            type="text"
            placeholder="Enter message..."
          />



          <button className="ml-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            <i className="ri-send-plane-fill"></i>
          </button>
        </div>



        {/* Creating Modal state on collaborators icon */}
        <div className={`sidePanel w-full h-full bg-slate-200 shadow-2xl absolute transition-transform duration-300 ease-in-out ${isSidePanelOpen ? 'translate-x-0' : '-translate-x-full'} top-0 left-0 rounded-r-3xl border border-gray-400`}>
    
    {/* Header Section */}
    <header className="flex justify-between items-center p-4 bg-slate-100 border-b border-gray-400 rounded-tr-3xl shadow-md">
        <h2 className="text-xl font-bold text-gray-700">Collaborators</h2>
        <button 
            onClick={() => setIsSidePanelOpen(!isSidePanelOpen)} 
            className="p-2 hover:bg-gray-300 rounded-full transition-all duration-200"
        >
            <i className="ri-close-large-line text-2xl text-gray-600"></i>
        </button>
    </header>

    {/* User List Container */}
    {/* User List Container */}
<div className="user p-3 space-y-4 overflow-y-auto h-[calc(100%-64px)] custom-scrollbar">
    <div className="p-3 bg-white rounded-xl shadow-lg flex items-center space-x-2 border border-gray-400 hover:scale-105 transition-all duration-200">
        
        {/* User Icon */}
        <i className="ri-user-fill text-2xl text-gray-600"></i>

        {/* Username */}
        <h1 className="font-semibold text-gray-800">Username</h1>
    
    </div>
</div>
</div>


      </section>
    </main>
  );
};

export default Project;
