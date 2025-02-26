import React from "react";
import DataTable from "react-data-table-component";

const DocumentActivity = ({documentLogs}) => {

  // Define the columns for the DataTable
  const columns = [
    {
      name: "Srno.",
      selector: (row, index ) => index + 1,
      sortable: true,
    },
    {
      name: "Document Name",
      selector: (row) => (row.DocumentName),
      sortable: true,
    },
    {
      name: "User Name",
      selector: (row) => (row.UserName),
      sortable: true,
    },
    {
      name: "Date & Time",
      selector: (row) => new Date(row.DateTime).toLocaleDateString() +" "+ new Date(row.DateTime).toLocaleTimeString(),
      sortable: true,
    },
    {
      name: "Action Performed",
      selector: (row) => row.ActionPerformed,
      sortable: true,
    },
  ];

  return (
    <div className="w-full overflow-scroll h-full">
        {/* <h2 className="mx-3">Document Logs</h2> */}
      <DataTable
        columns={columns}
        data={documentLogs}
      />
    </div>
  );
};

export default DocumentActivity