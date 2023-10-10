import { usernameSelector ,defaultUserStateSelector} from "../state/selectors";
import { useRecoilValue,useSetRecoilState } from "recoil";
import { useNavigate} from "react-router-dom";
import { userState } from "../state/atoms";

const Sidebar = () => {
  
  const navigate = useNavigate();
  const setUser = useSetRecoilState(userState)
  

  const username = useRecoilValue(usernameSelector)
  const defaultUserState = useRecoilValue(defaultUserStateSelector)
  
  const handleLogout =()=>{

    setUser(defaultUserState);
    localStorage.removeItem('userToken');
    
      // Fetch user data from the backend when the component mounts
      
      
    
  }
  return (

    <div className="w-1/6 min-h-min border-r-2 border-l-2 bg-white text-black " >
      <div className="flex sticky top-0 flex-col ">
        <div>
        <div>
          <img className="w-10 h-10" src="./../../message.png" />
        </div>
        <div>
          <ul className="space-y-2 p-4">
            <li className="flex items-center">
              <img src="./../../home.png" alt="Message Icon" className="mr-2 w-7 h-7" />
              <button className="block bg-transparent border-none focus:outline-none" onClick={()=>navigate('/home')}>Home</button>
            </li>
            <li className="flex items-center">
              <img src="./../../profile.png" alt="Home Icon" className="mr-2 w-7 h-7" />
              <button className="block bg-transparent border-none focus:outline-none" onClick={()=>{
                navigate('/profile');
              }}>Profile</button>
            </li>
            {username?
            <li className="flex items-center">
              <img  src="./../../logout.png" alt="Profile Icon" className="mr-2 w-7 h-7" />
              <button className="block bg-transparent border-none focus:outline-none" onClick={handleLogout}>Logout</button>
            </li>:
            <li className="flex items-center">
            <img  src="./../../logout.png" alt="Profile Icon" className="mr-2 w-7 h-7" />
            <button className="block bg-transparent border-none focus:outline-none" onClick={()=>navigate('/login')}>Login</button>
          </li>
            }
            <li ></li>
          </ul>
        </div>
        <div className="flex-grow"></div>
        </div>

        <div className="mt-auto">
          <h4>{username}</h4>

        </div>
        </div>


      
    </div>



  );

}
export default Sidebar;