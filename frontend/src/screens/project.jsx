/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-children-prop */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext, useRef } from 'react';
import { UserContext } from '../context/user.context';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../config/axios';
import { initializeSocket, receiveMessage, sendMessage } from '../config/socket';
import Markdown from 'markdown-to-jsx';
import hljs from 'highlight.js';
import 'highlight.js/styles/default.css'; // Import highlight.js styles
import { getWebContainer } from '../config/webcontainer';

// Initialize hljs on the window object
window.hljs = hljs;

function SyntaxHighlightedCode(props) {
    const ref = useRef(null);

    React.useEffect(() => {
        if (ref.current && props.className?.includes('lang-') && window.hljs) {
            window.hljs.highlightElement(ref.current);
            ref.current.removeAttribute('data-highlighted');
        }
    }, [props.className, props.children]);

    return <code {...props} ref={ref} />;
}

const Project = () => {
    const location = useLocation();
    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(new Set()); // Initialized as Set
    const [project, setProject] = useState(location.state.project);
    const [message, setMessage] = useState('');
    const { user } = useContext(UserContext);
    const messageBox = useRef(null);

    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]); // New state variable for messages
    const [fileTree, setFileTree] = useState({});

    const [currentFile, setCurrentFile] = useState(null);
    const [openFiles, setOpenFiles] = useState([]);

    const [webContainer, setWebContainer] = useState(null);
    const [iframeUrl, setIframeUrl] = useState(null);

    const [runProcess, setRunProcess] = useState(null);

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
            .put('/projects/add-user', {
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
        if (message.trim() === '') return; // Prevent sending empty messages
        sendMessage('project-message', {
            message,
            sender: user,
        });
        setMessages((prevMessages) => [...prevMessages, { sender: user, message }]); // Update messages state
        setMessage('');
    };

    function WriteAiMessage(message) {
        const messageObject = JSON.parse(message);

        return (
            <div className="overflow-auto bg-slate-950 text-white rounded-sm p-2">
                <Markdown
                    children={messageObject.text}
                    options={{
                        overrides: {
                            code: SyntaxHighlightedCode,
                        },
                    }}
                />
            </div>
        );
    }

    useEffect(() => {
        initializeSocket(project._id);

        if (!webContainer) {
            getWebContainer().then((container) => {
                setWebContainer(container);
                console.log('container started');
            });
        }

        receiveMessage('project-message', (data) => {
            console.log(data);

            if (data.sender._id === 'ai') {
                const message = JSON.parse(data.message);
                console.log('New fileTree from AI:', message.fileTree);

                webContainer?.mount(message.fileTree);

                setFileTree((prevFileTree) => {
                    const updatedFileTree = { ...prevFileTree, ...message.fileTree };
                    saveFileTree(updatedFileTree); // Save the merged file tree
                    return updatedFileTree;
                });

                setMessages((prevMessages) => [...prevMessages, data]);
            } else {
                setMessages((prevMessages) => [...prevMessages, data]);
            }
        });

        axios.get(`/projects/get-project/${location.state.project._id}`).then((res) => {
            console.log(res.data.project);
            setProject(res.data.project);
            setFileTree(res.data.project.fileTree || {});
        });

        axios
            .get('/users/all')
            .then((res) => {
                setUsers(res.data.users);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    function saveFileTree(ft) {
        axios
            .put('/projects/update-file-tree', {
                projectId: project._id,
                fileTree: ft,
            })
            .then((res) => {
                console.log('Backend response:', res.data);
            })
            .catch((err) => {
                console.log('Error updating fileTree:', err);
            });
    }

    // Scroll to bottom when new messages are added
    useEffect(() => {
        if (messageBox.current) {
            messageBox.current.scrollTop = messageBox.current.scrollHeight;
        }
    }, [messages]);


    return (
        <main className="h-screen w-screen flex bg-gradient-to-br from-slate-100 to-slate-300 overflow-hidden">
            {/* Left Section - Chat Area */}
            <section className="left relative flex flex-col h-screen min-w-96 bg-gradient-to-b from-slate-200 to-slate-300 shadow-lg">
                {/* Header */}
                <header className="flex justify-between items-center p-4 w-full bg-slate-100 shadow-sm absolute z-10 top-0">
                    <button 
                        className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <i className="ri-add-fill"></i>
                        <p>Add Collaborator</p>
                    </button>
                    <button 
                        onClick={() => setIsSidePanelOpen(!isSidePanelOpen)} 
                    
                        className="p-2 bg-slate-200  cursor-pointer rounded-lg hover:bg-emerald-300 transition duration-200"
                    >
                        <i className="ri-group-fill text-lg"></i>
                    </button>
                </header>
    
                {/* Conversation Area */}
                <div className="conversation-area pt-16 pb-12 flex-grow flex flex-col h-full relative">
                    {/* Message Box */}
                    <div
                        ref={messageBox}
                        className="message-box p-4 flex-grow flex flex-col gap-4 overflow-auto max-h-full scrollbar-hide"
                    >
                        {messages.map((msg, index) => (
                            <div 
                                key={index} 
                                className={`${msg.sender._id === 'ai' ? 'max-w-80' : 'max-w-52'} ${msg.sender._id === user._id.toString() ? 'ml-auto bg-blue-500' : 'bg-blue-50'} message flex flex-col p-4 w-fit rounded-lg shadow-sm`}
                            >
                                <small className="opacity-65 text-xs mb-1">{msg.sender.email}</small>
                                <div className="text-sm">
                                    {msg.sender._id === 'ai' ? WriteAiMessage(msg.message) : <p>{msg.message}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
    
                    {/* Input Field */}
                    <div className="inputField w-full flex absolute bottom-0 bg-white p-4 border-t border-slate-200">
                        <input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    send();
                                }
                            }}
                            className="p-2 px-4 border-none outline-none flex-grow rounded-lg bg-slate-100 focus:ring-2 focus:ring-blue-500 transition duration-200 focus:bg-white"
                            type="text" 
                            placeholder="Enter message" 
                        />
                        <button
                            onClick={send}
                            className="ml-4 px-6 py-2 cursor-pointer bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-lg transition duration-200 transform hover:scale-105 active:scale-95"
                        >
                            <i className="ri-send-plane-fill"></i>
                        </button>
                    </div>
                </div>
    
                {/* Side Panel */}
                <div 
                    className={`sidePanel w-full h-full flex flex-col gap-2 bg-slate-200 absolute transition-all ${isSidePanelOpen ? 'translate-x-0' : '-translate-x-full'} top-0 shadow-lg`}
                >
                    {/* Side Panel Header */}
                    <header className="flex justify-between items-center px-4 p-3 bg-slate-100 border-b border-slate-200">
                        <h1 className="font-semibold text-lg">Collaborators</h1>
                        <button 
                            onClick={() => setIsSidePanelOpen(!isSidePanelOpen)} 
                            className="p-2 bg-slate-200 rounded-lg hover:bg-slate-300 transition duration-200"
                        >
                            <i className="ri-close-fill text-lg"></i>
                        </button>
                    </header>
    
                    {/* Collaborators List */}
                    <div className="users flex flex-col gap-2 p-2">
                        {project.users && project.users.map((user, index) => (
                            <div 
                                key={index} 
                                className="user cursor-pointer hover:bg-slate-100 p-2 flex gap-3 items-center rounded-lg transition duration-200"
                            >
                                <div className="aspect-square rounded-full w-10 h-10 flex items-center justify-center bg-blue-600 text-white">
                                    <i className="ri-user-fill"></i>
                                </div>
                                <h1 className="font-semibold text-lg">{user.email}</h1>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
    
            {/* Right Section - Code Editor */}
            <section className="right flex-grow h-full flex bg-gradient-to-br from-slate-100 to-slate-200">
                {/* File Explorer */}
                <div className="explorer h-full max-w-64 min-w-52 bg-slate-200 shadow-lg">
                    <div className="file-tree w-full p-2 space-y-2">
                        {Object.keys(fileTree).map((file, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setCurrentFile(file);
                                    setOpenFiles([...new Set([...openFiles, file])]);                                }}
                                className="tree-element cursor-pointer p-2 px-4 flex items-center gap-2 bg-slate-300 w-full hover:bg-slate-400 transition duration-200 rounded-lg"
                            >
                                <i className="ri-file-text-line text-blue-600"></i>
                                <p className="font-semibold text-lg">{file}</p>
                            </button>
                        ))}
                    </div>
                </div>
    
                {/* Code Editor */}
                <div className="code-editor flex flex-col flex-grow h-full shrink bg-white shadow-lg">
                    {/* Top Bar - Open Files and Actions */}
                    <div className="top flex justify-between w-full p-2 bg-slate-100 border-b border-slate-200">
                        {/* Open Files Section (No Scroll) */}
                        <div className="files flex gap-2">
                            {openFiles.map((file, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <button
                                        onClick={() => setCurrentFile(file)}
                                        className={`open-file cursor-pointer p-2 px-4 flex items-center w-fit gap-2 bg-slate-300 hover:bg-slate-400 transition duration-200 rounded-lg ${currentFile === file ? 'bg-slate-400' : ''}`}
                                    >
                                        <i className="ri-file-text-line text-blue-600"></i>
                                        <p className="font-semibold text-lg">{file}</p>
                                    </button>
                                    <button
                                        onClick={() => {
                                            setOpenFiles(openFiles.filter((f) => f !== file));
                                            if (currentFile === file) {
                                                setCurrentFile(null);
                                            }
                                        }}
                                        className="p-2 text-red-600 hover:text-red-700 transition duration-200"
                                    >
                                        <i className="ri-close-line"></i>
                                    </button>
                                </div>
                            ))}
                        </div>
                        {/* Static Copy and Run Buttons */}
                        <div className="actions flex gap-2">
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(fileTree[currentFile].file.contents);
                                }}
                                className="p-2 px-4 cursor-pointer bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                            >
                                <i className="ri-file-copy-line"></i>
                            </button>
                            <button
                                onClick={async () => {
                                    await webContainer.mount(fileTree);
                                    const installProcess = await webContainer.spawn("npm", ["install"]);
                                    installProcess.output.pipeTo(new WritableStream({
                                        write(chunk) {
                                            console.log(chunk);
                                        }
                                    }));
                                    if (runProcess) {
                                        runProcess.kill();
                                    }
                                    let tempRunProcess = await webContainer.spawn("npm", ["start"]);
                                    tempRunProcess.output.pipeTo(new WritableStream({
                                        write(chunk) {
                                            console.log(chunk);
                                        }
                                    }));
                                    setRunProcess(tempRunProcess);
                                    webContainer.on('server-ready', (port, url) => {
                                        console.log(port, url);
                                        setIframeUrl(url);
                                    });
                                }}
                                className="p-2 px-4 bg-blue-600 cursor-pointer text-white rounded-lg hover:bg-blue-700 transition duration-200"
                            >
                                Run
                            </button>
                        </div>
                    </div>
    
                    {/* Code Editor Area */}
                    <div className="bottom flex flex-grow max-w-full shrink overflow-auto">
                        {fileTree[currentFile] && (
                            <div className="code-editor-area h-full overflow-auto flex-grow bg-slate-50">
                                <pre className="hljs h-full">
                                    <code
                                        className="hljs h-full outline-none"
                                        contentEditable
                                        suppressContentEditableWarning
                                        onBlur={(e) => {
                                            const updatedContent = e.target.innerText;
                                            const ft = {
                                                ...fileTree,
                                                [currentFile]: {
                                                    file: {
                                                        contents: updatedContent
                                                    }
                                                }
                                            };
                                            setFileTree(ft);
                                            saveFileTree(ft);
                                        }}
                                        dangerouslySetInnerHTML={{ __html: hljs.highlight('javascript', fileTree[currentFile].file.contents).value }}
                                        style={{
                                            whiteSpace: 'pre-wrap',
                                            paddingBottom: '25rem',
                                            counterSet: 'line-numbering',
                                        }}
                                    />
                                </pre>
                            </div>
                        )}
                    </div>
                </div>
    
                {/* Iframe Preview */}
                {iframeUrl && webContainer && (
                    <div className="flex min-w-96 flex-col h-full bg-white shadow-lg">
                        <div className="address-bar p-2 bg-slate-100 border-b border-slate-200">
                            <input
                                type="text"
                                onChange={(e) => setIframeUrl(e.target.value)}
                                value={iframeUrl}
                                className="w-full p-2 px-4 bg-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <iframe src={iframeUrl} className="w-full h-full"></iframe>
                    </div>
                )}
            </section>
    
            {/* Add Collaborator Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 cursor-pointer hover:shadow-eme">
                <div className="bg-white p-6 rounded-lg w-96 max-w-full relative shadow-xl">
                        <header className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Select User</h2>
                            <button 
                                onClick={() => setIsModalOpen(false)} 
                                className="p-2 cursor-pointer bg-slate-200 rounded-lg hover:bg-slate-300 transition duration-200"
                            >
                                <i className="ri-close-fill"></i>
                            </button>
                        </header>
                        <div className="users-list flex flex-col gap-2 mb-16 max-h-96 overflow-y-auto scrollbar-hide">
                            {users
                                .filter((user) => !project.users.some((u) => u._id === user._id)) // Filter out users already in the project
                                .map((user) => (
                                    <div 
                                        key={user.id} 
                                        className={`user cursor-pointer hover:bg-slate-200 ${Array.from(selectedUserId).includes(user._id) ? 'bg-slate-200' : ""} p-2 flex gap-2 items-center rounded-lg transition duration-200`} 
                                        onClick={() => handleUserClick(user._id)}
                                    >
                                        <div className="aspect-square relative  rounded-full w-10 h-10 flex items-center justify-center bg-blue-600 text-white">
                                            <i className="ri-user-fill"></i>
                                        </div>
                                        <h1 className="font-semibold text-lg">{user.email}</h1>
                                    </div>
                                ))}
                        </div>
                        <button
                            onClick={addCollaborators}
                            className="absolute bottom-4 left-1/2  cursor-pointer transform -translate-x-1/2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                        >
                            Add Collaborators
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}
export default Project;