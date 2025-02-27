import React, { useContext, useEffect, useRef, useState } from 'react';
import DataTable from 'react-data-table-component'; // Import the DataTable component
import DocumentContext from '../context/document/documentContext';
import { useNavigate } from 'react-router-dom';
import userContext from '../context/user/userContext';
import ModalAlert from './ModalAlert';


function ReviewDocuments() {
  const { documents,getAllDocuments,addDocumentLog,approveDocument } = useContext(DocumentContext); // Get documents from the context
  const {user} = useContext(userContext);
  const [activeDocuments, setActiveDocuments] = useState([]);
  const navigate = useNavigate();
  const modalRef = useRef();
  const [alertHeading,setAlertHeading]=useState("");
  const [alertDescription,setAlertDescription] = useState("");
  const [alertBtnText1,setAlertBtnText1] = useState("");
  const [alertBtnText2,setAlertBtnText2] = useState("");

  useEffect(() => {
    getAllDocuments();
  }, []);
  useEffect(() => {
    // Filter documents where status is "Pending Review"
    const filteredDocuments = documents.filter((doc) => doc.StatusName === "Pending Review");
    setActiveDocuments(filteredDocuments); // Set only pending review documents
  }, [documents]);


  // useEffect(() => {
  //     setActiveDocuments(documents); // Reset filtered documents on initial render
  //   }, [documents]);

  const handleViewDocument = (row) => {
    addDocumentLog(user.UserId, row.DocumentId,"Pending Document Viewed")
    navigate("/dashboard/reviewDocument", { state: { document: row } });
  };

  const handleApproveDocument = async (document) => {
    // Call the API to approve the document
    setAlertHeading("Approve Document");
    setAlertDescription("Please Review the document carefully before approving it this action cannot be undone!");
    setAlertBtnText1("Cencel");
    setAlertBtnText2("Approve");
    modalRef.current.click();
    // const response = await approveDocument(document.DocumentId,"Document Approved");
    // // After approval, update the document status in the context or re-fetch the documents
    // if(response){
    //   alert("Document Approved");
    // }
  };

  // Columns definition for the DataTable
  const columns = [
    {
      name: 'Document Name',
      selector: row => row.DocumentName,
      sortable: true,
    },
    {
      name: 'Submission Date',
      selector: row => new Date(row.DispatchedDateTime).toLocaleDateString(),
      sortable: true,
    },
    {
      name: 'Document Type',
      selector: row => row.DocumentTypeName,
      sortable: true,
    },
    {
      name: 'Sender',
      selector: row => row.SenderName,
      sortable: true,
    },
    {
      name: 'Final Reciever',
      selector: row => row.EndUserName,
      sortable: true,
    },
    {
      name: 'Actions',
      cell: row => (
        <div>
          <button
            className="h-8 w-8 text-white p-1 rounded-full focus:outline-none hover:bg-gray-200"
            onClick={() => handleViewDocument(row)}
            title='View Document'
          >
            <i className="fas fa-eye text-xs text-blue-500 hover:text-blue-600"></i>
          </button>
          <button
            className="h-8 w-8 text-white p-1 rounded-full  focus:outline-none hover:bg-gray-200"
            onClick={() => handleApproveDocument(row)}
            title='Aprove Document'
          >
            <i className="fa-solid fa-check text-green-500 hover:text-green-600"></i>
          </button>
          <button
            className="h-8 w-8 text-white p-1 rounded-full  focus:outline-none hover:bg-gray-200"
            onClick={() => handleApproveDocument(row)}
            title='return document'
          >
            <i className="fa-solid fa-arrow-rotate-left text-red-500 hover:text-red-600"></i>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-blue-100 p-4 w-full">
      <h2 className="text-blue-500 text-2xl font-bold mb-4">Review Documents</h2>

      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <DataTable
          columns={columns} // Columns for the table
          data={activeDocuments} // Data for the table
        />
      </div>
      <ModalAlert modalRef={modalRef} heading={alertHeading} description={alertDescription} btnText1={alertBtnText1} btnText2={alertBtnText2}/>
    </div>
  );
}

export default ReviewDocuments;
