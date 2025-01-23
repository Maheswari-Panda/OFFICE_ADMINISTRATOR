import { useState } from "react";
import UserContext from "./userContext";

const UserAuth = ({ children }) => {
  const host = "http://localhost:3000";

  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    console.log("Logged in with by userAuth " + email + " : " + password);

    try {
      const response = await fetch(`${host}/api/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        throw new Error("Failed to login");
      }
      const data = await response.json();
      console.log(data.authToken); // Access the token
      // Store the authtoken in local storage
      localStorage.setItem('authToken', data.authToken);

      const userDetailsResponse = await fetch(`${host}/api/user/getuser`, { 
        method: "POST",
        headers: {
          "auth-token":`${data.authToken}`, 
        },
      });
      
      if (!userDetailsResponse.ok) {
        throw new Error("Failed to fetch user details");
      }
      
      const userDetails = await userDetailsResponse.json();
      setUser(userDetails); // Update the user state in the context
      
      // Return the auth token if login is successful
      return data.authToken;
    } catch (error) {
      console.error("Error during login:", error.message);
      return false; // Return null if an error occurs
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    return true;
  };

  // get logged in user details
  const getUser= async()=>{
    try {
      const storedToken = localStorage.getItem('authToken');
      const response = await fetch(`${host}/api/user/getuser`, {
        method: "POST",
        headers: {
          "auth-token":{storedToken}
        },
      })

      if (!response.ok) {
        throw new Error("Failed to login");
      }

      const data = await response.json();
      // console.log(data.Email); // Access the token
      // setUser(data);
      return data;
    } catch (error) {
      console.error("Error during login:", error.message);
    }
  }

  return (
    <UserContext.Provider value={{ user, setUser, login, logout,getUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserAuth;
