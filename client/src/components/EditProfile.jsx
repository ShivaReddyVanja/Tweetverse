import { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "../../config";
import { useRecoilValue } from "recoil";
import { userState } from "../state/atoms";
import PropTypes from "prop-types";

function EditProfile({setShowEditModal,showEditModal}) {
    const {_id} = useRecoilValue(userState);
  const [formData, setFormData] = useState({
    Name: "",
    DateOfBirth: "",
    Location: "",
  });

  const [message, setMessage] = useState("");
  
  useEffect(() => {
    // Fetch the user's current profile data to pre-fill the form
    async function fetchUserData() {
      try {
        const response = await axios.get(`${BASE_URL}/user/${_id}`);
        const { user } = response.data;
        setFormData({
          Name: user.Name,
          DateOfBirth: user.DateOfBirth,
          Location: user.Location,
        });
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    }

    fetchUserData();
  },[]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("trying to update the user data")
      const response = await axios.put(
        `${BASE_URL}/user/6514871be045cf80b5f04c99`,
        formData,{
          headers:{

          Authorization:`Bearer ${localStorage.getItem('userToken')}`
        }}
      );
      if (response.status === 201) {
        setMessage("Profile data updated successfully");
        
      }
    } catch (error) {
      console.error("Error updating profile", error);
      setMessage("Error updating profile. Please try again later.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-lg">
    <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="Name" className="block text-sm font-medium text-gray-600">
          Name:
        </label>
        <input
          type="text"
          id="Name"
          name="Name"
          value={formData.Name}
          onChange={handleChange}
          className="mt-1 p-2 rounded-md border text-white bg-gray-700 w-full focus:ring focus:ring-indigo-300 focus:outline-none"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="DateOfBirth" className="block text-sm font-medium text-gray-600">
          Date of Birth:
        </label>
        <input
          type="date"
          id="DateOfBirth"
          name="DateOfBirth"
          value={formData.DateOfBirth}
          onChange={handleChange}
          className="mt-1 p-2 rounded-md border bg-gray-700 border-gray-300 w-full focus:ring focus:ring-indigo-300 focus:outline-none"
          style={{color:"white"}}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="Location" className="block text-sm font-medium text-gray-600">
          Location:
        </label>
        <input
          type="text"
          id="Location"
          name="Location"
          value={formData.Location}
          onChange={handleChange}
          className="mt-1 p-2 rounded-md border text-white bg-gray-700 border-gray-300 w-full focus:ring focus:ring-indigo-300 focus:outline-none"
        />
      </div>
      <button
        type="submit"
        className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 focus:outline-none"
      >
        Save Changes
      </button>
    </form>
    {message && <p className="mt-4 text-sm text-red-500">{message}</p>}
  </div>
  );
}
EditProfile.propTypes ={
  setShowEditModal :PropTypes.func,
  showEditModal:PropTypes.bool
}

export default EditProfile;
