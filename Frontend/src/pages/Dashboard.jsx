import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

function Dashboard() {
  return (
    <>
      <Navbar/>
      <div className="flex">
        <Sidebar/>
      </div>
      <Footer/>
    </>
  );
}

export default Dashboard;
