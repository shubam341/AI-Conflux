/* eslint-disable no-unused-vars */
import React from "react";
import{Route,BrowserRouter,Routes} from 'react-router-dom'


const AppRoutes=()=>{
  return (
  <BrowserRouter>
       <Routes>
        <Route path="/" element={<div>Home</div>}/>
        <Route path="/login" element={<div>login</div>}/>
        <Route path="/Register" element={<div>Register</div>}/>
        
        
        
       </Routes>
  </BrowserRouter>
  )
}

export default AppRoutes