import React from "react";
import DataTable from "react-data-table-component";

const UserActivity = ({userLogs}) => {

  // Define the columns for the DataTable
  const columns = [
    {
      name: "Srno.",
      selector: (row, index ) => index + 1,
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
        <h2 className="mx-3">User Activity</h2>
      <DataTable
        columns={columns}
        data={userLogs}
      />
    </div>
  );
};

export default UserActivity