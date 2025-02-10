import React,{ useState } from 'react'
import OfficeContext from './officeContext';
import axios from "axios";

function OfficeState(props) {
     const host = "http://localhost:3000";
      const officeInitial = []
      const [offices, setOffices] = useState(officeInitial);
      const [office, setOffice] = useState(officeInitial);

      const getAllOffices = async () =>{
            try{
              const response = await axios.get(`${host}/api/office/getall`);
            const json = await response.data;
            setOffices(json)
            }
            catch(error){
              console.log("error getting all offices details",error);
            }
        }

    const getOfficeById = async(officeId)=>{
        try{
            const response = await axios.get(`${host}/api/office/get/${officeId}`);
            const json = await response.data;
            setOffice(json);
        }
        catch(error){
          console.log("error getting office By Id",error);
        }
    } 

  return (
    <OfficeContext.Provider value={{offices,getAllOffices,office,getOfficeById}}>
        {props.children}
    </OfficeContext.Provider>
  )
}

export default OfficeState