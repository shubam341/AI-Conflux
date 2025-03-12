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
        <main className="p-4">
            {/* Logout Button */}
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Your Projects</h1>
                <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded-md">Logout</button>
            </div>

            <div className="projects flex flex-wrap gap-3">
                <button onClick={() => setIsModalOpen(true)} className="project p-4 border border-slate-300 rounded-md">
                    New Project
                    <i className="ri-link ml-2"></i>
                </button>

                {project.map((project) => (
                    <div key={project._id} onClick={() => navigate(`/project`, { state: { project } })}
                         className="project p-4 flex-col gap-2 border cursor-pointer border-slate-300 rounded-md min-w-44 hover:bg-slate-200">
                        <h2 className="font-semibold">{project.name}</h2>
                        <div className="flex gap-2">
                            <p><small><i className="ri-user-line"></i> Collaborators </small>:</p>
                            {project.users.length}
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Project Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="absolute inset-0 bg-black/50"></div>
                    <div className="bg-white relative p-6 rounded-md shadow-md w-1/3 z-20">
                        <h2 className="text-xl mb-4">Create New Project</h2>
                        <form onSubmit={createProject}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Project Name</label>
                                <input onChange={(e) => setProjectName(e.target.value)} value={projectName}
                                       type="text" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" required />
                            </div>
                            <div className="flex justify-end">
                                <button type="button" className="mr-2 px-4 py-2 bg-gray-300 rounded-md"
                                        onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
};

export default Home;
