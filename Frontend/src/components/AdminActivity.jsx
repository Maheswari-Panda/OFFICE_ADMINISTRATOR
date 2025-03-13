import React from "react";
import DataTable from "react-data-table-component";

const AdminActivity = ({adminLogs}) => {

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
    <div className="w-full overflow-scroll h-full">
        <h2 className="mx-3">Admin Activity</h2>
      <DataTable
        columns={columns}
        data={adminLogs}
      />
    </div>
  );
};

export default AdminActivity