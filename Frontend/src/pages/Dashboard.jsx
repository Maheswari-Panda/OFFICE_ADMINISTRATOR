import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

function Dashboard() {
  return (
    <>
      <Navbar/>
      <div className="flex">
        <Sidebar className="w-1/4 bg-gray-200" />
      </div>
      {/* <Footer/> */}
    </>
  );
}

export default Dashboard;
