
import { useState } from "react";
import axios from "axios";
import BASE_URL from "../../config";
import { useNavigate } from "react-router-dom";
import { userLogStatus } from "../state/atoms";
import { useSetRecoilState } from "recoil";

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const setUserLogStatus = useSetRecoilState(userLogStatus)

  const loginUser = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, {
        usernameorEmail: username,
        password: password,
      
      });
      if (response.status === 201) {
        console.log(response.data.token);
        localStorage.setItem('userToken', response.data.token);
        setUserLogStatus('logged');
        navigate('/home')
      }
    } catch (error) {
      console.error(error); // Changed to console.error to log the actual error
    }
  };

  const handleUsernameChange = (e) => { // Changed from handleEmailChange to handleUsernameChange
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  return (
    <div>
      <div className="flex space-x-5 w-2/3 mx-auto p-4 rounded-lg shadow sm:p-6 md:p-8 bg-slate-100 dark:border-gray-700 mt-10">
        <div className="w-1/2 p-4 text-lg dark:bg-gray-800">
          Welcome back
          <img src="https://img.icons8.com/?size=512&id=108791&format=png" alt="Welcome back" />
        </div>
        <div className="w-1/2 p-4 bg-white items-start">
          <h2 className="text-3xl text-left text-black">Log in</h2>
          <input className="bg-white w-full h-8 mt-6 border rounded-md text-black" placeholder="username" onChange={handleUsernameChange} value={username}></input>
          <input className="bg-white w-full h-8 mt-6 border rounded-md text-black" type="password" placeholder="password" onChange={handlePasswordChange} value={password}></input>
          <button 
          className="mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={
            loginUser
          
          }>
          Login</button><br />

          <div className="mt-10 float-left">
            <label className="text-black">Dont have an account?</label>
            <button className="ml-2  bg-blue-500 hover:bg-blue-700 hover:underline-offset-2 text-white font-bold py-2 px-4 rounded" onClick={()=>navigate('/register')}>Register</button> {/* Corrected "underlined" to "underline" */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
