import React, { useState } from "react";
import DataTable from "react-data-table-component";
import SearchBox from "./SearchBox"; // Import SearchBox

const UserActivity = ({ userLogs }) => {
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState(userLogs);

  // Handle Search
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchText(value);

    const filtered = userLogs.filter((log) =>
      log.UserName.toLowerCase().includes(value) ||
      log.ActionPerformed.toLowerCase().includes(value) ||
      new Date(log.DateTime).toLocaleDateString().includes(value)
    );

    setFilteredData(filtered);
  };

  // Define table columns
  const columns = [
    { name: "Srno.", selector: (row, index) => row?.LogTableId, sortable: true, width: "80px" },
    { name: "Username", selector: (row) => row.UserName, sortable: true },
    {
      name: "Date & Time",
      selector: (row) =>
        new Date(row.DateTime).toLocaleDateString() +
        " " +
        new Date(row.DateTime).toLocaleTimeString(),
      sortable: true,
    },
    { name: "Action Performed", selector: (row) => row.ActionPerformed, sortable: true },
  ];

  return (
    <div className="w-full h-full p-4">
     <div className="flex justify-between items-center p-2">
        <h2 className="text-lg font-semibold">User Activity</h2>
        {/* Reusable Search Box */}
        <SearchBox searchText={searchText} handleSearch={handleSearch} placeholder="Search User Activity..." />
     </div>

      {/* Data Table */}
      <DataTable columns={columns} data={filteredData} pagination highlightOnHover/>
    </div>
  );
};

export default UserActivity;
