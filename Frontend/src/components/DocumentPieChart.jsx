import React from "react";
import { PieChart, Pie, Tooltip, Cell } from "recharts";

const COLORS = [
    "#4F46E5", // Deep Indigo (Primary)
    "#6366F1", // Soft Blue
    "#A78BFA", // Purple Accent
    "#38BDF8", // Light Sky Blue
    "#F87171", // Soft Coral Red
    "#64748B", // Neutral Slate Gray
    "#94A3B8", // Light Cool Gray
    "#CBD5E1", // Soft Foggy Gray
  ];

const DocumentPieChart = ({ documentCounts }) => {  // Fix: Extract documentCounts correctly
  console.log(documentCounts);

  if (!Array.isArray(documentCounts) || documentCounts.length === 0) {
    return <p>No data available</p>;  // Handle empty or invalid data
  }

  return (
    <PieChart width={400} height={400}>
      <Pie
        data={documentCounts}  // Fix: Use the correct prop
        cx="50%"
        cy="50%"
        outerRadius={120}
        fill="#8884d8"
        dataKey="TotalCount"
        nameKey="StatusName"
        label
      >
        {documentCounts.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  );
};

export default DocumentPieChart;
