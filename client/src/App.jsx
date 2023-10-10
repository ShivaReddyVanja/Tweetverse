
import Login from "./components/Login"
import Register from "./components/Register"
import { Home } from "./components/Home"
import {Routes,Route,BrowserRouter} from "react-router-dom"
import './App.css'
import {useSetRecoilState, useRecoilValue } from "recoil";
import { usernameSelector } from "./state/selectors"
import { useEffect } from "react"
import { userState,userLogStatus } from "./state/atoms"

import axios from 'axios';
import BASE_URL from "../config"
import Profile from "./components/Profile"



function App() {
  const setUserData = useSetRecoilState(userState);
  const status = useRecoilValue(userLogStatus)
 
  const username = useRecoilValue(usernameSelector)

  
  
  useEffect(()=>{
    const init=async ()=>{
      const response = await axios.post(`${BASE_URL}/me`,{
      },{headers:{
        Authorization:`Bearer ${localStorage.getItem('userToken')}`,
      }})
      if(response.status===201){
        setUserData(response.data.user);
        
      }
      
    }
    init();
  },[status,setUserData])
  useEffect(() => {
    console.log(username);
  }, [username]); 
 

  return (
    <>

    <BrowserRouter>
    
    <Routes>
    
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/Home" element={<Home/>}/>
      <Route path="/profile" element={<Profile/>}/>
      



     

    </Routes>
   
    </BrowserRouter>
   
    
    </>
  )
}

export default App
