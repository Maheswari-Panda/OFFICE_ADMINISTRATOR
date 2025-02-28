import React, { useState } from "react";
import OfficeContext from "./officeContext";
import axios from "axios";

function OfficeState(props) {
  const host = "http://localhost:3000";
  const officeInitial = [];
  const [offices, setOffices] = useState(officeInitial);
  const [office, setOffice] = useState(officeInitial);

  const getAllOffices = async () => {
    try {
      const response = await axios.get(`${host}/api/office/getall`);
      const json = await response.data;
      setOffices(json);
    } catch (error) {
      console.log("error getting all offices details", error);
    }
  };

  const getOfficeById = async (officeId) => {
    try {
      const response = await axios.get(`${host}/api/office/get/${officeId}`);
      const json = await response.data;
      setOffice(json);
      return json;
    } catch (error) {
      console.log("error getting office By Id", error);
    }
  };

  const addOffice = async (officeName, officeLocation, officeContact) => {
    try {
      const response = await axios.post(`${host}/api/office/add`, {
        officeName,
        officeLocation,
        officeContact,
      });
      return response.data;
    } catch (error) {
      console.log("error adding office By Id", error);
    }
  };

  const updateOffice = async (officeId,officeName, officeLocation, officeContact) => {
    try {
      const response = await axios.put(`${host}/api/office/update/${officeId}`, {
        officeName,
        officeLocation,
        officeContact,
      });
      return response.data;
    } catch (error) {
      console.log("error updating office", error);
    }
  };

  const deleteOffice = async (officeId) => {
    try {
      const response = await axios.delete(`${host}/api/office/delete/${officeId}`);
      console.log(response);
      return response.data;
    } catch (error) {
      console.log("error deleting office", error);
    }
  };

  return (
    <OfficeContext.Provider
      value={{ offices,setOffices, getAllOffices, office, getOfficeById, addOffice,updateOffice,deleteOffice }}
    >
      {props.children}
    </OfficeContext.Provider>
  );
}

export default OfficeState;
