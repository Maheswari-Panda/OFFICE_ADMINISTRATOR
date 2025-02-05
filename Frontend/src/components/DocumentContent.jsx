import React, { useContext, useEffect, useState } from "react";
import DocumentItem from "./DocumentItem";
import SearchBar from "./SearchBar";
import DocumentContext from "../context/document/documentContext";

function DocumentContent() {
  const documentContext = useContext(DocumentContext);
  const {documents,getDocuments,getAllDocumentType}=documentContext;
  useEffect(()=>{
    getDocuments()
    getAllDocumentType()
  },[])
  const [viewType, setViewType] = useState('grid');  // 'grid' for current view, 'list' for list view

  const handleToggleView = () => {
    setViewType(viewType === 'grid' ? 'list' : 'grid');
  };
  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-10 sm:py-5 mx-auto">
        <SearchBar />

        <div className="flex justify-between items-center mb-5">
          <div className="text-xl font-semibold"><i className="fa-solid fa-clock-rotate-left mx-2"></i>Recent Documents</div>
          <i className="fa-solid fa-envelopes-bulk"></i>All Documents
          <button onClick={handleToggleView} className="text-xl">
            {viewType === 'grid' ? (
              <i className="fas fa-list"></i>
            ) : (
              <i className="fa-solid fa-table"></i>
            )}
          </button>
        </div>

        <div className="flex flex-wrap m-4">
        {documents.map((document)=>{
                  return( <DocumentItem key={document.DocumentId} document={document} viewType={viewType}/>);
              })}

        </div>
      </div>
    </section>
  );
}

export default DocumentContent;
