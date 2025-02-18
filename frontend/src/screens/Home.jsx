/* eslint-disable no-unused-vars */
import React, {useContext, useState} from "react";
import {UserContext} from '../context/user.context'

const Home=()=>{

    const {user}=useContext(UserContext)
    const[isModalOpen,setIsModalOpen]=useState(false)

    //function to create project
    function createProject(){
  console.log('create project')
    }

    return(
          <main className="p-4" >

            <div className="projects">
               <button className="project p-4 border border-slate-300 rounded-md">
                <i className="ri-link"></i>
                </button>
            </div>
            
    {/* create modal */}
    {isModalOpen &&(
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-md shadow-md w-1/3"
            >
                <h2 className="text-xl mb-4">Create New Project</h2>
           <form onSubmit={(e)=>{
            e.preventDefault();
            createProject();
            setIsModalOpen(false);
           }}>
            <div className="mb-4"><label className=""htmlFor=""></label></div>
           </form>
            </div>
        </div>
      )}
         
          </main>
    )
}
export default Home