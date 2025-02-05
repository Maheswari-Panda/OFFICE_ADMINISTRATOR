import React, { useContext, useEffect, useState } from "react";
import DocumentItem from "./DocumentItem";
import SearchBar from "./SearchBar";
import DocumentContext from "../context/document/documentContext";

function DocumentContent() {
  const documentContext = useContext(DocumentContext);
  const { documents, getDocuments, getAllDocumentType } = documentContext;
  useEffect(() => {
    getDocuments();
    getAllDocumentType();
  }, []);
  const [viewType, setViewType] = useState("grid"); // 'grid' for current view, 'list' for list view
  const [filteredDocuments, setFilteredDocuments] = useState(documents); // State to hold filtered documents

  useEffect(() => {
    setFilteredDocuments(documents); // Reset filtered documents on initial render
  }, [documents]);

  const handleSearch = (searchTerm, selectedFilter) => {
    let filtered = documents;

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((document) => {
        const documentName = document.DocumentName.toLowerCase();
        const documentDescription = document.DocumentDescription.toLowerCase();
        return (
          documentName.includes(searchTerm.toLowerCase()) ||
          documentDescription.includes(searchTerm.toLowerCase())
        );
      });
    }

    if (selectedFilter) {
      // Filter by selected filter (e.g., "inward", "outward", "letter")
      // Replace with your actual filtering logic based on the selectedFilter
      if (selectedFilter === "inward") {
        filtered = filtered.filter((document) => document.isInward === 0);
      } else if (selectedFilter === "outward") {
        filtered = filtered.filter((document) => document.isInward === 1);
      } else if (selectedFilter === "letter") {
        // Apply filtering logic for "letter" documents
      }
      // Add more filter conditions based on your document types
    }

    setFilteredDocuments(filtered);
  };

  const handleToggleView = () => {
    setViewType(viewType === "grid" ? "list" : "grid");
  };
  return (
    <section className="text-gray-600 body-font w-full">
      <div className="container px-5 py-10 sm:py-5 mx-auto">
        <SearchBar onSearch={handleSearch} />

        <div className="flex justify-between items-center mb-5">
          <div className="text-xl font-semibold">
            <i className="fa-solid fa-clock-rotate-left mx-2"></i>Recent
            Documents
          </div>
          <i className="fa-solid fa-envelopes-bulk"></i>All Documents
          <button onClick={handleToggleView} className="text-xl">
            {viewType === "grid" ? (
              <i className="fas fa-list"></i>
            ) : (
              <i className="fa-solid fa-table"></i>
            )}
          </button>
        </div>

        <div className="flex flex-wrap m-4">
          {filteredDocuments.length === 0 ? (
            <div className="flex justify-center items-center w-full font-bold">
              <p>No documents found with serached name or filter!</p>
            </div>
          ) : (
            filteredDocuments.map((document) => (
              <DocumentItem
                key={document.DocumentId}
                document={document}
                viewType={viewType}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default DocumentContent;
