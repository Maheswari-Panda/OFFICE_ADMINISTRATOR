import { useEffect, useState } from "react";
import UserContext from "./userContext";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const UserAuth = ({ children }) => {
  const host = "http://localhost:3000";
  const initialUsers = [];
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState(initialUsers);

  // Login function

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${host}/api/user/login`, {
        email,
        password,
      });

      // Check if the response was successful
      const data = response.data;

      // Decode the token to get the expiration time (exp)
      const decodedToken = jwtDecode(data.accessToken);
      console.log(decodedToken);
      const expirationTime = decodedToken.exp * 1000; // Convert exp to milliseconds

      // Store the token and expiration time
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("tokenExpirationTime", expirationTime);

      // Fetch user details
      const userDetails = await getUser(data.accessToken);
      setUser(userDetails); // Update the user state

      // Start a timer to log the user out when the token expires
      startTokenExpirationTimer(expirationTime);

      return data.accessToken; // Return the access token
    } catch (error) {
      console.error(
        "Error during login:",
        error.response?.data || error.message
      );
      return false;
    }
  };

  const startTokenExpirationTimer = (expirationTime) => {
    const currentTime = Date.now();
    const timeLeft = expirationTime - currentTime;

    if (timeLeft <= 0) {
      // If the token is already expired, log out the user immediately

      // Log out if the token is expired
      console.log("Sesssion expired");
      logout();
      alert("Session expired, please log in again");
    } else {
      // Set a timeout to log out the user when the token expires
      setTimeout(() => {
        console.log("Sesssion expired");
        logout();
        alert("Session expired, please log in again");
      }, timeLeft); // Log out when the token expires
    }
  };

  const logout = async () => {
    const result = await axios.post(`${host}/api/userLog/add`,{userId : user.UserId,action :'Logged Out'});
    console.log("User Log table details added logout ",result);

    localStorage.clear(); // Clear the token and expiration time
    setUser(null); // Reset the user state
    
    // Optionally redirect the user to the login page
    window.location.href = "/";
    return true;
  };

  // Get the logged-in user details
  const getUser = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      const response = await axios.post(
        `${host}/api/user/getuser`,
        {}, // Empty request body
        {
          headers: {
            accessToken: `${accessToken}`,
          },
        }
      );

      // Return the user details
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching user details:",
        error.response?.data || error.message
      );
    }
  };

  // Get the logged-in user details
  const getUserById = async (userId) => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      const response = await axios.post(
        `${host}/api/user/get/${userId}`,
        {}, // Empty request body
        {
          headers: {
            accessToken: `${accessToken}`,
          },
        }
      );
      // Return the user details
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching user details:",
        error.response?.data || error.message
      );
    }
  };

  const createUser = async (
    email,
    password,
    ERN,
    firstName,
    middleName,
    lastName,
    role,
    officeId,
    profileImgUrl
  ) => {
    try {
      const response = await axios.post(`${host}/api/user/create`, {
        email,
        password,
        ERN,
        firstName,
        middleName,
        lastName,
        role,
        officeId,
        profileImgUrl,
      });
      // console.log(response);
      return response.data;
    } catch (error) {
      console.error(
        "Error creating user",
        error.response?.data || error.message
      );
      // console.log(error.message);
      return error.response?.data || error.message;
    }
  };

  const updateUser = async (
    userId,
    email,
    ERN,
    firstName,
    middleName,
    lastName,
    role,
    officeId,
    profileImgUrl
  ) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.put(`${host}/api/user/update/${userId}`, {
        email,
        ERN,
        firstName,
        middleName,
        lastName,
        role,
        officeId,
        profileImgUrl,
      },{
        headers: {
          accessToken: `${accessToken}`,
        },
      });
console.log(response);
      const userDetails = await getUser(accessToken);
      // console.log(userDetails);
      setUser(userDetails);
      // console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating user : ",error.response?.data || error.message);
    }
  };

  const uploadProfileImage = async (formData) => {
    try {
      const response = await axios.post(`${host}/api/user/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      console.error(
        "Error Uploading user profile",
        error.response?.data || error.message
      );
    }
  };

  const getAllUsers = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${host}/api/user/getall`,
        {}, // Empty request body
        {
          headers: {
            accessToken: `${accessToken}`,
          },
        }
      );
      const json = await response.data;
      setUsers(json);
      return json;
    } catch (error) {
      console.error(
        "Error Getting all user details",
        error.response?.data || error.message
      );
    }
  };

   // Get the logged-in user details
   const getUserLogs = async (userId) => {
    try {
      const response = await axios.get(
        `${host}/api/userLog/get/${userId}`,
      );

      // Return the user details
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching user log details:",
        error.response?.data || error.message
      );
    }
  };

  const getAllUserLogs = async () => {
    try {
      const response = await axios.get(
        `${host}/api/userLog/getall`,
      );

      // Return the user details
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching user log details:",
        error.response?.data || error.message
      );
    }
  };

  const forgetPassword = async(email)=>{
    try{
      const response = await axios.post(`${host}/api/user/forgetpassword`,{email});
      return response.data;
    }
    catch(error){
      console.log('error in sending forget password email to user',
        error.response?.data || error.message);
    }
  }

  const resetPassword = async(userId,email,newPassword)=>{
    try{
      const response = await axios.put(`${host}/api/user/updatepassword`,{userId,email,newPassword});
      return response.data;
    }
    catch(error){
      console.log('error in updating user password',
        error.response?.data || error.message);
    }
  }

  const verifyResetPasswordToken = async(token)=>{
    try {
      const response = await axios.post(`${host}/api/user/verify-reset-link?token=${token}`);
      return response.data;
    } catch (error) {
      console.log("error in verifying the reset password link",error);
    }
  }

  
  const deleteUser = async(userId)=>{
    try {
      const response = await axios.delete(`${host}/api/user/delete/${userId}`);
      console.log(response);
      return response.data;
    } catch (error) {
      console.log("error deleting user",error);
    }
  }

  return (
    <UserContext.Provider
      value={{
        user,
        users,
        setUser,
        login,
        logout,
        getUser,
        getUserById,
        createUser,
        uploadProfileImage,
        getAllUsers,
        updateUser,
        getUserLogs,
        getAllUserLogs,
        forgetPassword,
        resetPassword,
        verifyResetPasswordToken,
        deleteUser
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserAuth;
