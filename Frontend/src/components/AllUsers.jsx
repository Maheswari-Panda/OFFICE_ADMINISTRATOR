import React, { useContext, useEffect, useState, useMemo, useRef } from "react";
import DataTable from "react-data-table-component";
import userContext from "../context/user/userContext";
import OfficeContext from "../context/office/officeContext";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";

function AllUsers() {
  const navigate = useNavigate();
  const { users, getAllUsers, deleteUser } = useContext(userContext);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  const deleteRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await Promise.all([getAllUsers()]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setTimeout(()=>{
          setLoading(false);
        },100)
      }
    };

    fetchData();
  }, []);

  const handleView = (row) => {
    console.log("View clicked:", row);
    navigate("/dashboard/viewUser", { state: { user: row } });
  };

  const handleDeleteModal = (row) => {
    setSelectedUser(row);
    console.log("Clicked on Delete Modal", row);
    deleteRef.current.click();
  };

  const handelDeleteUser = async (userId) => {
    console.log(selectedUser);
    const response = await deleteUser(userId);
    console.log(response);
    if (response) {
      alert("User Deleted Successfuully!");
    } else {
      alert("Error Deleting User");
    }
  };
  const columns = useMemo(
    () => [
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
      {
        name: "CreatedAt",
        selector: (row) =>
          new Date(row?.CreatedAt).toLocaleDateString() || "N/A",
        sortable: true,
      },
      {
        name: "First Name",
        selector: (row) => row?.FirstName || "N/A",
        sortable: true,
      },
      {
        name: "Middle Name",
        selector: (row) => row?.MiddleName || "N/A",
        sortable: true,
      },
      {
        name: "Last Name",
        selector: (row) => row?.LastName || "N/A",
        sortable: true,
      },
      { name: "Email", selector: (row) => row?.Email || "N/A", sortable: true },
      { name: "Role", selector: (row) => row?.Role || "N/A", sortable: true },
      {
        name: "Office",
        selector: (row) => row?.OfficeName || "N/A",
        sortable: true,
      },
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
              onClick={() => handleDeleteModal(row)}
            >
              <i className="fas fa-trash"></i>
            </button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <>
      {loading && <Spinner />}
      {!loading && (
        <div className="w-full flex justify-center bg-blue-100 min-h-screen p-2">
          <div className="w-full bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">All Users</h2>

            {users.length === 0 ? (
              <div className="text-center text-gray-500 font-bold text-xl">
                No Users Found
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={users}
                fixedHeader
                highlightOnHover
              />
            )}
          </div>
          {/* Open the modal using document.getElementById('ID').showModal() method */}
          <button
            className="btn hidden"
            onClick={() => document.getElementById("my_modal_6").showModal()}
            ref={deleteRef}
          >
            open modal
          </button>
          <dialog
            id="my_modal_6"
            className="modal modal-bottom sm:modal-middle"
          >
            <div className="modal-box">
              <h3 className="font-bold text-lg text-red-500">Delete User</h3>
              <p className="py-4">
                Are sure you want to delete this user once it gets deleted the
                related data to this user will get deleted and you cannot
                retrive it!
              </p>
              <div className="modal-action">
                <form method="dialog">
                  {/* if there is a button in form, it will close the modal */}
                  <button
                    className="btn btn-sm bg-red-500 text-white mx-2 hover:bg-red-600"
                    onClick={() => handelDeleteUser(selectedUser.UserId)}
                  >
                    Delete
                  </button>
                  <button className="btn btn-sm bg-blue-500 text-white hover:bg-blue-600">
                    Cencel
                  </button>
                </form>
              </div>
            </div>
          </dialog>
        </div>
      )}
    </>
  );
}

export default AllUsers;
