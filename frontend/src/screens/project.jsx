/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useContext, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "../config/axios";
import { initializeSocket, receiveMessage, sendMessage } from "../config/socket";
import { UserContext } from "../context/user.context";
import Markdown from "markdown-to-jsx";
import hljs from "highlight.js";
import "highlight.js/styles/nord.css"; //  Import a style for syntax highlighting

const Project = () => {
  const location = useLocation();
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(new Set());
  const [project, setProject] = useState(location.state.project);
  const [message, setMessage] = useState("");
  const { user } = useContext(UserContext);
  const messageBox = useRef(null);
  const lastMessageRef = useRef(null);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]); //  Store messages

  const handleUserClick = (id) => {
    setSelectedUserId((prevSelectedUserId) => {
      const newSelectedUserId = new Set(prevSelectedUserId);
      if (newSelectedUserId.has(id)) {
        newSelectedUserId.delete(id);
      } else {
        newSelectedUserId.add(id);
      }
      return newSelectedUserId;
    });
  };

  function addCollaborators() {
    axios
      .put("/projects/add-user", {
        projectId: location.state.project._id,
        users: Array.from(selectedUserId),
      })
      .then((res) => {
        console.log(res.data);
        setIsModalOpen(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const send = () => {
    if (!message.trim()) return;

    const newMessage = {
      message,
      sender: user,
    };

    sendMessage("project-message", newMessage);
    setMessages((prevMessages) => [...prevMessages, newMessage]); //  Updating state
    setMessage("");
  };

  useEffect(() => {
    initializeSocket(project._id);

    receiveMessage("project-message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]); //  Updating state
    });

    axios.get(`/projects/get-project/${location.state.project._id}`).then((res) => {
      setProject(res.data.project);
    });

    axios
      .get("/users/all")
      .then((res) => {
        setUsers(res.data.users);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]); //  Scrolls to the latest message


  
  useEffect(() => {
    // Find all code blocks inside AI-generated messages
    document.querySelectorAll(".ai-message pre code").forEach((block) => {
      //  Check if it's already highlighted before re-highlighting
      if (!block.dataset.highlighted) {
        hljs.highlightElement(block);
        block.dataset.highlighted = "true"; //  Mark as highlighted to prevent errors
      }
    });
  }, [messages]);
  
  

  return (
    <main className="h-screen w-screen overflow-x-hidden no-scrollbar custom-scrollbar overflow-y-auto flex bg-gray-200">
      <section className="left flex flex-col h-full w-105 min-w-48 max-w-lg bg-slate-300 shadow-lg relative">
        <header className="flex justify-between items-center p-3 px-4 bg-slate-100">
          <button
            className="flex items-center gap-1 to-5% cursor-pointer font-semibold hover:text-blue-600 transition-all"
            onClick={() => setIsModalOpen(true)}
          >
            <i className="ri-add-large-fill"></i>
            <p className="text-lg items-center">Add collaborators</p>
          </button>

          <button
            onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
            className="p-2 px-2 text-xl cursor-pointer transition-all duration-300 ease-in-out hover:text-blue-600 hover:scale-110"
          >
            <i className="ri-group-fill"></i>
          </button>
        </header>

        <div className="conversation-area flex-grow no-scrollbar flex flex-col p-4 space-y-2 overflow-y-auto">
          <div className="message-container flex flex-col gap-2 w-full p-2 overflow-y-auto h-[80vh]">
            {messages.map((msg, index) => {
              // ✅ Detect if message contains code using triple backticks
              const isCodeMessage = msg.message.includes("```");

              return (
                <div
                  key={index}
                  className={`p-3 rounded-lg shadow-md max-w-[75%] w-fit break-words whitespace-pre-wrap leading-relaxed ${
                    msg.sender.email === user.email
                      ? "ml-auto bg-blue-600 text-white self-end"
                      : "bg-slate-600 text-white self-start"
                  }`}
                >
                  <small
                    className={`block mb-1 text-xs ${
                      msg.sender.email === user.email ? "text-gray-300" : "text-gray-200"
                    }`}
                  >
                    {msg.sender.email}
                  </small>

                  <div className={`max-w-full overflow-x-auto px-2 py-1 no-scrollbar ${isCodeMessage ? "ai-message" : ""}`}>
                    {isCodeMessage ? (
                      <pre>
                        <code className="language-javascript">
                          {msg.message.replace(/```/g, "")}
                        </code>
                      </pre>
                    ) :(() => {
                      try {
                        const parsedMessage = JSON.parse(msg.message);
                        return <Markdown className="text-sm">{parsedMessage.text}</Markdown>;
                      } catch {
                        return <Markdown className="text-sm">{msg.message}</Markdown>;
                      }
                    })()
                  }                    
                    
                  </div>
                </div>
              );
            })}
            <div ref={lastMessageRef} /> {/* Keeps chat scrolled to the latest message */}
          </div>
        </div>

        <div className="inputField flex items-center bg-white border-t border-gray-300 p-2 w-full">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            className="w-full p-2 px-2 border border-gray-300 rounded-lg outline-none 
                text-left bg-white resize-none overflow-y-auto h-12 max-h-16 
                no-scrollbar"
            placeholder="Enter message..."
            rows="2"
          />

          <button
            onClick={send}
            className="ml-2 p-3 bg-blue-600 text-white rounded-lg 
                 hover:bg-blue-700 hover:scale-105 active:scale-95 
                 transition-all duration-200 ease-in-out shadow-md"
          >
            <i className="ri-send-plane-fill"></i>
          </button>
        </div>

        {/* Side Panel for Collaborators */}
        <div
          className={`sidePanel w-full h-full no-scrollbar bg-slate-300 shadow-2xl absolute transition-transform duration-300 ease-in-out ${
            isSidePanelOpen ? "translate-x-0" : "-translate-x-full"
          } top-0 left-0 rounded-r-3xl border border-gray-400`}
        >
          <header className="flex justify-between items-center p-4 bg-slate-50 border-b border-gray-400 rounded-tr-3xl shadow-md">
            <h2 className="text-lg font-bold text-gray-700">Collaborators</h2>
            <button
              onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
              className="p-2 hover:bg-gray-300 rounded-full transition-all duration-200"
            >
              <i className="ri-close-large-line cursor-pointer text-2xl text-gray-600"></i>
            </button>
          </header>

          {/* User List */}
          <div className="users p-3 cursor-pointer space-y-4 overflow-y-auto h-[calc(100%-64px)] custom-scrollbar">
           
        {/* Creating map for users */}
       {project.users && project.users.map((user, index) => {
  return (
    <div
      key={index} // Added key prop
      className="p-3 bg-white rounded-xl shadow-lg flex items-center space-x-2 border border-gray-400 hover:scale-105 transition-all duration-200"
    >
      <i className="ri-user-fill text-2xl text-gray-600"></i>
      <h1 className="font-semibold text-gray-800">{user.email}</h1> {/* Dynamically display user name */}
    </div>
  );
})}

    </div>
      
        </div>
        
      </section>


       {/* Modal for Selecting Users */}
       {isModalOpen && (
        <div className="fixed inset-0 bg-neutral-900/60 backdrop-brightness-75 flex items-center transition-opacity duration-300 justify-center">
        <div className="bg-slate-100 p-4 rounded-md w-96 max-w-full relative">
            <header className="flex justify-between  items-center mb-4">
              <h2 className="text-xl font-semibold ">Select User</h2>
              <button
  onClick={() => setIsModalOpen(false)}
  className="p-2 text-gray-600  rounded-xl transition-all duration-300 ease-in-out hover:text-slate-600 hover:shadow-lg hover:shadow-slate-500 active:scale-90"
>
  <i className="ri-close-fill text-2xl"></i>
</button>


            </header>

            {/* User List in Modal */}
            <div className="users-list flex flex-col gap-2 mb-16 custom-scrollbar max-h-96 overflow-auto">
              {users.map((user) => (
                <div
                  key={user.id}
                  className={`user cursor-pointer hover:bg-slate-200 ${
                   Array.from( selectedUserId).indexOf( user._id)!=-1?'bg-slate-300 rounded':""} ? "bg-slate-200" : ""
                  } p-2 flex gap-2 items-center`}
                  onClick={() => handleUserClick(user._id)}
                >
<div 
  className="aspect-square relative rounded-full w-fit h-fit flex items-center justify-center   p-5 text-white bg-slate-600 shadow-md transition-all duration-300  hover:bg-slate-700 hover:scale-110 hover:shadow-lg">                
      <i className="ri-user-fill absolute"></i>
                  </div>
                  <h1 className="font-semibold text-lg  ">{user.email}</h1>
                </div>
              ))}
            </div>

            <button
            onClick={addCollaborators}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-blue-600 text-white rounded-md transition-all duration-300 ease-in-out hover:scale-105 active:scale-95">
        Add Collaborators
      </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default Project;






