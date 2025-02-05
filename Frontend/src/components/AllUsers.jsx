import React, { useContext, useEffect, useState } from "react";
import userContext from "../context/user/userContext";
import DataTable from "react-data-table-component";
import { data } from "react-router-dom";

function AllUsers() {
  const context = useContext(userContext);
  const { users, getAllUsers } = context;
  const [loading, setLoading] = useState(true); // New loading state

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await getAllUsers();
      setLoading(false);
    };

    fetchData();
  }, []);

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
          {row?.ProfileImageUrl ? (
            <img
              src={row?.ProfileImageUrl}
              alt="Profile"
              className="h-10 w-10 rounded-full border-2 border-blue-500"
            />
          ) : (
            <i className="fas fa-user-circle text-2xl text-blue-500"></i>
          )}
        </div>
      ),
    },

  ];

  return (
    <div className="w-full flex justify-center bg-blue-100 min-h-screen">
      <div className="w-full bg-white p-6 m-2 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">All Users</h2>
        
        {/* Show Loading Spinner */}
        {loading ? (
          <div className="text-center text-blue-600 font-bold text-xl">Loading...</div>
        ) : (
          <DataTable
            columns={columns}
            data={users}
            pagination
            fixedHeader
            className="border border-gray-300 rounded-lg"
          />
        )}
      </div>
    </div>
  );
}

export default AllUsers;
