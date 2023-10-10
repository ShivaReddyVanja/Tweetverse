import Sidebar from "./Siderbar";
import { tweetState} from "./../state/atoms";
import {  useSetRecoilState } from "recoil";
import { useEffect,useState } from "react";
import BASE_URL from "../../config";
import TweetList from "./TweetList";
import axios from 'axios';
import Tweet from "./Tweet";

export const Home = () => {
    const [showTweetModal, setShowTweetModal] = useState(false);
    const setTweets = useSetRecoilState(tweetState);
    const fetchTweets =async  ()=>{
        const response = await axios.get(`${BASE_URL}/tweet`,{})
        if(response.status===200){
            setTweets(response.data.tweets);

        }
    }
    const toggleTweetPopup = () => {
        setShowTweetModal(!showTweetModal);
      };
    

    useEffect(()=>{
        fetchTweets();

    },[])
   
    return (
        <div className="flex w-5/6 pt-0 mt-0 h-full mx-auto" >
            
            <Sidebar/>
            
                    
            <div className="w-4/6 min-h-screen right-0 top-0 p-5  border-2">
               <div className="flex  sticky top-0 justify-between text-black bg-opacity-0 " >
               <h4 className="font-semibold">Home</h4>
               <button className="bg-blue-400 p-2 rounded-md" onClick={toggleTweetPopup}>Tweet</button>
               </div>
                  
               <div>
               <TweetList />

               </div>
               </div>
                {/* Conditionally render the Tweet component as a modal */}
      {showTweetModal && (
        <div className="fixed inset-0 flex items-center justify-center z-10">
          <div className="absolute inset-0 bg-gray-800 opacity-50"></div>
          <div className="z-20 bg-white p-4 rounded-md shadow-lg">
            {/* Pass any necessary props to the Tweet component */}
            <Tweet/>
            <button  className="bg-gray-400 text-white px-4 py-2 rounded-md top-0 right-0 hover:bg-gray-500" onClick={toggleTweetPopup}>Close</button>
          </div>
        </div>
      )}
        </div>

       

    );
}