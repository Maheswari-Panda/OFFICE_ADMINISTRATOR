import React, { useContext, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import DocumentContext from "../context/document/documentContext";
import { useLocation } from "react-router-dom";

function DocumentLog() {
    const location= useLocation();
    const documentLogs = location.state?.documentLog;
    
  
  const columns = [
    {
      name: "Srno.",
      selector: (row, index ) => index + 1,
      sortable: true,
    },
    {
      name: "Username",
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
    <div className="bg-blue-100 w-full h-screen">
        <button className="btn btn-sm text-white p-2 bg-blue-500 hover:blue-600 m-3" onClick={()=>window.history.back()}>
            <i className="fas fa-arrow-left text-white-500 text-xs "></i> Documents
        </button>
      <div className="w-full overflow-scroll h-full px-3 shadow-md rounded-md">
        <h1 className="text-xl py-2 font-bold text-blue-500">{documentLogs[0].DocumentName}</h1>
      <DataTable
        columns={columns}
        data={documentLogs}
        pagination
      />
    </div>
    </div>
    
  )
}

export default DocumentLog