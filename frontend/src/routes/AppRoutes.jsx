/* eslint-disable no-unused-vars */
import React from "react";
import { Route, BrowserRouter, Routes } from 'react-router-dom'
import Login from '../screens/login'

const AppRoutes=()=>{
  return (
  <BrowserRouter>
       <Routes>
        <Route path="/" element={<div>Home</div>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/Register" element={<div>Register</div>}/>
        
        
        
       </Routes>
  </BrowserRouter>
  )
}

export default AppRoutes