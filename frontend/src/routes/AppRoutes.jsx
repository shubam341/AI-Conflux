/* eslint-disable no-unused-vars */
import React from "react";
import { Route, BrowserRouter, Routes } from 'react-router-dom'
import Login from '../screens/login'
import Register from "../screens/register";
import Home from "../screens/Home";

const AppRoutes=()=>{
  return (
  <BrowserRouter>
       <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        
        
        
       </Routes>
  </BrowserRouter>
  )
}

export default AppRoutes