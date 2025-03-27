import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Function to convert month numbers to names
const getMonthName = (month) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months[month - 1]; // Month is 1-based index
};

// Document Log Chart Component
const DocumentLogChart = ({ data }) => {
  // Convert API response to match chart format
  const formattedData = data.map(item => ({
    name: `${getMonthName(item.Month)} ${item.Year}`,  // Example: "Mar 2025"
    logs: item.TotalDocumentLogs
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={formattedData}
      title="Monthly Document Logs">
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="logs" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default DocumentLogChart;
