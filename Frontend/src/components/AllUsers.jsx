import React, { useContext, useEffect, useState, useMemo, useRef } from "react";
import DataTable from "react-data-table-component";
import userContext from "../context/user/userContext";
import OfficeContext from "../context/office/officeContext";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
import ModalAlert from "./ModalAlert";
import SearchBox from "./SearchBox";

function AllUsers() {
  const navigate = useNavigate();
  const {user,users, getAllUsers, deleteUser,getUsersByOfficeId } = useContext(userContext);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  const deleteRef = useRef();
  
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);

    const [alertHeading, setAlertHeading] = useState("Delete User");
    const [alertDescription, setAlertDescription] = useState("Are sure you want to delete this user once it gets deleted the related data to this user will get deleted and you cannot retrive it!");
    const [alertBtnText1, setAlertBtnText1] = useState("Cencel");
    const [alertBtnText2, setAlertBtnText2] = useState("Delete");
  
  // Fetch users on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (user.Role === "Admin" || user.Role === "admin") {
          await getUsersByOfficeId(user.OfficeId);
        } else {
          await getAllUsers();
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 100);
      }
    };
  
    fetchData();
  }, []);
  
  // 👇 Listen to users update and sync with filteredData
  useEffect(() => {
    setFilteredData(users);
  }, [users]);
  
  
  // Handle Search
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchText(value);

    const filtered = users.filter((user) =>
      user.ERN.includes(value) ||
      user.FirstName.toLowerCase().includes(value) ||
      user.MiddleName.toLowerCase().includes(value) ||
      user.LastName.toLowerCase().includes(value) ||
      user.Email.toLowerCase().includes(value) ||
      user.Role.toLowerCase().includes(value) ||
      user.OfficeName.toLowerCase().includes(value) ||
      new Date(user.CreatedAt).toLocaleDateString().includes(value)
    );

    setFilteredData(filtered);
  };


  const handleView = (row) => {
    console.log("View clicked:", row);
    navigate("/dashboard/viewUser", { state: { user: row } });
  };

  const handleDeleteModal = async (row) => {
    setSelectedUser(row);
    console.log("Clicked on Delete Modal", row);
    deleteRef.current.click();
  };

  const handelDeleteUser = async (userId) => {
    console.log(userId);
    // console.log("INSIDE HANDLE DELETE USER",userId);
    const response = await deleteUser(userId);
    console.log(response);
    if (response) {
      setAlertHeading("User Deleted Successfully!");
      setAlertDescription("User deleted successfuuly you can view updated user list!");
      setAlertBtnText2(null);
      setAlertBtnText1("Ok");
      // alert("User Deleted Successfuully!");
    } else {
      setAlertHeading("Error Deleting User!");
      setAlertDescription("Some error occured please try again latter");
      setAlertBtnText2(null);
      setAlertBtnText1("Ok");
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
          <div className="flex justify-between items-center p-2">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">All Users</h2>

        {/* Reusable Search Box */}
        <SearchBox searchText={searchText} handleSearch={handleSearch} placeholder="Search Users..." />
     </div>
            {users.length === 0 ? (
              <div className="text-center text-gray-500 font-bold text-xl">
                No Users Found
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={filteredData}
                fixedHeader
                highlightOnHover
                pagination
              />
            )}
          </div>
          {/* Open the modal using document.getElementById('ID').showModal() method */}
          {/* <ModalAlert modalRef={deleteRef} heading={alertHeading} description={alertDescription} btnText1={alertBtnText1}  btnText2={alertBtnText2} onClickBtn={() =>handelDeleteUser(selectedUser.UserId)}/> */}
      <div>
      <button
        className="btn"
        onClick={() => document.getElementById("my_modal_1").showModal()}
        ref={deleteRef}
        hidden
      >
        open modal
      </button>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-blue-500">{alertHeading}</h3>
          <p>{alertDescription}</p>
          <div className="modal-action">
            <form method="dialog" className="flex gap-1">
              {alertBtnText1 && <button className="btn btn-sm bg-red-500 text-white hover:blue-600" >
                {alertBtnText1}
              </button>}
              {alertBtnText2 && <button
                type="button"
                className="btn btn-sm bg-blue-500 text-white hover:red-600"
                onClick={()=>
                    handelDeleteUser(selectedUser.UserId)
                  }
              >
                {alertBtnText2}
              </button>}
            </form>
          </div>
        </div>
      </dialog>
    </div>
        </div>
      )}
    </>
  );
}

export default AllUsers;
