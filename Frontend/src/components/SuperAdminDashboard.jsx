import React, { useState, useEffect, useContext } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import OfficeContext from "../context/office/officeContext";
import Spinner from './Spinner';

const COLORS = ["#4CAF50", "#FFC107", "#F44336", "#FF54CC", "#0FDDCC", "#FFAA22"];

function SuperAdminDashboard() {
  const officeContext = useContext(OfficeContext);
  const { getAllOfficesDocumentDetails } = officeContext;

  const [offices, setOffices] = useState([]);
  const [selectedOffice, setSelectedOffice] = useState(null);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const data = await getAllOfficesDocumentDetails();
        if (data.length > 0) {
          setOffices(data[0]);
          setSelectedOffice(data[0][0].OfficeId);
          setStats(data[0][0]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      finally{
        setTimeout(()=>{
          setLoading(false);
        },200);
      }
    }
    fetchData();
  }, []);

  return (
    <>
    {loading && <Spinner/>}
    {!loading && <div className="p-6 bg-blue-100 min-h-screen w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-blue-600">📊 Super Admin Dashboard</h1>
        <select
          value={selectedOffice || ""}
          onChange={(e) => {
            const officeId = Number(e.target.value);
            setSelectedOffice(officeId);
            setStats(offices.find((o) => o.OfficeId === officeId) || {});
          }}
          className="p-2 border border-gray-300 rounded-lg shadow-sm bg-white mt-2 sm:mt-0"
        >
          {offices.map((office) => (
            <option key={office.OfficeId} value={office.OfficeId} className="hover:bg-blue-500">
              {office.OfficeName}
            </option>
          ))}
        </select>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {[{ title: "Total Documents", value: stats.TotalDocuments || 0 },
          { title: "Inward Documents", value: stats.InwardDocs || 0 },
          { title: "Outward Documents", value: stats.OutwardDocs || 0 },
          { title: "Approved Documents", value: stats.ApprovedDocs || 0 },
          { title: "Pending Documents", value: stats.PendingDocs || 0 },
          { title: "Rejected Documents", value: stats.RejectedDocs || 0 },
          { title: "Received Documents", value: stats.ReceivedDocs || 0 },
          { title: "Viewed Documents", value: stats.ViewedDocs || 0 },
          { title: "Dispatched Documents", value: stats.DispatchedDocs || 0 }].map((item, index) => (
          <div key={index} className="bg-white border border-gray-300 p-4 rounded-lg shadow-md">
            <h2 className="text-sm text-gray-600">{item.title}</h2>
            <p className="text-lg font-bold text-blue-500">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">📌 Total Documents by Office</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={offices}>
              <XAxis dataKey="OfficeName" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="TotalDocuments" fill="#8884d8" barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">📑 Document Status - {stats.OfficeName}</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[{ name: "Approved", value: stats.ApprovedDocs || 0 },
                  { name: "Pending", value: stats.PendingDocs || 0 },
                  { name: "Rejected", value: stats.RejectedDocs || 0 },
                  { name: "Received", value: stats.ReceivedDocs || 0 },
                  { name: "Viewed", value: stats.ViewedDocs || 0 },
                  { name: "Dispatched", value: stats.DispatchedDocs || 0 }]}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label
              >
                {COLORS.map((color, index) => (
                  <Cell key={index} fill={color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart */}
        <div className="bg-white p-6 rounded-lg shadow-lg col-span-1 lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">📈 Inward vs Outward Documents Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={offices}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="OfficeName" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="InwardDocs" stroke="#4CAF50" strokeWidth={2} dot={{ r: 4 }} name="Inward Docs" />
              <Line type="monotone" dataKey="OutwardDocs" stroke="#F44336" strokeWidth={2} dot={{ r: 4 }} name="Outward Docs" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
}
    </>
          
  );
}

export default SuperAdminDashboard;
