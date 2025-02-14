import React, { useContext, useEffect, useState } from 'react'
import UserActivity from "./UserActivity";
import userContext from '../context/user/userContext';

function AllUserLogs() {
   const {getAllUserLogs} = useContext(userContext);
   const [userLogs,setUserLogs]=useState([]);
  
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const userLogs = await getAllUserLogs();  // Fetch logs for the specific user
        setUserLogs(userLogs);
      } catch (error) {
        console.error("Failed to load user logs:", error);
      }
    };

    fetchLogs();
  }, []);

  // console.log(userLogs);
  return (
    <div className="flex bg-blue-100 w-full p-3 h-full">
        <div className="flex items-center justify-center rounded-md bg-white p-3 w-full">
            <UserActivity userLogs={userLogs}/>
        </div>
    </div>
  )
}

export default AllUserLogs