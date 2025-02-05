import React, { useContext, useEffect, useState } from "react";
import userContext from "../context/user/userContext";
import DataTable from "react-data-table-component";

function AllUsers() {
  const context = useContext(userContext);
  const { users, getAllUsers } = context;
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    if (Array.isArray(users) && users.length > 0) {
      setUserData(users);
    } else {
      console.warn("No valid user data received:", users);
      setUserData([]); // Ensure no invalid data is passed
    }
  }, [users]);

  // Define columns for the DataTable
  const columns = [
    { name: "ERN", selector: (row) => row?.ERN || "N/A", sortable: true },
    { name: "First Name", selector: (row) => row?.FirstName || "N/A", sortable: true },
    { name: "Middle Name", selector: (row) => row?.MiddleName || "N/A", sortable: true },
    { name: "Last Name", selector: (row) => row?.LastName || "N/A", sortable: true },
    { name: "Email", selector: (row) => row?.Email || "N/A", sortable: true },
    { name: "Role", selector: (row) => row?.Role || "N/A", sortable: true },
    { name: "Office", selector: (row) => row?.Office || "N/A", sortable: true },
    {
      name: "Profile Image",
      cell: (row) => (
        <div>
          {/* If ProfileImageUrl exists, show it. Otherwise, show a default Font Awesome icon */}
          {row?.ProfileImageUrl ? (
            <img
              src={row?.ProfileImageUrl}
              alt="Profile"
              className="h-5 w-5 rounded-full"
            />
          ) : (
            <i className="fas fa-user-circle text-xl"></i> // Default Font Awesome user icon
          )}
        </div>
      ),
      ignoreRowClick: true,
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2>All Users</h2>
      <DataTable
        title="User List"
        columns={columns}
        data={userData}
        pagination
        highlightOnHover
        striped
      />
    </div>
  );
}

export default AllUsers;
