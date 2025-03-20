import React, { useContext, useEffect, useState } from 'react'
import UserActivity from "./UserActivity";
import userContext from '../context/user/userContext';
import Spinner from './Spinner';

function AllUserLogs() {
   const {user,getAllUserLogs,getAllUserLogsByOfficeId} = useContext(userContext);
   const [userLogs,setUserLogs]=useState([]);
   
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        if(user.Role==="Admin" || user.Role==="admin"){
          const userLogs = await getAllUserLogsByOfficeId(user.OfficeId);  // Fetch logs for the specific office
          setUserLogs(userLogs);
        }
        else{
          const userLogs = await getAllUserLogs();  // Fetch logs for the specific office
          setUserLogs(userLogs);
        }
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
    <div className="flex bg-blue-100 w-full p-3 h-screen overflow-scroll">
        <div className="flex items-start rounded-md bg-white p-3 w-full overflow-scroll">
            {isLoading ? <Spinner/>:<UserActivity userLogs={userLogs}/>}
        </div>
    </div>
  )
}

export default AllUserLogs