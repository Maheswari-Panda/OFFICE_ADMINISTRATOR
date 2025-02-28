import React, { useContext, useEffect, useState } from "react";
import Content from "./Content";
import AddDocument from "./AddDocument";
import Button from "./Button";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import userContext from "../context/user/userContext";
import CreateUserForm from "./CreateUserForm";
import AllUsers from "./AllUsers";
import UserProfile from "./UserProfile";
import CreateDocument from "./CreateDocument";
import ViewUser from "./ViewUser";
import ReviewDocuments from "./ReviewDocuments";
import AllUserLogs from "./AllUserLogs";
import DocumentDetails from "./DocumentDetails";
import AllDocumentLogs from "./AllDocumentLogs";
import ReportGenerator from "./ReportGenerator";
import UserActivity from "./UserActivity";
import PendingDocuments from "./PendingDocuments";
import ApprovedDocuments from "./ApprovedDocuments";
import AllOffices from "./AllOffices";
import AddOfficeForm from "./AddOfficeForm";
import DocumentLog from "./DocumentLog";

function Sidebar() {
  const context = useContext(userContext);
  const { user } = context;

  const [userLogs, setUserLogs] = useState([]);
  const { getUserLogs } = context;

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const userLogs = await getUserLogs(user.UserId); // Fetch logs for the specific user
        setUserLogs(userLogs);
      } catch (error) {
        console.error("Failed to load user logs:", error);
      }
    };

    fetchLogs();
  }, [user.UserId]);
  // console.log(user.Role);
  return (
    <>
      <div className="drawer lg:drawer-open flex-1 items-start">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        {/* Main Content Area */}
        <div className="drawer-content flex flex-col items-start justify-center">
          {/* Navigation Button for Small Screens */}
          <label
            htmlFor="my-drawer-2"
            className="btn bg-gray-200 text-gray-500 drawer-button lg:hidden w-full"
          >
            <i className="fa-solid fa-bars"></i>
            Menu
          </label>

          {/* <Content/> */}
          <Routes>
            <Route path="addDocument" element={<AddDocument />} />
            <Route path="createDocument" element={<CreateDocument />} />
            <Route path="content" element={<Content />} />
            <Route path="allUsers" element={<AllUsers />} />
            <Route path="createUser" element={<CreateUserForm />} />
            <Route path="myprofile" element={<UserProfile />} />
            <Route path="viewUser" element={<ViewUser />} />
            <Route path="reviewDocument" element={<DocumentDetails />} />
            <Route path="review" element={<ReviewDocuments />} />
            <Route path="pendingDocuments" element={<PendingDocuments />} />
            <Route path="approvedDocuments" element={<ApprovedDocuments />} />
            <Route path="userActivity" element={<AllUserLogs />} />
            <Route path="adminActivity" element={<AllUserLogs />} />
            <Route path="allOffices" element={<AllOffices/>} />
            <Route path="addOffice" element={<AddOfficeForm/>} />
            <Route path="documentLogs" element={<DocumentLog/>} />
            <Route
              path="myActivity"
              element={<UserActivity userLogs={userLogs} />}
            />
            <Route path="alldocumentlogs" element={<AllDocumentLogs />} />
            <Route path="report" element={<ReportGenerator />} />
            <Route path="/" element={<Navigate to="content" />} />
          </Routes>

          {/* Page Content */}
          {/* <AddDocument/> */}
        </div>

        {/* Sidebar */}
        <div className="drawer-side h-screen lg:w-2/3 z-20">
          <label
            htmlFor="my-drawer-2"
            className="drawer-overlay w-screen"
          ></label>
          <ul className="menu bg-white text-base-content min-h-full lg:w-full p-4 border-r border-gray-300 md:w-1/3">
            {/* Button to add document */}
            <Link to="/dashboard/addDocument">
              <Button
                iconTag={<i className="fa-solid fa-plus mx-2"></i>}
                color="blue"
                text="Add Document"
                size="base"
              />
            </Link>

            <Link to="/dashboard/createDocument" className="my-2">
              <Button
                color="blue"
                text="Create Document"
                size="base"
                iconTag={<i className="fa-solid fa-file-pen"></i>}
              />
            </Link>

            {/* Sidebar Links */}
            <Link to="/dashboard/content">
            <li className="w-full">
              <label htmlFor="my-drawer-2" className="cursor-pointer">
                  <i className="fa-solid fa-gauge"></i> Dashboard
              </label>
            </li>
            </Link>
            {user.Role === "Admin" || user.Role==="admin" || user.Role === "SuperAdmin" ? (
              <>
              
              <Link to="/dashboard/review">
                <li>
                  <label htmlFor="my-drawer-2" className="cursor-pointer">
                      <i className="fa-solid fa-folder"></i> Review Documents
                  </label>
                </li>
                </Link>

                <Link to="/dashboard/alldocumentlogs">
                <li>
                  <label htmlFor="my-drawer-2" className="cursor-pointer">
                      <i className="fa-solid fa-folder-open"></i> Document Logs
                  </label>
                </li>
                </Link>

                <Link to="/dashboard/createUser">
                <li>
                  <label htmlFor="my-drawer-2" className="cursor-pointer">
                      <i className="fa-solid fa-user-plus"></i> Create User
                  </label>
                </li>
                </Link>

                <Link to="/dashboard/allUsers">
                <li>
                  <label htmlFor="my-drawer-2" className="cursor-pointer">
                      <i className="fa-solid fa-users"></i> All Users
                  </label>
                </li>
                </Link>


                <Link to="/dashboard/userActivity">
                <li>
                  <label htmlFor="my-drawer-2" className="cursor-pointer">
                      <i className="fa-solid fa-clock-rotate-left"></i> User
                      Activity
                  </label>
                </li>
                </Link>
                {user.Role === "SuperAdmin" && 
                  <>
                    <Link to="/dashboard/adminActivity">

                  <li>
                  <label htmlFor="my-drawer-2" className="cursor-pointer">
                      <i className="fa-solid fa-clock-rotate-left"></i> Admin
                      Activity
                  </label>
                </li>
                </Link>

                <Link to="/dashboard/addOffice">
                <li>
                  <label htmlFor="my-drawer-2" className="cursor-pointer">
                    <i className="fa-solid fa-building-circle-check"></i> Add Offices
                  </label>
                </li>
                </Link>

                <Link to="/dashboard/allOffices">
                  <li>
                  <label htmlFor="my-drawer-2" className="cursor-pointer">
                    <i className="fa-solid fa-building"></i> All Offices
                  </label>
                </li>
                </Link>

                  </>
                }
              </>
            ) : (
              <>
                    <Link to="/dashboard/pendingDocuments">
                <li>
                  <label htmlFor="my-drawer-2" className="cursor-pointer">
                      <i className="fa-solid fa-hourglass-end"></i> Pending
                      Documents
                  </label>
                </li>
                </Link>

                <Link to="/dashboard/approvedDocuments">
                <li>
                  <label htmlFor="my-drawer-2" className="cursor-pointer">
                      <i className="fa-solid fa-file-circle-check"></i> Approved
                      Documents
                  </label>
                </li>
                </Link>


                <Link to="/dashboard/myActivity">
                <li>
                  <label htmlFor="my-drawer-2" className="cursor-pointer">
                      <i className="fa-solid fa-clock-rotate-left"></i> My
                      Activity
                  </label>
                </li>
                </Link>

              </>
            )}
            <Link to="/dashboard/report">
            <li>
              <label htmlFor="my-drawer-2" className="cursor-pointer">
                  <i className="fa-solid fa-file-lines"></i> Reports
              </label>
            </li>
            </Link>

          </ul>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
