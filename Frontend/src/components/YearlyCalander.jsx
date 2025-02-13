import React, { useState, useEffect, useMemo } from "react";

const YearlyCalendar = ({ userLog = [] }) => {
  const currentYear = new Date().getFullYear();
  const [activeDays, setActiveDays] = useState(new Set());

  useEffect(() => {
    const activeDates = new Set(userLog.map(log => new Date(log.timestamp).toDateString()));
    setActiveDays(activeDates);
  }, [userLog]);

  const months = useMemo(() => Array.from({ length: 12 }, (_, i) => new Date(currentYear, i, 1)), [currentYear]);

  return (
    <div className="p-4 bg-gray-100 h-full overflow-scroll scroll-smooth w-full">
      <h2 className="text-xl font-bold text-center mb-4">Yearly Calendar - {currentYear}</h2>
      <div className="grid xl:grid-cols-3 md:grid-cols-2 lg:gap-4 md:gap-1">
        {months.map((month, index) => {
          const monthName = month.toLocaleString("default", { month: "long" });
          const firstDay = new Date(currentYear, index, 1).getDay();
          const daysInMonth = new Date(currentYear, index + 1, 0).getDate();

          return (
            <div key={index} className="bg-white shadow-md p-4 rounded-lg">
              <h3 className="text-center font-semibold text-blue-500">{monthName}</h3>
              <div className="grid grid-cols-7 gap-1 text-xs mt-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                  <div key={day} className="text-gray-500 text-center font-bold">{day}</div>
                ))}
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${index}-${i}`} className="text-center"></div>
                ))}
                {Array.from({ length: daysInMonth }, (_, day) => {
                  const date = new Date(currentYear, index, day + 1).toDateString();
                  const isActive = activeDays.has(date);

                  return (
                    <div
                      key={date || `day-${day}`}
                      className={`text-center p-1 rounded-md cursor-pointer
                      ${isActive ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
                    >
                      {day + 1}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default YearlyCalendar;
