import React, { act, useState } from "react";
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

  const getAllDocumentsReceivedDispatched = async () => {
    try {
      const response = await axios.post(
        `${host}/api/document/getall_receieved_dispatched`
      );
      const json = await response.data;
      // console.log(response)
      if (response) {
        setDocuments(json);
      }
      return json;
    } catch (err) {
      console.log("Error getting received or dispatched documents");
    }
  };

  const getAllDocumentsReceivedDispatchedByOfficeId = async (officeId) => {
    try {
      const response = await axios.post(
        `${host}/api/document/getall_receieved_dispatched/${officeId}`
      );
      const json = await response.data;
      // console.log(response)
      if (response) {
        setDocuments(json);
      }
      return json;
    } catch (err) {
      console.log(
        "Error getting received or dispatched documents by office id"
      );
    }
  };

  const getPendingDocumentsForUserByUserId = async (userId) => {
    try {
      const response = await axios.post(
        `${host}/api/document/getpending_foruser/${userId}`
      );
      const json = await response.data;
      // console.log(response)
      if (response) {
        setDocuments(json);
      }
      return json;
    } catch (err) {
      console.log("Error getting pending documents for logged in user", err);
    }
  };

  const getApprovedDocumentsForUserByUserId = async (userId) => {
    try {
      const response = await axios.post(
        `${host}/api/document/getapproved_foruser/${userId}`
      );
      const json = await response.data;
      // console.log(response)
      if (response) {
        setDocuments(json);
      }
      return json;
    } catch (err) {
      console.log("Error getting approved documents for logged in user", err);
    }
  };

  const getReturnedDocumentsForUserByUserId = async (userId) => {
    try {
      const response = await axios.post(
        `${host}/api/document/getreturned_foruser/${userId}`
      );
      const json = await response.data;
      // console.log(response)
      if (response) {
        setDocuments(json);
      }
      return json;
    } catch (err) {
      console.log("Error getting returned documents for logged in user", err);
    }
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
      const response = await axios.post(
        `${host}/api/document/add`,
        {
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
        },
        {
          headers: {
            accessToken: `${accessToken}`,
          },
        }
      );
      const json = await response.data;
      console.log(json);
      return json;
    } catch (error) {
      console.log("error in edding document", error);
    }
  };

  const updateDocument = async (
    documentId,
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
    OfficeId
  ) => {
    try {
      const response = await axios.put(
        `${host}/api/document/update/${documentId}`,
        {
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
          OfficeId,
        }
      );
      const json = await response.data;
      console.log(json);
      return json;
    } catch (error) {
      console.log("error in updating document", error);
    }
  };

  const addAttachedDocument = async (DocumentId, AttachedDocumentPath) => {
    try {
      const response = await axios.post(`${host}/api/attachedDocument/add`, {
        DocumentId,
        AttachedDocumentPath,
      });
      const json = await response.data;
      console.log(json);
      return response.data;
    } catch (error) {
      console.log("error in edding attached document", error);
    }
  };

  const getAttachedDocument = async (DocumentId) => {
    try {
      const response = await axios.get(
        `${host}/api/attachedDocument/get/${DocumentId}`
      );
      const json = await response.data;
      // console.log(json);
      return json.data[0];
    } catch (error) {
      console.log("error in getting attached document", error);
    }
  };

  const updateAttachedDocument = async (DocumentId, AttachedDocumentPath) => {
    try {
      const response = await axios.put(
        `${host}/api/attachedDocument/update/${DocumentId}`,
        { attachedDocumentPath: AttachedDocumentPath }
      );
      const json = await response.data;
      console.log(json);
      return json;
    } catch (error) {
      console.log("error in updating attached document", error);
    }
  };

  // Status
  const getStatusById = async (statusId) => {
    try {
      const response = await axios.get(`${host}/api/status/get/${statusId}`);

      return response.data;
    } catch (error) {
      console.log("error in getting status by id", error);
    }
  };

  // Fetch the PDF report
  const fetchPdfReport = async (startDate, endDate) => {
    try {
      const response = await axios.get(`${host}/api/report/pdf`, {
        responseType: "blob", // This ensures the response is treated as a file
        params: {
          startDate: startDate, // Format in YYYY-MM-DD
          endDate: endDate,
        },
      });
      // Create a URL for the blob (PDF)
      const url = window.URL.createObjectURL(new Blob([response.data]));
      // Optional: You can return the URL, or you can trigger download here.
      return url;
    } catch (error) {
      console.log("Error in getting PDF report:", error);
    }
  };

  const fetchExcelReport = async (startDate, endDate) => {
    try {
      const response = await axios.get(`${host}/api/report/excel`, {
        responseType: "blob", // This ensures the response is treated as a file
        params: {
          startDate: startDate, // Format in YYYY-MM-DD
          endDate: endDate,
        },
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
      const response = await axios.get(`${host}/api/documentLog/getall`);

      // Return the document log details
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching document log details:",
        error.response?.data || error.message
      );
    }
  };

  const addDocumentLog = async (userId, documentId, action) => {
    try {
      const response = await axios.post(`${host}/api/DocumentLog/add`, {
        userId,
        documentId,
        action,
      });
      const json = await response.data;
      console.log(json);
      return response.data;
    } catch (error) {
      console.log("error in edding attached document", error);
    }
  };

  const getDocumentLogsByDocumentId = async (documentId) => {
    try {
      const response = await axios.get(
        `${host}/api/documentLog/get_by_document/${documentId}`
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

  const getDocumentLogsByOfficeId = async (officeId) => {
    try {
      const response = await axios.get(
        `${host}/api/documentLog/get_by_office/${officeId}`
      );
      // console.log(response);
      // Return the document log details
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching document log details of this office:",
        error.response?.data || error.message
      );
    }
  };

  const approveDocument = async (documentId, action) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${host}/api/document/approve/${documentId}`,
        { action },
        {
          headers: {
            accessToken: `${accessToken}`,
          },
        }
      );

      // Return the document log details
      return response.data;
    } catch (error) {
      console.error(
        "Error approving document by user:",
        error.response?.data || error.message
      );
    }
  };

  const resendDocumentForApproval = async (documentId, action) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${host}/api/document/resend_for_approval/${documentId}`,
        { action },
        {
          headers: {
            accessToken: `${accessToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error resending document for approval:",
        error.response?.data || error.message
      );
    }
  };

  const addFeedback = async (documentId, feedbackDescription, receiverId) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${host}/api/feedback/add`,
        { documentId, feedbackDescription, receiverId },
        {
          headers: {
            accessToken: `${accessToken}`,
          },
        }
      );

      // Return the document log details
      return response.data;
    } catch (error) {
      console.error(
        "Error adding feedback by user:",
        error.response?.data || error.message
      );
    }
  };

  const returnDocument = async (documentId, action) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${host}/api/document/return/${documentId}`,
        { action },
        {
          headers: {
            accessToken: `${accessToken}`,
          },
        }
      );

      // Return the document log details
      return response.data;
    } catch (error) {
      console.error(
        "Error returning document by user:",
        error.response?.data || error.message
      );
    }
  };

  const getDocumentsByStatusName = async (officeId, statusName) => {
    try {
      const response = await axios.post(
        `${host}/api/document/get_by_status/${officeId}`,
        { statusName }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error getting document by given officeid or statusName :",
        error.response?.data || error.message
      );
    }
  };

  const getFeedBacksByDocumentId = async (documentId) => {
    try {
      const response = await axios.get(
        `${host}/api/feedback/document/${documentId}`
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error getting feedback by given documentId : ",
        error.response?.data || error.message
      );
    }
  };

  const dispatchDocument = async (documentId, action) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${host}/api/document/dispatch/${documentId}`,
        { action },
        {
          headers: {
            accessToken: `${accessToken}`,
          },
        }
      );

      // Return the document log details
      return response.data;
    } catch (error) {
      console.error(
        "Error dispatch documents by user:",
        error.response?.data || error.message
      );
    }
  };

  const getNextUpcomingOutwardDocumentSerialNumber = async (officeId) => {
    try {
      const response = await axios.post(
        `${host}/api/document/get_next_outward_document_serial_number/${officeId}`
      );
      // console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Error getting next outward document serial number for given officeId : ",
        error.response?.data || error.message
      );
    }
  };

  const signDocumentPDF = async (documentUrl) => {
    try {
      const response = await axios.get(`${host}/api/digitalSign/sign-pdf`, {
        params: { documentUrl }
      });
      console.log(response);
      if (response.data.success) {
        return response.data;
      }
      return response.data;
    } catch (error) {
      console.error('Error signing PDF:', error);
    }
  }  
  
  
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
        getAllDocumentLogs,
        addDocumentLog,
        getDocumentLogsByDocumentId,
        approveDocument,
        addFeedback,
        returnDocument,
        getDocumentLogsByOfficeId,
        getAllDocumentsReceivedDispatched,
        getPendingDocumentsForUserByUserId,
        getApprovedDocumentsForUserByUserId,
        getAllDocumentsReceivedDispatchedByOfficeId,
        getDocumentsByStatusName,
        getFeedBacksByDocumentId,
        getReturnedDocumentsForUserByUserId,
        dispatchDocument,
        updateDocument,
        getAttachedDocument,
        updateAttachedDocument,
        resendDocumentForApproval,
        getNextUpcomingOutwardDocumentSerialNumber,
        signDocumentPDF,
      }}
    >
      {props.children}
    </DocumentContext.Provider>
  );
};

export default DocumentState;
