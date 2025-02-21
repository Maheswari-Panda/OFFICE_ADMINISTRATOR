import React, { useContext, useEffect, useState } from "react";
import DocumentContext from "../context/document/documentContext";

function SearchBar({ onSearch }) {
  const documentContext = useContext(DocumentContext);
  const { documentTypes, getAllDocumentType } = documentContext;

  useEffect(() => {
    getAllDocumentType();
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [selectedYear, setSelectedYear] = useState(""); 
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchClick = () => {
    onSearch(searchTerm, selectedFilter, selectedYear, selectedMonth, selectedDate);
  };

  const handleFilterChange = (filter) => {
    if(selectedFilter===filter){
      setSelectedFilter(null);
      onSearch(searchTerm, null, selectedYear, selectedMonth, selectedDate);
    }
    else{
      setSelectedFilter(filter);
      onSearch(searchTerm, filter, selectedYear, selectedMonth, selectedDate);
    }
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
    onSearch(searchTerm, selectedFilter, event.target.value, selectedMonth, selectedDate);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
    onSearch(searchTerm, selectedFilter, selectedYear, event.target.value, selectedDate);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
    onSearch(searchTerm, selectedFilter, selectedYear, selectedMonth, event.target.value);
  };

  // Generate list of years (from 2000 to current year)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1999 }, (_, i) => 2000 + i);
  
  const months = [
    { name: "January", value: "01" }, { name: "February", value: "02" },
    { name: "March", value: "03" }, { name: "April", value: "04" },
    { name: "May", value: "05" }, { name: "June", value: "06" },
    { name: "July", value: "07" }, { name: "August", value: "08" },
    { name: "September", value: "09" }, { name: "October", value: "10" },
    { name: "November", value: "11" }, { name: "December", value: "12" }
  ];

  return (
    <div className="flex flex-col text-center w-full mb-8 border-b-2 border-dashed border-gray-300 pb-3">
      <div className="flex flex-wrap items-center justify-center p-4 space-y-2 lg:space-y-0 lg:space-x-4 bg-white rounded-lg w-full max-w-6xl mx-auto">
        {/* Search Bar */}
        <div className="flex bg-gray-100 p-2 w-full lg:max-w-lg rounded-md hover:shadow-lg hover:border-blue-400 hover:bg-white border border-gray-300 transition duration-300">
          <i className="fa-solid fa-magnifying-glass text-blue-500 text-sm"></i>
          <input
            className="bg-gray-100 outline-none border-0 flex-grow ml-2 text-sm text-gray-600 hover:bg-white"
            type="text"
            placeholder="Search Documents..."
            value={searchTerm}
            onChange={handleSearchChange}
            onChangeCapture={handleSearchClick}
          />
        </div>

        {/* Search Button */}
        <div
          className="bg-blue-500 py-2 px-6 text-white font-medium rounded-md text-sm hover:bg-blue-600 transition duration-300 cursor-pointer sm:mx-2"
          onClick={handleSearchClick}
        >
          <span>Search</span>
        </div>

        {/* Filters Dropdown */}
        <details className="dropdown">
          <summary
            className={`btn-base m-1 flex items-center space-x-2 ${selectedFilter!==null?'bg-blue-500 text-white':'bg-gray-100 text-gray-400'}  py-2 px-4 rounded-md text-sm cursor-pointer hover:bg-blue-500 hover:text-white sm:mx-1 md:my-2`}
          >
            <i className="fa-solid fa-sliders"></i>
            <span>Filters</span>
          </summary>
          <ul className="dropdown-content menu bg-white shadow-md rounded-md w-40 p-2 text-sm text-gray-600 z-10">
            {documentTypes.map((documentType, index) => (
              <li key={`${documentType.DocumentTypeId}-${index}`}>
                <a
                  className={`hover:bg-blue-100 px-2 py-1 rounded ${
                    selectedFilter === documentType.DocumentTypeId ? "bg-blue-200" : ""
                  }`}
                  onClick={() => handleFilterChange(documentType.DocumentTypeId)}
                >
                  {documentType.DocumentTypeName}
                </a>
              </li>
            ))}
          </ul>
        </details>

        {/* Date Filters */}
        <div className="flex space-x-2">
          {/* Year Dropdown */}
          <select
            className="bg-gray-100 p-2 rounded-md text-sm cursor-pointer hover:bg-blue-500 hover:text-white border-none"
            value={selectedYear}
            onChange={handleYearChange}
          >
            <option value="">Year</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          {/* Month Dropdown */}
          <select
            className="bg-gray-100 p-2 border-none rounded-md text-sm cursor-pointer hover:bg-blue-500 hover:text-white"
            value={selectedMonth}
            onChange={handleMonthChange}
            disabled={!selectedYear} // Enable only after selecting a year
          >
            <option value="">Month</option>
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.name}
              </option>
            ))}
          </select>

          {/* Date Dropdown */}
          <select
            className="bg-gray-100 p-2 border-none rounded-md text-sm cursor-pointer hover:bg-blue-500 hover:text-white"
            value={selectedDate}
            onChange={handleDateChange}
            disabled={!selectedMonth} // Enable only after selecting a month
          >
            <option value="">Date</option>
            {[...Array(31)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
