import React, { useContext, useEffect, useRef, useState } from 'react';
import DataTable from 'react-data-table-component'; // Import the DataTable component
import DocumentContext from '../context/document/documentContext';
import { useNavigate } from 'react-router-dom';
import userContext from '../context/user/userContext';
import ModalAlert from './ModalAlert';
import Feedback from './feedback';

function ApprovedDocuments() {
  const {user} = useContext(userContext);
  const { documents,getApprovedDocumentsForUserByUserId } = useContext(DocumentContext); // Get documents from the context
  const [approvedDocuments, setApprovedDocuments] = useState([]);
  const navigate = useNavigate();

  
    const modalRef = useRef();
    
    const [alertHeading, setAlertHeading] = useState("");
    const [alertDescription, setAlertDescription] = useState(null);
    const [extraComponent, setExtraComponent] = useState(null);
    const [alertBtnText1, setAlertBtnText1] = useState("");
    const [alertBtnText2, setAlertBtnText2] = useState("");

  useEffect(() => {
    getApprovedDocumentsForUserByUserId(user.UserId);
  }, []);
  useEffect(() => {
      setApprovedDocuments(documents); // Reset filtered documents on initial render
    }, [documents]);

  const handleViewDocument = (row) => {
    // Navigate to the DocumentDetails component with the selected document
    // history.push(`/document-details/${documentId}`);
    console.log("Handle Review Document : ",row);
    navigate("/dashboard/reviewDocument", { state: { document: row } });
  };

  const handleDocumentPrint = async (documentPath) => {
    if (!documentPath) {
      console.error("Document path is missing!");
      return;
    }
  
    try {
      console.log("Opening document for printing: ", documentPath);
      
      // Open the document in a new tab
      const newWindow = window.open(documentPath, "_blank");
  
      // If the new window opens successfully, attempt to print
      if (newWindow) {
        newWindow.onload = () => {
          newWindow.print();
        };
      } else {
        console.error("Popup blocked! Allow pop-ups for this site.");
      }
    } catch (error) {
      console.error("Error while opening document:", error);
    }
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
      selector: row => <div>{row?.CreatedUserId || user.FirstName +" " + user.LastName}</div>,
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
      selector: row => <div className="badge bg-green-100 text-green-500">{row.StatusName}</div>,
      sortable: true,
    },
    {
      name: 'Actions',
      cell: row => (
        <div className='flex gap-2'>
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
            title='download document'
            className="h-8 w-8 p-1 rounded-full hover:bg-gray-200"
            onClick={() => handleDocumentPrint(row.DocumentPath)}
          >
            <i className="fa-solid fa-print text-xs text-black-500 hover:text-black-600"></i>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-blue-100 p-4 w-full">
      <h2 className="text-blue-500 text-2xl font-bold mb-4">Approved Documents</h2>

      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <DataTable
          columns={columns} // Columns for the table
          data={approvedDocuments} // Data for the table
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
  );
}

export default ApprovedDocuments