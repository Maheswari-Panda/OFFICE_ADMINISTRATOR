import React, { useContext, useEffect, useState } from 'react';
import DataTable from 'react-data-table-component'; // Import the DataTable component
import DocumentContext from '../context/document/documentContext';
import { useNavigate } from 'react-router-dom';

function PendingDocuments() {
  const { documents,getAllDocuments } = useContext(DocumentContext); // Get documents from the context
  const [pendingDocuments, setPendingDocuments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAllDocuments();
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
      selector: row => <div className="badge bg-red-100 text-red-500">pending</div>,
      sortable: true,
    },
    {
      name: 'Actions',
      cell: row => (
        <div>
          <button
            className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600 focus:outline-none"
            onClick={() => handleViewDocument(row)}
          >
            <i className="fas fa-eye text-xs mr-1 text-white"></i>
            View
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