import React, { useContext, useEffect, useState } from 'react'
import UserActivity from "./UserActivity";
import userContext from '../context/user/userContext';
import Spinner from './Spinner';

function AllUserLogs() {
   const {getAllUserLogs} = useContext(userContext);
   const [userLogs,setUserLogs]=useState([]);
   
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const userLogs = await getAllUserLogs();  // Fetch logs for the specific user
        setUserLogs(userLogs);
      } catch (error) {
        console.error("Failed to load user logs:", error);
      }
      finally{
        setTimeout(()=>{
          setIsLoading(false);
        },500);
      }
    };

    fetchLogs();
  }, []);

  // console.log(userLogs);
  return (
    <div className="flex bg-blue-100 w-full p-3 h-screen">
        <div className="flex items-start rounded-md bg-white p-3 w-full">
            {isLoading ? <Spinner/>:<UserActivity userLogs={userLogs}/>}
        </div>
    </div>
  )
}

export default AllUserLogs