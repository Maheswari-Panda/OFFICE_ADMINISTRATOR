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

const DocumentPieChart = ({ documentCounts }) => {
  if (!Array.isArray(documentCounts) || documentCounts.length === 0) {
    return <p>No data available</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <PieChart width={450} height={400}>
        <Pie
          data={documentCounts}
          cx="50%"
          cy="50%"
          outerRadius={120}
          fill="#8884d8"
          dataKey="TotalCount"
          nameKey="StatusName"
          label={({ name, value }) =>
            `${name} (${value})`
          }
        >
          {documentCounts.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>

      {/* 🟣 Custom Legend */}
      <div className="mt-4 flex flex-wrap justify-center gap-4">
        {documentCounts.map((entry, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            ></div>
            <span className="text-sm text-gray-700">{entry.StatusName}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentPieChart;
