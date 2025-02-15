/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React from 'react';
import { Link } from 'react-router-dom'; 

const Login = () => {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-900 p-4'>
      <div className='bg-gray-800 p-8 rounded-2xl  shadow-2xl w-full max-w-md'>
        <h2 className='text-3xl font-bold text-white mb-8 text-center'>Login</h2>
        <form>
          <div className='mb-6'>
            <label className='block text-gray-400 mb-2' htmlFor="email">Email</label>
            <input type="email" id="email" className='w-full px-4 py-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500' required/>
          </div>

          <div className='mb-6'>
            <label className='block text-gray-400 mb-2' htmlFor="password">Password</label>
            <input type="password" id="password" className='w-full px-4 py-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500' required/>
          </div>

          <button type='submit' className='w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200'>Login</button>
        </form>

        <p className='text-gray-400 mt-6 text-center'>
          Don't have an account? <Link to="/register" className='text-blue-500 hover:underline'>Create one</Link>
        </p>
      </div>
    </div>
  )
}

export default Login;
