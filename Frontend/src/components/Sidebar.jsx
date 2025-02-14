import React, { useContext } from "react";
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

function Sidebar() {
  const context = useContext(userContext);
  const { user } = context;
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
            <Route path="myprofile" element={<UserProfile/>} />
            <Route path="viewUser" element={<ViewUser/>} />
            <Route path="reviewDocument" element={<DocumentDetails/>} />
            <Route path="review" element={<ReviewDocuments/>} />
            <Route path="userActivity" element={<AllUserLogs/>} />
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
          <ul className="menu bg-white text-base-content min-h-full lg:w-full p-4 border-r md:w-1/3">
            {/* Button to add document */}
            <Link to="/dashboard/addDocument">
              <Button icon="+" color="blue" text="Add Document" size="base" />
            </Link>

            <Link to="/dashboard/createDocument">
              <Button color="blue" text="Create Document" size="base" iconTag={<i className="fa-solid fa-file-pen"></i>}/>
            </Link>

            {/* Sidebar Links */}
            <li>
              <label htmlFor="my-drawer-2" className="cursor-pointer">
                <Link to="/dashboard/content">
                  <i className="fa-solid fa-gauge"></i> Dashboard
                </Link>
              </label>
            </li>
            {user.Role === "Admin" ? (
              <>
              
              <li>
                <label htmlFor="my-drawer-2" className="cursor-pointer">
                  <Link to="/dashboard/review">
                    <i className="fa-solid fa-folder"></i> Review Documents
                  </Link>
                </label>
              </li>
            <li>
            <label htmlFor="my-drawer-2" className="cursor-pointer">
              <Link to="/dashboard/createUser">
                <i className="fa-solid fa-user-plus"></i> Create User
              </Link>
            </label>
          </li>
               <li>
                <label htmlFor="my-drawer-2" className="cursor-pointer">
                  <Link to="/dashboard/allUsers">
                    <i className="fa-solid fa-users"></i> All Users
                  </Link>
                </label>
              </li>

              <li>
                <label htmlFor="my-drawer-2" className="cursor-pointer">
                  <Link to="/dashboard/userActivity">
                    <i className="fa-solid fa-clock-rotate-left"></i> User Activity
                  </Link>
                </label>
              </li>
              
          </>
            ) : (
              <li>
                <label htmlFor="my-drawer-2" className="cursor-pointer">
                  <Link to="">
                    <i className="fa-solid fa-clock-rotate-left"></i> My Activity
                  </Link>
                </label>
              </li>
            )}
            <li>
              <label htmlFor="my-drawer-2" className="cursor-pointer">
                <Link to="">
                  <i className="fa-solid fa-file-lines"></i> Reports
                </Link>
              </label>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
