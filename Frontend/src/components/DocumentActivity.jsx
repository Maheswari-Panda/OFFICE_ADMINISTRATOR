import React, { useState } from "react";
import DataTable from "react-data-table-component";
import SearchBox from "./SearchBox";

const DocumentActivity = ({documentLogs}) => {

    const [searchText, setSearchText] = useState("");
    const [filteredData, setFilteredData] = useState(documentLogs);
  
    // Handle Search
    const handleSearch = (event) => {
      const value = event.target.value.toLowerCase();
      setSearchText(value);
  
      const filtered = documentLogs.filter((log) =>
        log.DocumentName.toLowerCase().includes(value) ||
        log.UserName.toLowerCase().includes(value) ||
        log.ActionPerformed.toLowerCase().includes(value) ||
        new Date(log.DateTime).toLocaleDateString().includes(value)
      );
  
      setFilteredData(filtered);
    };
  
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
    <div className="w-full overflow-scroll h-auto">
        {/* <h2 className="mx-3">Document Logs</h2> */}
      <div className="flex justify-between items-center p-4">
        <h1>All Document Logs</h1>
        <SearchBox searchText={searchText} handleSearch={handleSearch} placeholder="Search Document Logs..." />
     </div>
      <DataTable
        columns={columns}
        data={filteredData}
        pagination
        highlightOnHover
      />
    </div>
  );
};

export default DocumentActivity