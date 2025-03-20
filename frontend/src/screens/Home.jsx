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
        <main className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-10">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    {/* Logo and Project Name */}
                    <div className="flex items-center gap-3">
                        <i className="ri-rocket-2-line text-3xl text-blue-600"></i>
                        <h1 className="text-2xl font-bold text-gray-800">AI Conflux Project</h1>
                    </div>
    
                    {/* Logout Button */}
                    <button 
                        onClick={handleLogout} 
                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 flex items-center gap-2"
                    >
                        <i className="ri-logout-circle-r-line"></i>
                        Logout
                    </button>
                </div>
            </header>
    
            {/* Main Content */}
            <div className="pt-24">
                {/* Create Project Section */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Project</h2>
                    <button 
                        onClick={() => setIsModalOpen(true)} 
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 flex items-center gap-2"
                    >
                        <i className="ri-add-line"></i>
                        Create New Project
                    </button>
                </section>
    
                {/* Create Project History */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Project History</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {/* Example History Card */}
                        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition duration-200 cursor-pointer">
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Project History 1</h3>
                            <p className="text-sm text-gray-600">Created on: 2023-10-01</p>
                        </div>
                        {/* Add more history cards here */}
                    </div>
                </section>
    
                {/* Your Projects Section */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Projects</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {/* Project Cards */}
                        {project.map((project) => (
                            <div 
                                key={project._id} 
                                onClick={() => navigate(`/project`, { state: { project } })}
                                className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition duration-200 cursor-pointer"
                            >
                                <h2 className="text-xl font-semibold text-gray-800 mb-2">{project.name}</h2>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <i className="ri-user-line"></i>
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
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
                    <div className="bg-white relative p-8 rounded-lg shadow-xl w-full max-w-md z-20">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Project</h2>
                        <form onSubmit={createProject}>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                                <input 
                                    onChange={(e) => setProjectName(e.target.value)} 
                                    value={projectName}
                                    type="text" 
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required 
                                />
                            </div>
                            <div className="flex justify-end gap-4">
                                <button 
                                    type="button" 
                                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition duration-200"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
};

export default Home;
