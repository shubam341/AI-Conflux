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
        <div className=""></div>
      )}
         
          </main>
    )
}
export default Home