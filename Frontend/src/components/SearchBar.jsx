import React, { useContext, useEffect, useState } from "react";
import DocumentContext from "../context/document/documentContext";

function SearchBar({ onSearch, onFilter }) {
  const documentContext = useContext(DocumentContext);
  const { documentTypes, getAllDocumentType } = documentContext;
  useEffect(() => {
    getAllDocumentType();
  }, []);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(null); // Store the selected filter

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchClick = () => {
    onSearch(searchTerm, selectedFilter); // Call the onSearch function with the search term
  };

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    onSearch(searchTerm, filter); // Call onSearch with updated filter
  };

  return (
    <div className="flex flex-col text-center w-full mb-8 border-b-2 border-dashed pb-3">
      <div className="flex flex-wrap items-center justify-center p-4 space-y-2 lg:space-y-0 lg:space-x-4 bg-white rounded-lg w-full max-w-6xl mx-auto">
        {/* Search Bar */}
        <div className="flex bg-gray-100 p-2 w-full lg:max-w-lg rounded-md hover:shadow-lg hover:border-blue-400 hover:bg-white border transition duration-300">
          <i className="fa-solid fa-magnifying-glass text-blue-500 text-sm"></i>
          <input
            className="bg-gray-100 outline-none flex-grow ml-2 text-sm text-gray-600 hover:bg-white"
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
            tabIndex={0}
            role="button"
            className="flex items-center space-x-2 bg-gray-100 text-gray-400 py-2 px-4 rounded-md text-sm cursor-pointer hover:bg-blue-500 hover:text-white sm:mx-1 md:my-2"
            
          >
            <i className="fa-solid fa-sliders"></i>
            <span>Filters</span>
          </summary>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-white shadow-md rounded-md w-40 p-2 text-sm text-gray-600 z-10"
          >
            {documentTypes.map((documentType, index) => {
              return (
                <li key={`${documentType.DocumentTypeId}-${index}`}>
                  <a
                    className={`hover:bg-blue-100 px-2 py-1 rounded ${
                      selectedFilter === documentType.DocumentTypeId ? "bg-blue-100" : ""
                    }`}
                    onClick={() =>
                      handleFilterChange(documentType.DocumentTypeId)
                    }
                  >
                    {documentType.DocumentTypeName}
                  </a>
                </li>
              );
            })}
          </ul>
        </details>
      </div>
    </div>
  );
}

export default SearchBar;
