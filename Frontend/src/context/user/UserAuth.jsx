import { useEffect, useState } from "react";
import UserContext from "./userContext";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const UserAuth = ({ children }) => {
  const host = "http://localhost:3000";
  const [user, setUser] = useState(null);
  
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
      console.error("Error during login:", error.response?.data || error.message);
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
  
  const logout = () => {
    localStorage.clear(); // Clear the token and expiration time
    setUser(null); // Reset the user state
    // Optionally redirect the user to the login page
    window.location.href = '/';
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
      console.error("Error fetching user details:", error.response?.data || error.message);
    }
  };

  // const checkTokenExpiration = () => {
  //   const token = localStorage.getItem("accessToken");
  //   if (!token) return false;

  //   try {
  //     const decodedToken = jwt.decode(token); // Decode the JWT token
  //     if (decodedToken.exp * 1000 < Date.now()) {
  //       // Token expired
  //       return true;
  //     }
  //     return false;
  //   } catch (error) {
  //     return true; // If decoding fails, consider token expired
  //   }
  // };

  //   // useEffect to monitor token expiration
  //   useEffect(() => {
  //     const tokenExpired = checkTokenExpiration();
  //     if (tokenExpired) {
  //       // console.log("Sesssion expired");
  //       // logout(); // Log out if the token is expired
  //       alert("Session expired, please log in again");
  //     }
  //   }, []);

  return (
    <UserContext.Provider value={{ user, setUser, login, logout, getUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserAuth;
