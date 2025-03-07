/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useContext, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "../config/axios";
import { initializeSocket, receiveMessage, sendMessage } from "../config/socket";
import { UserContext } from "../context/user.context";
import Markdown from "markdown-to-jsx";
import hljs from "highlight.js";
import "highlight.js/styles/nord.css";

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
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    initializeSocket(project._id);

    receiveMessage("project-message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
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
  }, [messages]);

  useEffect(() => {
    hljs.highlightAll(); // ✅ Apply syntax highlighting after rendering
  }, [messages]);

  const send = () => {
    if (!message.trim()) return;
    const newMessage = { message, sender: user };
    sendMessage("project-message", newMessage);
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setMessage("");
  };

  return (
    <main className="h-screen w-screen overflow-x-hidden no-scrollbar custom-scrollbar no-scrollbar overflow-y-auto flex bg-gray-200">
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
            {messages.map((msg, index) => (
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

                <div className="max-w-full overflow-x-auto px-2 py-1 no-scrollbar">

                  
                  {/* Highlight only if message contains code */}
                  {msg.message.includes("```") ? (
                    <pre>
                      <code className="language-javascript">{msg.message.replace(/```/g, "")}</code>
                    </pre>
                  ) : (
                    <Markdown className="text-sm">{msg.message}</Markdown>
                  )}
                </div>
              </div>
            ))}
            <div ref={lastMessageRef} />
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
            className="w-full p-2 px-2 border border-gray-300 rounded-lg outline-none text-left bg-white resize-none overflow-y-auto h-12 max-h-16 no-scrollbar"
            placeholder="Enter message..."
            rows="2"
          />
          <button
            onClick={send}
            className="ml-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all duration-200 ease-in-out shadow-md"
          >
            <i className="ri-send-plane-fill"></i>
          </button>
        </div>
      </section>
    </main>
  );
};

export default Project;
