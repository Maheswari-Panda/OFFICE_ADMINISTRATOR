import React from "react";
import Content from "./Content";

function Sidebar() {
  return (
    <>
      <div className="drawer lg:drawer-open flex-1">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        {/* Main Content Area */}
        <div className="drawer-content flex flex-col items-center justify-center">
          {/* Navigation Button for Small Screens */}
          <label
            htmlFor="my-drawer-2"
            className="btn btn-primary drawer-button lg:hidden m-4"
          >
            <i className="fa-solid fa-bars"></i>
          </label>

          {/* Page Content */}
          <Content />
        </div>

        {/* Sidebar */}
        <div className="drawer-side h-screen lg:w-2/3">
          <label
            htmlFor="my-drawer-2"
            className="drawer-overlay w-screen"
          ></label>
          <ul className="menu bg-white text-base-content min-h-full w-80 p-4 border-r">
            {/* Sidebar Links */}
            <li>
              <label htmlFor="my-drawer-2" className="cursor-pointer">
                <i className="fa-solid fa-gauge"></i> Dashboard
              </label>
            </li>
            <li>
              <label htmlFor="my-drawer-2" className="cursor-pointer">
                <i className="fa-regular fa-folder"></i> Inward Documents
              </label>
            </li>
            <li>
              <label htmlFor="my-drawer-2" className="cursor-pointer">
                <i className="fa-solid fa-folder"></i> Outward Documents
              </label>
            </li>
            <li>
              <label htmlFor="my-drawer-2" className="cursor-pointer">
                <i className="fa-solid fa-clock-rotate-left"></i> Activity
              </label>
            </li>
            <li>
              <label htmlFor="my-drawer-2" className="cursor-pointer">
                <i className="fa-solid fa-file-lines"></i> Reports
              </label>
            </li>
            <li>
              <label htmlFor="my-drawer-2" className="cursor-pointer">
                <i className="fa-solid fa-user-plus"></i> Create User
              </label>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
