import React, { useState } from "react";
import DataTable from "react-data-table-component";
import SearchBox from "./SearchBox";

const AdminActivity = ({adminLogs}) => {

  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState(adminLogs);

  // Handle Search
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchText(value);

    const filtered = adminLogs.filter((log) =>
      log.OfficeName.toLowerCase().includes(value) ||
      log.AdminName.toLowerCase().includes(value) ||
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
      name: "AdminName",
      selector: (row) => row.AdminName,
      sortable: true,
    },
    {
        name: "OfficeName",
        selector: (row) => row.OfficeName,
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
      <div className="flex justify-between items-center p-2">
        <h2 className="text-lg font-semibold">Admin Activity</h2>
        {/* Reusable Search Box */}
        <SearchBox searchText={searchText} handleSearch={handleSearch} placeholder="Search Admin Activity..." />
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

export default AdminActivity