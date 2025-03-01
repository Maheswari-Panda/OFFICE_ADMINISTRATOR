import React, { useContext, useEffect, useState } from 'react';
import DataTable from 'react-data-table-component'; // Import the DataTable component
import DocumentContext from '../context/document/documentContext';
import { useNavigate } from 'react-router-dom';
import userContext from '../context/user/userContext';

function PendingDocuments() {
  const {user} = useContext(userContext);
  const { documents,getPendingDocumentsForUserByUserId } = useContext(DocumentContext); // Get documents from the context
  const [pendingDocuments, setPendingDocuments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getPendingDocumentsForUserByUserId(user.UserId);
  }, []);
  useEffect(() => {
      setPendingDocuments(documents); // Reset filtered documents on initial render
    }, [documents]);

  const handleViewDocument = (row) => {
    console.log("Handle Review Document : ",row);
    // navigate("/dashboard/reviewDocument", { state: { document: row } });
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
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-blue-100 p-4 w-full">
      <h2 className="text-blue-500 text-2xl font-bold mb-4">Pending Documents</h2>

      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <DataTable
          columns={columns} // Columns for the table
          data={pendingDocuments} // Data for the table
        />
      </div>
    </div>
  );
}

export default PendingDocuments