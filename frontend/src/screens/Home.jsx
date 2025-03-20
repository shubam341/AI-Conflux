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
        <main className="min-h-screen bg-white">
            {/* Header */}
            <header className="bg-slate-900 fixed top-0 left-0 right-0 z-10 shadow-lg">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    {/* Logo and Project Name */}
                    <div className="flex items-center gap-3 group cursor-pointer">
                        <div className="relative">
                            <i className="ri-brain-line text-3xl text-emerald-400 group-hover:text-emerald-300 transition-colors duration-300"></i>
                            <div className="absolute inset-0 animate-ping bg-emerald-400 rounded-full opacity-20"></div>
                        </div>
                        <h1 className="text-2xl font-bold text-white tracking-wider group-hover:text-emerald-300 transition-colors duration-300">
                            AI Conflux Project
                        </h1>
                    </div>
    
                    {/* Logout Button */}
                    <button 
                        onClick={handleLogout} 
                        className="px-6 py-2.5 bg-slate-800 text-slate-200 rounded-lg hover:bg-slate-700 
                        transition-all duration-300 flex items-center gap-2 border border-slate-600 hover:border-slate-500
                        hover:scale-105 hover:shadow-emerald-500/20 hover:shadow-lg"
                    >
                        <i className="ri-logout-circle-r-line"></i>
                        Logout
                    </button>
                </div>
            </header>
    
            {/* Main Content */}
            <div className="container mx-auto pt-28 px-6 pb-12">
                {/* Create Project Section */}
                <section className="mb-10 p-8 bg-slate-50 rounded-2xl border border-slate-200 
                    shadow-lg hover:shadow-xl transition-all duration-500 hover:bg-gradient-to-br hover:from-slate-50 hover:to-emerald-50/30">
                    <h2 className="text-3xl font-bold text-slate-800 mb-6 group-hover:text-emerald-700">
                        Create Project
                    </h2>
                    <div className="flex flex-col gap-4">
                        <button 
                            onClick={() => setIsModalOpen(true)} 
                            className="relative overflow-hidden px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl
                            transition-all duration-300 flex items-center gap-3 group hover:shadow-2xl hover:shadow-emerald-500/20
                            hover:translate-y-[-2px] before:absolute before:inset-0 before:bg-white/20 before:translate-x-[-100%]
                            before:hover:translate-x-[100%] before:transition-transform before:duration-[400ms]"
                        >
                           <div className="relative flex items-center gap-3 p-2 rounded-lg transition-all duration-500 group hover:bg-blue-500 hover:text-white">
    <i className="ri-sparkle-line text-xl transition-transform duration-500 group-hover:rotate-180 group-hover:scale-110"></i>
    <span className="transition-all duration-500 group-hover:tracking-wider">
        Initialize New Project
    </span>
</div>

                        </button>
                        <p className="text-sm text-slate-600">
                            Start a new project to collaborate with your team and build amazing AI solutions.
                        </p>
                    </div>
                </section>
    
                {/* Your Projects Section */}
                <section className="p-8 bg-slate-50 rounded-2xl border border-slate-200 
                    shadow-lg hover:shadow-xl transition-all duration-500 hover:bg-gradient-to-br hover:from-slate-50 hover:to-emerald-50/30">
                    <h2 className="text-3xl font-bold text-slate-800 mb-8">
                        Your Projects
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {/* Project Cards */}
                        {project.map((project) => (
                            <div 
                                key={project._id} 
                                onClick={() => navigate(`/project`, { state: { project } })}
                                className="group p-6 bg-white rounded-xl border border-slate-200 
                                hover:border-emerald-500 transition-all duration-300 cursor-pointer 
                                shadow-md hover:shadow-xl hover:shadow-emerald-500/20 hover:translate-y-[-2px]"
                            >
                                <h2 className="text-xl font-semibold text-slate-800 mb-3 group-hover:text-emerald-600 transition-colors duration-300">
                                    {project.name}
                                </h2>
                                <div className="flex items-center gap-2 text-slate-600 group-hover:text-emerald-500 transition-colors duration-300">
                                    <i className="ri-team-line group-hover:scale-110 transition-transform duration-300"></i>
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
                    <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-fade-in"></div>
                    <div className="relative p-8 bg-white rounded-2xl border border-slate-200 
                        w-full max-w-md z-20 animate-scale-up shadow-2xl">
                        <h2 className="text-2xl font-bold text-slate-800 mb-6">
                            Create New Project
                        </h2>
                        <form onSubmit={createProject}>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Project Name</label>
                                <input 
                                    onChange={(e) => setProjectName(e.target.value)} 
                                    value={projectName}
                                    type="text" 
                                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 
                                    focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 
                                    transition-all duration-300 placeholder-slate-400 hover:border-emerald-300"
                                    required 
                                    placeholder="Enter project name..."
                                />
                            </div>
                            <div className="flex justify-end gap-4">
                                <button 
                                    type="button" 
                                    className="px-6 py-2.5 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 
                                    transition-all duration-300 border border-slate-200 hover:border-slate-300
                                    hover:shadow-lg"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg
                                    hover:bg-emerald-500 transition-all duration-300 
                                    shadow-md hover:shadow-lg hover:translate-y-[-2px]"
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
