import React, { useContext, useState } from "react";
import DataTable from "react-data-table-component";
import SearchBox from "./SearchBox";
import userContext from "../context/user/userContext";
import DocumentContext from "../context/document/documentContext";
import { useNavigate } from "react-router-dom";

const DocumentActivity = ({documentLogs}) => {
    // console.log(documentLogs);
    const navigate = useNavigate();
    const {user} = useContext(userContext);
    const {addDocumentLog} = useContext(DocumentContext);
    const [searchText, setSearchText] = useState("");
    const [filteredData, setFilteredData] = useState(documentLogs);

    const handleViewDocument = async (row) => {
      await addDocumentLog(user.UserId, row.DocumentId, `Document Viewed`);
      navigate("/dashboard/reviewDocument", { state: { document: row } });
    };
  
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
      selector: (row,index ) => index + 1 || row,
      sortable: true,
      width: "80px"
    },
    {
      name: "I/O",
      selector: (row) => row.IsInward===false?"Inward":"Outward",
      sortable: true,
      width:"100px",
    },
    {
      name: "Documnet No.",
      selector: (row ) => row?.DocumentSerialNumber || "N/A",
      sortable: true,
    },
    {
      name: "Document Name",
      selector: (row) => row.DocumentName,
      sortable: true,
      cell: (row) => (
        <span onClick={() => handleViewDocument(row)} className="hover:underline cursor-pointer">
          {row.DocumentName}
        </span>
      )
    },
    {
      name: "User Name",
      selector: (row) => (row.UserName),
      sortable: true,
    },
    {
      name: "Date & Time",
      selector: (row) => new Date(row.DateTime).toLocaleDateString() +" "+ row.DateTime.slice(11, 19),
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