/* eslint-disable no-unused-vars */
import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/user.context";
import axios from "../config/axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const { user, setUser } = useContext(UserContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [projectName, setProjectName] = useState("");
    const [project, setProject] = useState([]);
    const navigate = useNavigate();

    // Check for user session on mount
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, [setUser]);

    // Function to handle logout
    const handleLogout = () => {
        localStorage.removeItem("user"); // Clear stored session
        setUser(null);
        navigate("/login"); // Redirect to login page
    };

    // Function to create project
    const createProject = (e) => {
        e.preventDefault();
        axios.post("/projects/create", { name: projectName })
            .then((res) => {
                console.log(res);
                setIsModalOpen(false);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    // Fetch all projects
    useEffect(() => {
        axios.get("/projects/all").then((res) => {
            setProject(res.data.projects);
        }).catch(err => {
            console.log(err);
        });
    }, []);
    
        return (
            <main className="p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 min-h-screen">
                {/* Header */}
                <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-xl fixed top-0 left-0 right-0 z-10 animate-fade-in">
                    <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                        {/* Logo and Project Name */}
                        <div className="flex items-center gap-3 transform hover:scale-105 transition duration-300">
                            <i className="ri-brain-line text-3xl text-white animate-pulse"></i>
                            <h1 className="text-2xl font-bold text-white tracking-wide">AI Conflux Project</h1>
                        </div>
        
                        {/* Logout Button */}
                        <button 
                            onClick={handleLogout} 
                            className="px-6 py-2 bg-white/90 text-purple-700 rounded-lg hover:bg-white hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2 backdrop-blur-sm"
                        >
                            <i className="ri-logout-circle-r-line"></i>
                            Logout
                        </button>
                    </div>
                </header>
        
                {/* Main Content */}
                <div className="pt-24">
                    {/* Create Project Section */}
                    <section className="mb-8 p-6 bg-white/80 backdrop-blur-md rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">Create Project</h2>
                        <div className="flex flex-col gap-4">
                            <button 
                                onClick={() => setIsModalOpen(true)} 
                                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-300 flex items-center gap-2 shadow-md group"
                            >
                                <i className="ri-add-line group-hover:rotate-90 transition-transform duration-300"></i>
                                Create New Project
                            </button>
                            <p className="text-sm text-gray-600">
                                Start a new project to collaborate with your team and build amazing AI solutions.
                            </p>
                        </div>
                    </section>
        
                    {/* Your Projects Section */}
                    <section className="p-6 bg-white/80 backdrop-blur-md rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">Your Projects</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {/* Project Cards */}
                            {project.map((project) => (
                                <div 
                                    key={project._id} 
                                    onClick={() => navigate(`/project`, { state: { project } })}
                                    className="p-6 bg-white/90 border-2 border-transparent rounded-xl shadow-md hover:shadow-xl hover:border-purple-400 transition-all duration-300 cursor-pointer transform hover:scale-[1.02] group"
                                >
                                    <h2 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors duration-300">{project.name}</h2>
                                    <div className="flex items-center gap-2 text-purple-600">
                                        <i className="ri-user-line group-hover:animate-bounce"></i>
                                        <p className="text-sm">Collaborators: {project.users.length}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
        
                {/* Create Project Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"></div>
                        <div className="bg-white/95 backdrop-blur-md relative p-8 rounded-xl shadow-2xl w-full max-w-md z-20 transform animate-scale-up">
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">Create New Project</h2>
                            <form onSubmit={createProject}>
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                                    <input 
                                        onChange={(e) => setProjectName(e.target.value)} 
                                        value={projectName}
                                        type="text" 
                                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all duration-300"
                                        required 
                                    />
                                </div>
                                <div className="flex justify-end gap-4">
                                    <button 
                                        type="button" 
                                        className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 hover:shadow-md transition-all duration-300"
                                        onClick={() => setIsModalOpen(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 hover:shadow-md transition-all duration-300"
                                    >
                                        Create
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        )
};

export default Home;
