import React, { useState } from "react";
import DataTable from "react-data-table-component";

const UserActivity = () => {
  const userLogs=[
    {
      LogTableId: 1,
      UserId: 101,
      DateTime: "2025-02-13 10:00:00",
      ActionPerformed: "User created a new profile"
    },
    {
      LogTableId: 2,
      UserId: 102,
      DateTime: "2025-02-13 10:15:00",
      ActionPerformed: "User updated email address"
    },
    {
      LogTableId: 3,
      UserId: 103,
      DateTime: "2025-02-13 10:30:00",
      ActionPerformed: "User logged in"
    },
    {
      LogTableId: 4,
      UserId: 101,
      DateTime: "2025-02-13 11:00:00",
      ActionPerformed: "User changed profile picture"
    },
    {
      LogTableId: 5,
      UserId: 104,
      DateTime: "2025-02-13 11:10:00",
      ActionPerformed: "User deleted an old record"
    },
    {
      LogTableId: 6,
      UserId: 105,
      DateTime: "2025-02-13 11:20:00",
      ActionPerformed: "User logged out"
    }
  ];

  // Define the columns for the DataTable
  const columns = [
    {
      name: "Log Table ID",
      selector: (row) => row.LogTableId,
      sortable: true,
    },
    {
      name: "User ID",
      selector: (row) => row.UserId,
      sortable: true,
    },
    {
      name: "Date & Time",
      selector: (row) => row.DateTime,
      sortable: true,
    },
    {
      name: "Action Performed",
      selector: (row) => row.ActionPerformed,
      sortable: true,
    },
  ];

  return (
    <div className="w-full">
        <h2>User Activity</h2>
      <DataTable
        columns={columns}
        data={userLogs}
      />
    </div>
  );
};

export default UserActivity