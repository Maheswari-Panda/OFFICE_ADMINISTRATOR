import React, { useContext, useEffect, useState } from "react";
import DocumentItem from "./DocumentItem";
import SearchBar from "./SearchBar";
import DocumentContext from "../context/document/documentContext";
import DocumentDetails from "./DocumentDetails";

function DocumentContent() {
  const documentContext = useContext(DocumentContext);
  const { documents, getDocuments,documentTypes, getAllDocumentType } = documentContext;
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
        filtered = filtered.filter((document) => document.DocumentTypeId === selectedFilter);
    }

    setFilteredDocuments(filtered);
  };

  const handleToggleView = () => {
    setViewType(viewType === "grid" ? "list" : "grid");
  };

  const [selectedDocument, setSelectedDocument] = useState(null);

  return (
    <section className="text-gray-600 body-font w-full">
    {selectedDocument===null &&
      <div className="container px-5 py-10 sm:py-5 mx-auto">
        <SearchBar onSearch={handleSearch} />

        <div className="flex justify-between items-center mb-5">
          <div className="text-base font-semibold">
            <i className="fa-solid fa-clock-rotate-left mx-2 text-base"></i>Recent
            Documents
          </div>
          
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
                onSelect={setSelectedDocument}
              />
            ))
          )}
        
          {/* Full-page DocumentDetails */}
        </div>
      </div>}
      {selectedDocument && (
        <div className="w-full h-full bg-white z-50 flex items-center justify-center">
          <button className="absolute top-4 right-4 text-xl rounded-full bg-blue-100 h-10 w-10 hover:bg-blue-300" onClick={() => setSelectedDocument(null)}> <i className="fa-solid fa-xmark text-blue-500"></i> </button>
          <DocumentDetails document={selectedDocument} />
         </div>
      )}
    </section>
  );
}

export default DocumentContent;
