import React, { useContext, useEffect, useState, useMemo } from "react";
import DataTable from "react-data-table-component";
import userContext from "../context/user/userContext";
import OfficeContext from "../context/office/officeContext";
import { useNavigate } from "react-router-dom";

function AllUsers() {
  const navigate= useNavigate();
  const { users, getAllUsers } = useContext(userContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await Promise.all([getAllUsers()]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleView = (row) =>{
    console.log("View clicked:", row);
    navigate("/dashboard/viewUser", { state: { user: row } });
  }

  const columns = useMemo(() => [
    {
      name: "Profile Image",
      selector: (row) => (
        <div>
          {row?.ProfileImageUrl ? (
            <img
              src={row?.ProfileImageUrl}
              alt="Profile"
              className="h-8 w-8 rounded-full border-2 border-blue-500"
            />
          ) : (
            <i className="fas fa-user-circle text-3xl text-blue-500"></i>
          )}
        </div>
      ),
    },
    { name: "ERN", selector: (row) => row?.ERN || "N/A", sortable: true },
    { name: "CreatedAt", selector: (row) => new Date(row?.CreatedAt).toLocaleDateString() || "N/A", sortable: true },
    { name: "First Name", selector: (row) => row?.FirstName || "N/A", sortable: true },
    { name: "Middle Name", selector: (row) => row?.MiddleName || "N/A", sortable: true },
    { name: "Last Name", selector: (row) => row?.LastName || "N/A", sortable: true },
    { name: "Email", selector: (row) => row?.Email || "N/A", sortable: true },
    { name: "Role", selector: (row) => row?.Role || "N/A", sortable: true },
    { name: "Office", selector: (row) => row?.OfficeName || "N/A", sortable: true },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex space-x-2">
          <button
            className="p-1 text-blue-500 hover:text-blue-700"
            onClick={() => handleView(row)}
          >
            <i className="fas fa-edit"></i>
          </button>
          <button
            className="p-1 text-red-500 hover:text-red-700"
            onClick={() => handleDelete(row)}
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      ),
    }
  ], []);

  return (
    <div className="w-full flex justify-center bg-blue-100 min-h-screen">
      <div className="w-full bg-white p-6 m-2 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">All Users</h2>

        {loading ? (
          <div className="text-center text-blue-600 font-bold text-xl">Loading...</div>
        ) : users.length === 0 ? (
          <div className="text-center text-gray-500 font-bold text-xl">No Users Found</div>
        ) : (
          <DataTable columns={columns} data={users} fixedHeader highlightOnHover />
        )}
      </div>
    </div>
  );
}

export default AllUsers;
