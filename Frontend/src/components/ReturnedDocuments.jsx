import React, { useContext, useEffect, useRef, useState } from 'react';
import DataTable from 'react-data-table-component'; // Import the DataTable component
import DocumentContext from '../context/document/documentContext';
import { useNavigate } from 'react-router-dom';
import userContext from '../context/user/userContext';
import ModalAlert from './ModalAlert';
import Feedback from './feedback';

function ReturnedDocuments() {
  const {user} = useContext(userContext);
  const { documents,getReturnedDocumentsForUserByUserId } = useContext(DocumentContext); // Get documents from the context
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
    setReturnedDocuments(documents); // Reset filtered documents on initial render
    }, [documents]);

  const handleViewDocument = (row) => {
    console.log("Handle Review Document : ",row);
    // navigate("/dashboard/reviewDocument", { state: { document: row } });
  };

  const handleViewFeedbacks= async(document)=>{
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
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-blue-100 p-4 w-full">
      <h2 className="text-blue-500 text-2xl font-bold mb-4">Returned Documents</h2>

      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <DataTable
          columns={columns} // Columns for the table
          data={returnedDocuments} // Data for the table
        />
      </div>
      <ModalAlert
        modalRef={modalRef}
        heading={alertHeading}
        description={alertDescription}
        btnText2={alertBtnText2}
        extraComponent={extraComponent}
      />
    </div>
  )
}

export default ReturnedDocuments