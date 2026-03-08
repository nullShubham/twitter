import React, { useState } from 'react';
import axios from "axios";
import { USER_API_END_POINT } from "../utils/constant";
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import { getUser } from '../redux/userSlice';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (isLogin) {
      // login
      try {
        const res = await axios.post(`${USER_API_END_POINT}/login`, { email, password }, {
          headers: {
            'Content-Type': "application/json"
          },
          withCredentials: true
        }); 
        dispatch(getUser(res?.data?.user));
        if(res.data.success){
          navigate("/");
          toast.success(res.data.message);
        }
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }
        console.log(error);
      }
    } else {
      // signup
      try {
        const res = await axios.post(`${USER_API_END_POINT}/register`, { name, username, email, password }, {
          headers: {
            'Content-Type': "application/json"
          },
          withCredentials: true
        }); 
        if(res.data.success){
          setIsLogin(true);
          toast.success(res.data.message);
        }
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }
        console.log(error);
      }
    }
  }


  const loginSignupHandler = () => {
    setIsLogin(!isLogin);
  }

  return (
    <div className='w-screen h-screen flex items-center justify-center bg-black relative overflow-hidden'>
      {/* Background glowing orbs for glass effect */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[100px]"></div>
      
      <div className='flex items-center justify-center md:justify-evenly w-[95%] sm:w-[85%] md:w-[80%] z-10'>
        <div className='hidden md:block'>
          <img className='ml-5 drop-shadow-2xl invert opacity-90' width={"350px"} src="https://imgs.search.brave.com/1gGHkLnHxLrEo7vdJLjB82EQuzGjonz5TH03JjE7lpA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuc2Vla2xvZ28u/Y29tL2xvZ28tcG5n/LzQ5LzIvdHdpdHRl/ci14LWxvZ28tcG5n/X3NlZWtsb2dvLTQ5/MjM5NS5wbmc" alt="twitter-logo" />
        </div>
        
        {/* Glassmorphic Container  */}
        <div className='bg-white/5 backdrop-blur-xl border border-white/10 p-6 sm:p-8 md:p-10 rounded-2xl md:rounded-3xl shadow-2xl w-full max-w-md mx-2'>
          <div className='mb-4 md:mb-6 flex flex-col'>
             {/* Visible only on mobile to identify the brand */}
             <img className='block md:hidden drop-shadow-2xl invert opacity-90 mb-4 w-[50px]' src="https://imgs.search.brave.com/1gGHkLnHxLrEo7vdJLjB82EQuzGjonz5TH03JjE7lpA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuc2Vla2xvZ28u/Y29tL2xvZ28tcG5n/LzQ5LzIvdHdpdHRl/ci14LWxvZ28tcG5n/X3NlZWtsb2dvLTQ5/MjM5NS5wbmc" alt="twitter-logo" />
            <h1 className='font-bold text-4xl sm:text-5xl md:text-6xl text-white drop-shadow-md leading-tight'>Happening now.</h1>
          </div>
          <h1 className='mt-2 md:mt-4 mb-4 md:mb-6 text-2xl sm:text-3xl font-extrabold text-white/90'>{isLogin ? "Login" : "Join today."}</h1>
          <form onSubmit={submitHandler} className='flex flex-col gap-3 sm:gap-4'>
            {
              !isLogin && (<>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder='Name' className="bg-white/5 border border-white/20 text-white placeholder-white/50 focus:border-white/60 focus:bg-white/10 outline-none rounded-full px-4 py-2 sm:px-5 sm:py-3 font-medium transition-all duration-300 w-full" />
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Username' className="bg-white/5 border border-white/20 text-white placeholder-white/50 focus:border-white/60 focus:bg-white/10 outline-none rounded-full px-4 py-2 sm:px-5 sm:py-3 font-medium transition-all duration-300 w-full" />
              </>)
            }
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email' className="bg-white/5 border border-white/20 text-white placeholder-white/50 focus:border-white/60 focus:bg-white/10 outline-none rounded-full px-4 py-2 sm:px-5 sm:py-3 font-medium transition-all duration-300 w-full" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' className="bg-white/5 border border-white/20 text-white placeholder-white/50 focus:border-white/60 focus:bg-white/10 outline-none rounded-full px-4 py-2 sm:px-5 sm:py-3 font-medium transition-all duration-300 w-full" />
            
            <button className='bg-white text-black hover:bg-gray-200 border-none py-2 sm:py-3 mt-2 sm:mt-4 rounded-full text-base sm:text-lg font-bold shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)] transition-all duration-300 w-full'>
              {isLogin ? "Login" : "Create Account"}
            </button>
            
            <div className='mt-3 sm:mt-4 text-center text-sm sm:text-base'>
              <span className="text-white/60">{isLogin ? "Don't have an account?" : "Already have an account?"} </span>
              <span onClick={loginSignupHandler} className='font-bold text-white hover:text-gray-300 cursor-pointer underline decoration-white/30 underline-offset-4 transition-colors'>
                {isLogin ? "Sign up" : "Log in"}
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login