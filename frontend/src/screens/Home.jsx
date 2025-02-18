/* eslint-disable no-unused-vars */
import React, { useContext, useState } from "react";
import { UserContext } from '../context/user.context';
import axios from "../config/axios"

const Home = () => {
    const { user } = useContext(UserContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [projectName,setProjectName]=useState(null)

    // Function to create project
    function createProject(e) {
        e.preventDefault();
        console.log({projectName});
    }

    return (
        <main className="p-4">
            <div className="projects">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="project p-4 border border-slate-300 rounded-md">
                        New Project
                    <i className="ri-link ml-2"></i>
                </button>
            </div>

            {/* Create Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="absolute inset-0 bg-black/50"></div> {/* Overlay */}
                    <div className="bg-white relative p-6 rounded-md shadow-md w-1/3 z-20">
                        <h2 className="text-xl mb-4">Create New Project</h2>
                        <form onSubmit={createProject}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Project Name</label>
                                <input
                               
                               //Setting value
                                  onChange={(e)=>setProjectName(e.target.value)}
                                  value={projectName}

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
