
import { useRecoilValue } from 'recoil';
import axios from 'axios';
import BASE_URL from '../../config';

import { tweetState } from './../state/atoms'; // Create this atom separately

function TweetList() {
  const tweets = useRecoilValue(tweetState);
  const handleRetweet = async (id)=>{
  const response = await axios.post(`${BASE_URL}/tweet/${id}/like`,{
    headers:{
      Authorization:"Bearer "+localStorage.getItem('userToken'),
    }
  })
  


  }
  const handleLike =()=>{

  }
  const handleReply =()=>{

  }

  return (
    <div className="container mx-auto p-4 text-black">
      {tweets?tweets.map((tweet) => (
        <div key={tweet._id} className="bg-white rounded shadow p-4 mb-4 text-left">
          <div className="flex items-center">
            <img
              src={tweet.TweetedBy.ProfilePicture} // Replace with actual profile picture field
              alt={`${tweet.TweetedBy.Name}'s profile`}
              className="w-10 h-10 rounded-full mr-2"
            />
            <div>
              
              <p className="text-gray-500">@{tweet.TweetedBy.Username||tweet.TweetedBy}</p>
            </div>
          </div>
          <div>
          <p className="mt-2">{tweet.Content}</p>
          {tweet.Image && (
            <img 
             src={`data:image/jpeg;base64,${tweet.Image}`
          } alt="Tweet Image"
          className="h-50" />
          )}
          </div>
          
          <div className="flex justify-between mt-4">
            <button className="text-blue-500 hover:underline"
            onClick={handleLike(tweet._id)}>Like</button>
            <button className="text-blue-500 hover:underline" 
            onClick={handleLike(tweet._id)}>Retweet</button>
            <button className="text-blue-500 hover:underline"
            onClick={handleLike(tweet._id)}>Reply</button>
          </div>
        </div>
      )):<div><h3>Unable to load tweets</h3></div>}
    </div>
  );
}

export default TweetList;
