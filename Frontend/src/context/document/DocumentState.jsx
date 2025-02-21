import React, { useState } from "react";
import axios from "axios";
import DocumentContext from "./documentContext";

const DocumentState = (props) => {
  const host = "http://localhost:3000";
  const documentInitial = [];
  const [documents, setDocuments] = useState(documentInitial);
  const [documentTypes, setDocumentTypes] = useState(documentInitial);
  const [users, setUsers] = useState(documentInitial);
  // Get a Note
  const getAllDocuments = async () => {
    // API call
    const response = await axios.get(`${host}/api/document/getall`);
    const json = await response.data;
    setDocuments(json);
  };

  const getAllDocumentType = async () => {
    const response = await axios.get(`${host}/api/documentType/getall`);
    const json = await response.data;
    // console.log(json)
    setDocumentTypes(json);
  };

  const getUsers = async () => {
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
    // console.log(json);
    setUsers(json);
  };

  const uploadDocument = async (formData) => {
    console.log("Inside upload Document");
    try {
      const response = await axios.post(
        `${host}/api/document/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error Uploading Document",
        error.response?.data || error.message
      );
    }
  };

  const uploadAttachedDocument = async (formData) => {
    console.log("Inside attached upload Document");
    try {
      const response = await axios.post(
        `${host}/api/attachedDocument/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error Uploading Document",
        error.response?.data || error.message
      );
    }
  };

  const addDocument = async (
    IsInward,
    DocumentName,
    DocumentTypeId,
    LetterSerialNumber,
    InwardOutwardReferenceDocumentId,
    EndUserId,
    DocumentDescription,
    DocumentPath,
    SenderId,
    ReceiverId,
    BillingInfo
  ) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.post(`${host}/api/document/add`, {
        IsInward,
        DocumentName,
        DocumentTypeId,
        LetterSerialNumber,
        InwardOutwardReferenceDocumentId,
        EndUserId,
        DocumentDescription,
        DocumentPath,
        SenderId,
        ReceiverId,
        BillingInfo,
      },{
        headers: {
          accessToken: `${accessToken}`,
        },
      });
      const json = await response.data;
      console.log(json);
      return json;
    } catch (error) {
      console.log("error in edding document", error);
    }
  };

  const addAttachedDocument = async (
    DocumentId,
    AttachedDocumentPath
  ) => {
    try {
      const response = await axios.post(`${host}/api/attachedDocument/add`, {
        DocumentId,
        AttachedDocumentPath
      });
      const json = await response.data;
      console.log(json);
      return response.data;
    } catch (error) {
      console.log("error in edding attached document", error);
    }
  };


  // Status
  const getStatusById= async(statusId)=>{
    try{
      const response = await axios.get(`${host}/api/status/get/${statusId}`);
      
      return response.data;
    }
    catch(error){
      console.log("error in getting status by id", error);
    }
  }

    // Fetch the PDF report
    const fetchPdfReport = async () => {
      try {
        const response = await axios.get(`${host}/api/report/pdf`, {
          responseType: 'blob',  // This ensures the response is treated as a file
        });
        // Create a URL for the blob (PDF)
        const url = window.URL.createObjectURL(new Blob([response.data]));
        // Optional: You can return the URL, or you can trigger download here.
        return url;
      } catch (error) {
        console.log("Error in getting PDF report:", error);
      }
    };
    
    const fetchExcelReport = async () => {
      try {
        const response = await axios.get(`${host}/api/report/excel`, {
          responseType: 'blob',  // This ensures the response is treated as a file
        });
    
        // Create a URL for the blob (Excel)
        const url = window.URL.createObjectURL(new Blob([response.data]));
    
        // Optional: You can return the URL, or you can trigger download here.
        return url;
      } catch (error) {
        console.log("Error in getting Excel report:", error);
      }
    };
    

    const getAllDocumentLogs = async () => {
      try {
        const response = await axios.get(
          `${host}/api/documentLog/getall`,
        );
  
        // Return the document log details
        return response.data;
      } catch (error) {
        console.error(
          "Error fetching document log details:",
          error.response?.data || error.message
        );
      }
    };
  

  return (
    <DocumentContext.Provider
      value={{
        documents,
        setDocuments,
        getAllDocuments,
        documentTypes,
        setDocumentTypes,
        getAllDocumentType,
        users,
        setUsers,
        getUsers,
        uploadDocument,
        addDocument,
        uploadAttachedDocument,
        addAttachedDocument,
        getStatusById,
        fetchPdfReport,
        fetchExcelReport,
        getAllDocumentLogs
      }}
    >
      {props.children}
    </DocumentContext.Provider>
  );
};

export default DocumentState;
