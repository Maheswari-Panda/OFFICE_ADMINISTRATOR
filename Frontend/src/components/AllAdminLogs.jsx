import React, { useContext, useEffect, useState } from 'react'
import UserActivity from "./UserActivity";
import userContext from '../context/user/userContext';
import Spinner from './Spinner';
import AdminActivity from './AdminActivity';

function AllAdminLogs() {
   const {user,getAllAdminLogs} = useContext(userContext);
   const [adminLogs,setAdminLogs]=useState([]);
   
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchLogs = async () => {
      try {
          const adminlogs = await getAllAdminLogs();  
          setAdminLogs(adminlogs);
      } catch (error) {
        console.error("Failed to load admin logs:", error);
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
            {isLoading ? <Spinner/>:<AdminActivity adminLogs={adminLogs}/>}
        </div>
    </div>
  )
}


export default AllAdminLogs