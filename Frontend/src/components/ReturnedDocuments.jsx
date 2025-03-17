import React, { useContext, useEffect, useRef, useState } from 'react';
import DataTable from 'react-data-table-component'; // Import the DataTable component
import DocumentContext from '../context/document/documentContext';
import { useNavigate } from 'react-router-dom';
import userContext from '../context/user/userContext';
import ModalAlert from './ModalAlert';
import Feedback from './feedback';
import SearchBox from './SearchBox';

function ReturnedDocuments() {
  const {user} = useContext(userContext);
  const { documents,getReturnedDocumentsForUserByUserId,addDocumentLog} = useContext(DocumentContext); // Get documents from the context
  const [returnedDocuments, setReturnedDocuments] = useState([]);
  const navigate = useNavigate();

      const modalRef = useRef();
      
      const [alertHeading, setAlertHeading] = useState("");
      const [alertDescription, setAlertDescription] = useState(null);
      const [extraComponent, setExtraComponent] = useState(null);
      const [alertBtnText1, setAlertBtnText1] = useState("");
      const [alertBtnText2, setAlertBtnText2] = useState("");

  useEffect(() => {
    getReturnedDocumentsForUserByUserId(user.UserId);
  }, []);
  useEffect(() => {
    setReturnedDocuments(documents); // Reset filtered documents on initial render'
    setFilteredData(documents);
    }, [documents]);

    const [searchText, setSearchText] = useState("");
    const [filteredData, setFilteredData] = useState(returnedDocuments);
    
    const [isfeedbackform,setIsfeedbackform] = useState(true);
  
    // Handle Search
    const handleSearch = (event) => {
      const value = event.target.value.toLowerCase();
      setSearchText(value);
  
      const filtered = returnedDocuments.filter((document) =>
        document.DocumentName.toLowerCase().includes(value) ||
        user.FirstName.toLowerCase().includes(value) ||
        user.LastName.toLowerCase().includes(value) ||
        document.DocumentTypeName.toLowerCase().includes(value) ||
        document.SenderName.toLowerCase().includes(value) ||
        document.EndUserName.toLowerCase().includes(value) ||
        document.StatusName.toLowerCase().includes(value) ||
        new Date(document.DispatchedDateTime).toLocaleDateString().includes(value)
      );
  
      setFilteredData(filtered);
    };

  const handleViewDocument = async (row) => {
    console.log("Handle Review Document : ",row);
    await addDocumentLog(user.UserId, row.DocumentId, "Returned Document Viewed");
    navigate("/dashboard/reviewDocument", { state: { document: row } });
  };

  const handleViewFeedbacks= async(document)=>{
    setIsfeedbackform(false);
    setAlertHeading("Document Feedback");
    setAlertDescription(
      <>
        <span className="font-bold">{document.DocumentName} </span>
      </>
    );
    
    setExtraComponent(<Feedback documentId={document.DocumentId}/>);
    setAlertBtnText2("Cancel");
    modalRef.current.click();
    console.log("Clicked on view feedback");
  }

  const handleSendDocumentForApproval = async (row)=>{
    setIsfeedbackform(false);
    setAlertHeading("Document Approval");
    setAlertDescription(
      <>
        Read this <span className="font-bold">{document.DocumentName} </span> document carefully before sending it for approval. This action
        cannot be undone!
      </>
    );
    setExtraComponent(null);
    // setAlertBtnText1("Cancel");
    setAlertBtnText2("Ok");
    modalRef.current.click();
    console.log("Sending document for approval...",row);
  }

  const updateDocumentStatusToPending =()=>{
    console.log("Updating document Status");
  }


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
      name: 'CreatedBy',
      selector: row=> row?.FirstName || user.FirstName +" "+ user.LastName,
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
      name: 'Status',
      selector: row => <div className="badge bg-red-100 text-red-500">{row.StatusName}</div>,
      sortable: true,
    },
    {
      name: 'Actions',
      cell: row => (
        <div>
          <button
            title='view document'
            className="h-8 w-8 text-white p-1 rounded-full hover:bg-gray-200"
            onClick={() => handleViewDocument(row)}
          >
            <i className="fas fa-eye text-xs text-blue-500 hover:text-blue-600"></i>
          </button>
          <button
            title='view feedbacks'
            className="h-8 w-8 text-white p-1 rounded-full hover:bg-gray-200"
            onClick={() => handleViewFeedbacks(row)}
          >
            <i className="fas fa-comments text-xs text-gray-500 hover:text-gray-600"></i>
          </button>
          <button
            title='resend for approval'
            className="h-8 w-8 text-white p-1 rounded-full hover:bg-gray-200"
            onClick={() => handleSendDocumentForApproval(row)}
          >
            <i className="fa-solid fa-paper-plane text-xs text-green-500 hover:text-green-600"></i>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-blue-100 p-4 w-full">
      <div className="flex justify-between items-center p-2">
      <h2 className="text-blue-500 text-2xl font-bold mb-4">Returned Documents</h2>
        {/* Reusable Search Box */}
        <SearchBox searchText={searchText} handleSearch={handleSearch} placeholder="Search Admin Activity..." />
     </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <DataTable
          columns={columns} // Columns for the table
          data={filteredData} // Data for the table
          highlightOnHover
          pagination
        />
      </div>
      <ModalAlert
        modalRef={modalRef}
        heading={alertHeading}
        description={alertDescription}
        feedbackform={isfeedbackform}
        btnText2={alertBtnText2}
        extraComponent={extraComponent}
      />
    </div>
  )
}

export default ReturnedDocuments