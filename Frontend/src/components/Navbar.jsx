import React, { useContext } from "react";
import userContext from "../context/user/userContext";
import { Link, useNavigate } from "react-router-dom";

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
    <a className="lg:text-2xl md:text-lg font-serif">Computer Center</a>
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
          {user?.ProfileImageUrl ? (
            <img
              src={user?.ProfileImageUrl}
              alt="Profile"
            />
          ) : (
            <i className="fas fa-user-circle text-3xl text-blue-500"></i>
          )}
        </div>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[100] mt-3 w-52 p-2 shadow"
      >
        <li>
          <Link className="gap-2" to="/dashboard/myprofile">
            <i className="fas fa-user text-xs"></i> View Profile
          </Link>
        </li>
        <li>
          <Link className="gap-2" onClick={handleLogout} to="/"> <i className="fa-solid fa-arrow-up-from-bracket"></i>Logout</Link>
        </li>
      </ul>
    </div>
  </div>
</div>

    </>
  );
}

export default Navbar;
