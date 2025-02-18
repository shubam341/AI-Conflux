/* eslint-disable no-unused-vars */
import React, {useContext} from "react";
import {UserContext} from '../context/user.context'

const Home=()=>{

    const {user}=useContext(UserContext)

    return(
          <main className="p-4" >

            <div className="projects">
                <div className="project">
                <i className="ri-link"></i>
                </div>
            </div>
            
          </main>
    )
}
export default Home