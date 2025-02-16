/* eslint-disable no-unused-vars */
import React,{useContext,useState} from 'react';
import { Link ,useNavigate} from 'react-router-dom';
import axios from '../config/axios'
import { UserContext } from "../context/user.context.jsx";

const Register = () => {

  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')

   //creating Navigate
    const navigate=useNavigate()

    //Using user context
      const{setUser}=useContext(UserContext)

  //Creating submit handler
  function submitHandler(e){

    e.preventDefault()

    axios.post('/users/register',{
      email,
      password
    }).then((res)=>{
      console.log(res.data)

      localStorage.setItem('token',res.data.token)
      setUser(res.data.user)

     navigate('/')
    }).catch((err) => {
        if (err.response) {
          console.log(err.response.data);
        } else {
          console.log(err.message);
        }
      })
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-900 p-4'>
      <div className='bg-gray-800 p-8 rounded-2xl  shadow-2xl w-full max-w-md'>
        <h2 className='text-3xl font-bold text-white mb-8 text-center'>Register</h2>
        <form
         onSubmit={submitHandler}
        >



          <div className='mb-6'>
            <label className='block text-gray-400 mb-2' htmlFor="email">Email</label>
            <input
            onChange={(e)=>setEmail(e.target.value)}
            type="email" id="email"    placeholder="Enter your email" className='w-full px-4 py-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500' required/>
          </div>

          <div className='mb-6'>
            <label className='block text-gray-400 mb-2' htmlFor="password">Password</label>
            <input
            onChange={(e)=>setPassword(e.target.value)}
            type="password" id="password"    placeholder="Enter your password" className='w-full px-4 py-3  rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500' required/>
          </div>

          <button type='submit' className='w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200'>Register</button>
        </form>

        <p className='text-gray-400 mt-6 text-center'>
          Already have an account? <Link to="/login" className='text-blue-500 hover:underline'>Login</Link>
        </p>
      </div>
    </div>
  )
}

export default Register;
