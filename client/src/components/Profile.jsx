import { useEffect, useState} from "react";

import Sidebar from "./Siderbar";
import {  userState ,tweetState} from "../state/atoms";
import { useRecoilValue,useSetRecoilState} from "recoil";
import TweetList from "./TweetList";
import EditProfile from "./EditProfile";
import axios from "axios";
import BASE_URL from "../../config";


function Profile() {
 
  const [showEditModal, setShowEditModal] = useState(false);
  const user = useRecoilValue(userState);
  const setTweets  = useSetRecoilState(tweetState);
  const setUser = useSetRecoilState(userState)
  const {_id} = useRecoilValue(userState);

  
 
  const toggleEditModal = () => {
    setShowEditModal(!showEditModal);
  };
  const fetchUserData = async  ()=> {
    try {
      
      const response = await axios.get(`${BASE_URL}/user/${_id}`,)
      
      const { user } = response.data;
      user.DateOfBirth = new Date(user.DateOfBirth).toISOString().split('T')[0];
      user.createdAt= new Date(user.createdAt).toISOString().split('T')[0];
    
      
      setUser(user);
      console.log(user.Username)
       setTweets(user.Tweets);
      
      
    
    } catch (error) {
      console.error("Error fetching user data", error);
      // Handle errors, e.g., show an error message
    }
  }

useEffect(()=>{
  if(_id){
  fetchUserData();}

},[_id])
 

  return (
    <>
      <div className="flex w-5/6 pt-0 mt-0 h-full mx-auto text-black">
        <Sidebar />
        <div className="w-4/6 min-h-screen right-0 top-0 px-5  border-2">
          <div className="flex justify-between bg-opacity-100">
            <h1 className="text-2xl font-bold">Profile</h1>
          </div>
          <div className="relative w-full h-36 bg-blue-500">
            {/* Circular image that spans half on upper and half on lower */}
            <img
              src="https://buffer.com/library/content/images/size/w1000/2022/03/sigmund-MQ2xYBHImKM-unsplash--1--1.jpg" // Replace with the actual profile image URL
              alt={`${user.Name}'s Profile`}
              className="w-32 h-32 rounded-full object-cover absolute top-1/2 transform -translate-y-1/6 left-20 -translate-x-1/2"
            />
          </div>
          <div >
            <div className=" flex flex-col">
              <div className="relative text-right mt-2">
                <button className="mr-10 bg-black rounded-md text-white p-2">Upload profile Pic</button>
                <button className="font-bold" onClick={toggleEditModal}>Edit</button>
                </div>
              <div className="mt-14 text-left">
                <div className="relative ">
                  <h2 className="text-xl font-semibold">{user.Name}</h2>
                  <p className="text-gray-600">@{user.Username}</p>
                </div>
                <div className="flex ">
                  <p className="text-gray-600">DOB: {user.DateOfBirth}</p>
                  <p className="text-gray-600 ml-44">Location: {user.Location}</p>

                </div>
                <p className="text-gray-600">Joined: {user.createdAt}</p>
                <div className="mt-6 flex">

                  <h4 className="text-md font-semibold">
                    Followers: {user.Followers.length}
                  </h4>
                  <h4 className="text-md font-semibold ml-12">
                    Following: {user.Following.length}
                  </h4>
                </div>
              </div>



            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-xl font-semibold">Tweets</h3>
            {/* Map through user's tweets and display them */}
            
          <TweetList/>
          </div>
          {showEditModal && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="bg-white p-4 max-w-md mx-auto rounded-lg shadow-lg">
                <EditProfile showEditModal={showEditModal} setShowEditModal={setShowEditModal} /> {/* Render the EditProfile component */}
                
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Profile;


