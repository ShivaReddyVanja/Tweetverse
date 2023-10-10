import { useState } from "react";
import axios from "axios";
import BASE_URL from "../../config";
import { useNavigate } from "react-router-dom";


const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const navigate= useNavigate();


  const registerUser = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/signup`, {
        username: username,
        email: email,
        name: name,
        password: password,
      });
      if (response.status === 201) {
        console.log("User registration successful");
        navigate('/login')
      
   
      }
    } catch (error) {
      console.error(error);
    
    }
  };

  return (
    <div>
      <div className="flex space-x-5 w-2/3 mx-auto p-4 rounded-lg shadow sm:p-6 md:p-8 bg-slate-100 dark:border-gray-700 mt-10">
        <div className="w-1/2 p-4 text-lg dark:bg-gray-800">
          Join us
          <img
            src="https://img.icons8.com/?size=512&id=108791&format=png"
            alt="Join us"
          />
        </div>
        <div className="w-1/2 p-4 bg-white items-start">
          <h2 className="text-3xl text-left text-black">Register</h2>
          <input
            className="bg-white w-full h-8 mt-6 border rounded-md text-black placeholder-black"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          />
          <input
            className="bg-white w-full h-8 mt-6 border rounded-md text-black placeholder-black"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <input
            className="bg-white w-full h-8 mt-6 border rounded-md text-black placeholder-black"
            placeholder="Full Name"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
          <input
            className="bg-white w-full h-8 mt-6 border rounded-md text-black placeholder-black"
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <button className="float-left mt-6 ml-2  bg-blue-500 hover:bg-blue-700 hover:underline-offset-2 text-white font-bold py-2 px-4 rounded"
           onClick={
            registerUser
            
            } >
            Register
          </button>
          <br />

          <div className="mt-10 float-left">
            <label className="text-black">Already have an account?</label>
            <button
              className="ml-2  bg-blue-500 hover:bg-blue-700 hover:underline-offset-2 text-white font-bold py-2 px-4 rounded"
              onClick={()=>navigate('/login')}
              
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
