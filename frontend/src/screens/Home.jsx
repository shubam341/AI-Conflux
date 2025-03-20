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
        <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
            {/* Header */}
            <header className="bg-black/30 backdrop-blur-lg fixed top-0 left-0 right-0 z-10 border-b border-white/10">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    {/* Logo and Project Name */}
                    <div className="flex items-center gap-3 group cursor-pointer">
                        <div className="relative">
                            <i className="ri-brain-line text-3xl text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300"></i>
                            <div className="absolute inset-0 animate-ping bg-cyan-400 rounded-full opacity-20"></div>
                        </div>
                        <h1 className="text-2xl font-bold text-white tracking-wider group-hover:text-cyan-300 transition-colors duration-300">
                            AI Conflux Project
                        </h1>
                    </div>
    
                    {/* Logout Button */}
                    <button 
                        onClick={handleLogout} 
                        className="px-6 py-2.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 hover:text-red-300 
                        transition-all duration-300 flex items-center gap-2 border border-red-500/30 hover:border-red-500/50 
                        shadow-[0_0_15px_rgba(239,68,68,0.1)] hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                    >
                        <i className="ri-logout-circle-r-line"></i>
                        Logout
                    </button>
                </div>
            </header>
    
            {/* Main Content */}
            <div className="container mx-auto pt-28 px-6 pb-12">
                {/* Create Project Section */}
                <section className="mb-10 p-8 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 
                    shadow-[0_0_25px_rgba(0,0,0,0.2)] hover:shadow-[0_0_35px_rgba(0,0,0,0.3)] transition-all duration-500">
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-6">
                        Create Project
                    </h2>
                    <div className="flex flex-col gap-4">
                        <button 
                            onClick={() => setIsModalOpen(true)} 
                            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl
                            hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 flex items-center gap-3
                            shadow-[0_0_25px_rgba(6,182,212,0.3)] hover:shadow-[0_0_35px_rgba(6,182,212,0.4)] group"
                        >
                            <i className="ri-add-line text-xl group-hover:rotate-180 transition-transform duration-500"></i>
                            Create New Project
                        </button>
                        <p className="text-sm text-gray-400">
                            Start a new project to collaborate with your team and build amazing AI solutions.
                        </p>
                    </div>
                </section>
    
                {/* Your Projects Section */}
                <section className="p-8 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 
                    shadow-[0_0_25px_rgba(0,0,0,0.2)] hover:shadow-[0_0_35px_rgba(0,0,0,0.3)] transition-all duration-500">
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-8">
                        Your Projects
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {/* Project Cards */}
                        {project.map((project) => (
                            <div 
                                key={project._id} 
                                onClick={() => navigate(`/project`, { state: { project } })}
                                className="group p-6 bg-gradient-to-br from-white/10 to-white/5 rounded-xl border border-white/10 
                                hover:border-cyan-500/30 transition-all duration-300 cursor-pointer 
                                shadow-[0_0_15px_rgba(0,0,0,0.1)] hover:shadow-[0_0_25px_rgba(6,182,212,0.2)]"
                            >
                                <h2 className="text-xl font-semibold text-white mb-3 group-hover:text-cyan-400 transition-colors duration-300">
                                    {project.name}
                                </h2>
                                <div className="flex items-center gap-2 text-gray-400 group-hover:text-cyan-400/70 transition-colors duration-300">
                                    <i className="ri-team-line"></i>
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
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"></div>
                    <div className="relative p-8 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-white/10 
                        w-full max-w-md z-20 animate-scale-up shadow-[0_0_50px_rgba(0,0,0,0.3)]">
                        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-6">
                            Create New Project
                        </h2>
                        <form onSubmit={createProject}>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-300 mb-2">Project Name</label>
                                <input 
                                    onChange={(e) => setProjectName(e.target.value)} 
                                    value={projectName}
                                    type="text" 
                                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white 
                                    focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 
                                    transition-all duration-300 placeholder-gray-500"
                                    required 
                                    placeholder="Enter project name..."
                                />
                            </div>
                            <div className="flex justify-end gap-4">
                                <button 
                                    type="button" 
                                    className="px-6 py-2.5 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 
                                    transition-all duration-300 border border-white/10 hover:border-white/20"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg
                                    hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 
                                    shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.4)]"
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
