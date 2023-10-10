import { useState } from 'react';
import axios from 'axios';
import BASE_URL from '../../config';


function Tweet() {
  const [tweetContent, setTweetContent] = useState('');
  const [tweetImage, setTweetImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleContentChange = (e) => {
    setTweetContent(e.target.value);
  };
  const handleRemove = ()=>{
    setImagePreview(null);
    tweetImage(null);

  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setTweetImage(file);
     // Create a preview URL for the selected image
     const previewURL = URL.createObjectURL(file);
     setImagePreview(previewURL);
  };

  const handleTweetSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('content', tweetContent);
      formData.append('image', tweetImage);

      // Send a POST request to your server with content and image
      await axios.post(BASE_URL+'/tweet', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Required for file uploads
          'Authorization':"Bearer "+localStorage.getItem('userToken')
        },
      });
     // Clear the form
      setTweetContent('');
      setTweetImage(null);
      setImagePreview(null);

      // Optionally, you can handle success or display a confirmation message
      console.log('Tweet sent successfully');
    
    } catch (error) {
      console.error('Error sending tweet:', error);
      // Handle errors here
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Compose a New Tweet</h2>
      <form onSubmit={handleTweetSubmit}>
        <div className="mb-4">
          <textarea
            className="w-full p-2 border rounded-md"
            placeholder="What's happening?"
            value={tweetContent}
            onChange={handleContentChange}
            rows={4}
          ></textarea>
        </div>
        <div className="mb-4">
        {!imagePreview?<input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="border rounded-md p-2"
        />:
        <button className='text-black-400 bg-blue-500' onClick={handleRemove}>REmove</button>
        }
           {imagePreview && (
            <img
              src={imagePreview}
              alt="Selected Image"
              className="mt-2  h-40"
            />
          )}
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Tweet
          </button>
        </div>
      </form>
      

    </div>
  );
}


export default Tweet;
