import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const DocumentAvailabilityChart = ({ monthlyDocumentCounts = [] }) => {
  const currentYear = new Date().getFullYear();

  // Generate all months of the current year with zero values
  const allMonths = Array.from({ length: 12 }, (_, i) => ({
    Year: currentYear,
    Month: i + 1, // Month is 1-based (Jan = 1, Feb = 2, etc.)
    MonthlyReceivedDocuments: 0,
    MonthlyOutwardDocuments: 0,
  }));

  // Merge the actual data with zero-filled months
  const mergedData = allMonths.map((monthData) => {
    const existingData = monthlyDocumentCounts.find(
      (item) => item.Year === monthData.Year && item.Month === monthData.Month
    );

    return existingData || monthData; // Use actual data if exists, else default to zero
  });

  // Format data for the chart
  const formattedData = mergedData.map((item) => ({
    month: `${new Date(item.Year, item.Month - 1).toLocaleString("default", { month: "short" })} ${item.Year}`,
    received: item.MonthlyReceivedDocuments,
    outward: item.MonthlyOutwardDocuments,
  }));

  return (
    <div style={{ textAlign: "center" }}>
      <h3 style={{ marginBottom: "10px", fontSize: "18px", color: "#334155" }}>Monthly Document Flow</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={formattedData}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="received" stroke="#4F46E5" name="Received Documents" />
          <Line type="monotone" dataKey="outward" stroke="#F87171" name="Outward Documents" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DocumentAvailabilityChart;
