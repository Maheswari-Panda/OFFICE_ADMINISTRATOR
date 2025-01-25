import React, { useContext } from "react";
import userContext from "../context/user/userContext";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const nagivate = useNavigate();
  const context = useContext(userContext);
  const { user,logout, getUser } = context;
  const handleLogout=()=>{
    const status = logout();
    if(status){
      nagivate("/");
    }
  }
  return (
    <>
      <div className="navbar bg-base-100 border-b">
  {/* Logo Section */}
  <div className="flex-none">
    <button className="btn btn-square btn-ghost mx-2">
      <img type="image/ico" src="/src/assets/msu_dark_logo/favicon.ico" alt="Logo" />
    </button>
  </div>

  {/* Title Section */}
  <div className="flex-1">
    <a className="lg:text-2xl md:text-lg font-bold">Computer Center</a>
  </div>

  {/* User Info and Menu */}
  <div className="flex-none gap-2">
    <ul className="hidden lg:flex menu menu-horizontal px-1 text-base">
      <li>
        <a>{user.FirstName + " " + user.LastName}</a>
      </li>
    </ul>

    {/* Dropdown for User Avatar */}
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle avatar"
      >
        <div className="w-10 rounded-full">
          <img
            alt="User Avatar"
            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
          />
        </div>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
      >
        <li>
          <a className="justify-between">
            Profile
            <span className="badge">New</span>
          </a>
        </li>
        <li>
          <a>Settings</a>
        </li>
        <li>
          <a onClick={handleLogout}>Logout</a>
        </li>
      </ul>
    </div>
  </div>
</div>

    </>
  );
}

export default Navbar;
