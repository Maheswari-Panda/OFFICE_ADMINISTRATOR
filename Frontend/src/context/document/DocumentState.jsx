import React,{ useState } from 'react'
import axios from "axios";
import DocumentContext from "./documentContext";


const DocumentState=(props)=> {
  const host = "http://localhost:3000";
  const documentInitial = []
  const [documents, setDocuments] = useState(documentInitial);
  const [documentTypes, setDocumentTypes] = useState(documentInitial);
  const [users,setUsers]=useState(documentInitial);
   // Get a Note
   const getDocuments = async () =>{
    // API call
        const response = await axios.get(`${host}/api/document/getall`);
        const json = await response.data;
        setDocuments(json)
    }

    const getAllDocumentType= async()=>{
        const response = await axios.get(`${host}/api/documentType/getall`);
        const json = await response.data;
        // console.log(json)
        setDocumentTypes(json)
    }

    const getUsers=async()=>{
      const accessToken = localStorage.getItem("accessToken");
        const response = await axios.post(`${host}/api/user/getall`,
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
    }

    const uploadDocument =async(formData)=>{
      console.log("Inside upload Document");
      try {
        const response = await axios.post(`${host}/api/document/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
      } catch (error) {
        console.error("Error Uploading Document", error.response?.data || error.message);
        
      }
  }

  const addDocument = async(
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
    Feedback,
    AttachedDocumentPath)=>{
    try {
      
      const response = await axios.post(`${host}/api/document/add`,
        {IsInward,
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
          Feedback,
          AttachedDocumentPath}
      );
        const json = await response.data;
        console.log(json);
        return response.data;
    } catch (error) {
      console.log("error in edding document",error);
    }
  }

  return (
    <DocumentContext.Provider value={{documents,setDocuments,getDocuments,documentTypes,setDocumentTypes,getAllDocumentType,users,setUsers,getUsers,uploadDocument,addDocument}}>
        {props.children}
    </DocumentContext.Provider>
  )
}

export default DocumentState