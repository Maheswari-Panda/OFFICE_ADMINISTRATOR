import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";

// Convert numeric month to 3-letter format
const getMonthName = (month) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months[month - 1];
};

// Get last 6 months from current date
const getLastSixMonths = () => {
  const result = [];
  const currentDate = new Date();
  for (let i = 5; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    result.push({ month: date.getMonth() + 1, year: date.getFullYear() });
  }
  return result;
};

// Main Component
const DocumentLogChart = ({ data }) => {
  const recentMonths = getLastSixMonths();

  // Filter and format only last 6 months
  const formattedData = recentMonths.map(({ month, year }) => {
    const logEntry = data.find(d => d.Month === month && d.Year === year);
    return {
      name: `${getMonthName(month)} ${year}`,
      logs: logEntry ? logEntry.TotalDocumentLogs : 0
    };
  });

  return (
    <div className="bg-white p-6">
      <h2 className="text-base text-center font-semibold text-gray-700 mb-4">📈 Monthly Document Logs (Last 6 Months)</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={formattedData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="logs" fill="#4F46E5">
            <LabelList dataKey="logs" position="top" fill="#333" fontSize={12} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DocumentLogChart;
