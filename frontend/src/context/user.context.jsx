/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, {createContext,useState,useContext} from 'react'


//create the UserContext
 // eslint-disable-next-line react-refresh/only-export-components
 export const UserContext=createContext();

//Create . Provide componenet
export const UserProvider=({children})=>{
    const[user,setUser]=useState(null);
  

    return(
        <UserContext.Provider value={{user,setUser}}>
        {children}
        </UserContext.Provider>

    )
}

 