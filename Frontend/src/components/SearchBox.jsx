import React from "react";

const SearchBox = ({ searchText, handleSearch, placeholder = "Search..." }) => {
  return (
    <label className="input input-sm  rounded-md lg:w-1/5 sm:w-1/3 hover:border-blue-500">
    <i className="fas fa-search"></i>
    <input
      type="text"
      placeholder={placeholder}
      value={searchText}
      onChange={handleSearch}
      className="p-2 text-sm"
    />
    </label>
  );
};

export default SearchBox;
