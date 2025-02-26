/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const Project = () => {
  const location = useLocation();

  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const users = [
    { id: 1, name: "User One", email: "userone@example.com" },
    { id: 2, name: "User Two", email: "usertwo@example.com" },
    { id: 3, name: "User Three", email: "userthree@example.com" },
  ];

  const handleUserClick = (id) => {
    setSelectedUserId(id);
    setIsModalOpen(false);
  };

  console.log(location.state);

  return (
    <main className="h-screen w-screen overflow-x-hidden overflow-y-auto flex bg-gray-200">
      <section className="left flex flex-col h-full w-105 min-w-48 max-w-lg bg-slate-300 shadow-lg relative">
        {/* Header */}
        <header className="flex justify-between items-center p-3 px-4 bg-slate-100">
          <button
            className="flex items-center gap-1 to-5% cursor-pointer font-semibold hover:text-blue-600 transition-all"
            onClick={() => setIsModalOpen(true)} // Fix: Open modal on click
          >
            <i className="ri-add-large-fill"></i>
            <p className="text-lg items-center">Add collaborators</p>
          </button>

          <button
            onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
            className="p-2 px-2 text-xl cursor-pointer"
          >
            <i className="ri-group-fill"></i>
          </button>
        </header>

        {/* Conversation Area */}
        <div className="conversation-area flex-grow flex flex-col p-4 space-y-2 overflow-y-auto">
          {/* Incoming Message */}
          <div className="message-box flex flex-col items-start">
            <div className="incoming message bg-white text-black p-2 rounded-lg max-w-[75%] shadow-md">
              <small className="text-gray-500">exam@gmail.com</small>
              <p>Lorem ipsum dolor sit amet.</p>
            </div>
          </div>

          {/* Outgoing Message */}
          <div className="message-box flex flex-col items-end">
            <div className="outgoing message bg-blue-600 text-white p-3 rounded-lg max-w-[75%] shadow-md">
              <p>Hello! How are you?</p>
            </div>
          </div>
        </div>

        {/* Input Field */}
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

        {/* Side Panel for Collaborators */}
        <div
          className={`sidePanel w-full h-full bg-slate-300 shadow-2xl absolute transition-transform duration-300 ease-in-out ${
            isSidePanelOpen ? "translate-x-0" : "-translate-x-full"
          } top-0 left-0 rounded-r-3xl border border-gray-400`}
        >
          <header className="flex justify-between items-center p-4 bg-slate-50 border-b border-gray-400 rounded-tr-3xl shadow-md">
            <h2 className="text-xl font-bold text-gray-700">Collaborators</h2>
            <button
              onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
              className="p-2 hover:bg-gray-300 rounded-full transition-all duration-200"
            >
              <i className="ri-close-large-line cursor-pointer text-2xl text-gray-600"></i>
            </button>
          </header>

          {/* User List */}
          <div className="user p-3 cursor-pointer space-y-4 overflow-y-auto h-[calc(100%-64px)] custom-scrollbar">
            <div className="p-3 bg-white rounded-xl shadow-lg flex items-center space-x-2 border border-gray-400 hover:scale-105 transition-all duration-200">
              <i className="ri-user-fill text-2xl text-gray-600"></i>
              <h1 className="font-semibold text-gray-800">Username</h1>
            </div>
          </div>
        </div>
      </section>

      

      {/* Modal for Selecting Users */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50  bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md w-96 max-w-full relative">
            <header className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Select User</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2">
                <i className="ri-close-fill"></i>
              </button>
            </header>

            {/* User List in Modal */}
            <div className="users-list flex flex-col gap-2 mb-16 max-h-96 overflow-auto">
              {users.map((user) => (
                <div
                  key={user.id}
                  className={`user cursor-pointer hover:bg-slate-200 ${
                    selectedUserId === user.id ? "bg-slate-200" : ""
                  } p-2 flex gap-2 items-center`}
                  onClick={() => handleUserClick(user.id)}
                >
                  <div className="aspect-square relative rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-slate-600">
                    <i className="ri-user-fill absolute"></i>
                  </div>
                  <h1 className="font-semibold text-lg">{user.email}</h1>
                </div>
              ))}
            </div>

            <button className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-blue-600 text-white rounded-md transition-all duration-300 ease-in-out hover:scale-105 active:scale-95">
        Add Collaborators
      </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default Project;
