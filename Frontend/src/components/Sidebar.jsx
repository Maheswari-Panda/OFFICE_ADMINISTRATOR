import React from "react";
import Content from "./Content";

function Sidebar() {
  return (
    <>
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col items-center justify-center">
          {/* Page content here */}
         <Content/>
        </div>
        <div className="drawer-side border-r">
          <label
            htmlFor="my-drawer-2"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu bg-light-200 text-base-content min-h-full w-80 p-4">
            {/* Sidebar content here */}
            <li>
              <a className="text-lg hover:bg-blue-200"><i className="fa-solid fa-gauge"></i> Dashboard</a>
            </li>
            <li>
              <a className="text-lg hover:bg-blue-200"><i className="fa-regular fa-folder"></i> Inward Documents</a>
            </li>
            <li>
              <a className="text-lg hover:bg-blue-200"><i className="fa-solid fa-folder"></i> Outward Documents</a>
            </li>
            <li>
              <a className="text-lg hover:bg-blue-200"><i className="fa-solid fa-clock-rotate-left"></i> Activity</a>
            </li>
            <li>
              <a className="text-lg hover:bg-blue-200"><i className="fa-solid fa-file-lines"></i> Reports</a>
            </li>
            <li>
              <a className="text-lg hover:bg-blue-200"><i className="fa-solid fa-user-plus"></i> Create User</a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
