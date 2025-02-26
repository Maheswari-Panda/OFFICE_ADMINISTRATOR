import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import DocumentItem from "./DocumentItem";
import SearchBar from "./SearchBar";
import DocumentContext from "../context/document/documentContext";
import DocumentDetails from "./DocumentDetails";
import DataTable from "react-data-table-component";
import "../style/DocumentTable.css";
import ModalAlert from "./ModalAlert";
import Spinner from "./Spinner";
import userContext from '../context/user/userContext';


function DocumentContent() {
  const documentContext = useContext(DocumentContext);
  const {user} = useContext(userContext);
  const { documents, getAllDocuments, addDocumentLog} = documentContext;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAllDocuments();
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  const [viewType, setViewType] = useState("grid"); // 'grid' for current view, 'list' for list view
  const [filteredDocuments, setFilteredDocuments] = useState(documents); // State to hold filtered documents
  const [selectedTab, setSelectedTab] = useState("All"); // Track selected tab

  useEffect(() => {
    setFilteredDocuments(documents); // Reset filtered documents on initial render
  }, [documents]);

  const handleSearch = (
    searchTerm,
    selectedFilter,
    selectedYear,
    selectedMonth,
    selectedDate
  ) => {
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
      filtered = filtered.filter(
        (document) => document.DocumentTypeId === selectedFilter
      );
    }

    if (selectedYear) {
      filtered = filtered.filter(
        (document) =>
          new Date(document.DispatchedDateTime).getFullYear() ===
          Number(selectedYear)
      );
    }

    if (selectedMonth) {
      filtered = filtered.filter(
        (document) =>
          new Date(document.DispatchedDateTime).getMonth() + 1 ===
          Number(selectedMonth)
      );
    }

    if (selectedDate) {
      filtered = filtered.filter(
        (document) =>
          new Date(document.DispatchedDateTime).getDate() ===
          Number(selectedDate)
      );
    }

    if (selectedTab === "Inward") {
      filtered = filtered.filter((document) => document.IsInward === true);
    }

    if (selectedTab === "Outward") {
      filtered = filtered.filter((document) => document.IsInward === false);
    }
    setFilteredDocuments(filtered);
  };

  const handleDocumentTab = (tabName) => {
    let filtered = documents;
    if (tabName === "Inward") {
      setSelectedTab(tabName);
      filtered = filtered.filter((document) => document.IsInward === false);
    } else if (tabName === "Outward") {
      setSelectedTab(tabName);
      filtered = filtered.filter((document) => document.IsInward === true);
    } else {
      setSelectedTab("All");
    }
    setFilteredDocuments(filtered);
  };

  const handleToggleView = () => {
    setViewType(viewType === "grid" ? "list" : "grid");
  };

  const [selectedDocument, setSelectedDocument] = useState(null);

  const handleRowClick = async (row) => {
    console.log("Row clicked:", row);
    setSelectedDocument(row);
    await addDocumentLog(user.UserId,row.DocumentId,"Document Viewed");
  };

  const deleteRef = useRef();
  const handleDeleteModal = async (row) => {
    // setOffice(row);
    deleteRef.current.click();
    console.log(row);
    // deleteRef.current.click();
  };

  const columns = useMemo(
    () => [
      {
        name: "Srno.",
        selector: (row, index) => index + 1,
        sortable: true,
      },
      {
        name: "Inward/Outward",
        selector: (row) => (row?.IsInward ? "Outward" : "Inward") || "N/A",
        sortable: true,
      },
      {
        name: "Date",
        selector: (row) =>
          row?.DispatchedDateTime
            ? new Date(row?.DispatchedDateTime).toLocaleDateString()
            : "N/A",
        sortable: true,
      },
      {
        name: "Name",
        selector: (row) => row?.DocumentName || "N/A",
        sortable: true,
        cell: (row) => (
          <span
            className="cursor-pointer"
            onClick={() => handleRowClick(row)} // Trigger action on clicking document name
          >
            {row?.DocumentName || "N/A"}
          </span>
        ),
      },
      {
        name: "Type",
        selector: (row) => row?.DocumentTypeName || "N/A",
        sortable: true,
      },
      {
        name: "Letter Srno",
        selector: (row) => row?.LetterSerialNumber || "N/A",
        sortable: true,
      },
      {
        name: "I/O Reference",
        selector: (row) => row?.InwardOutwardReferenceDocumentId || "N/A",
        sortable: true,
      },
      {
        name: "Sender",
        selector: (row) => row?.SenderName || "N/A",
        sortable: true,
      },
      {
        name: "Receiver",
        selector: (row) => row?.ReceiverName || "N/A",
        sortable: true,
      },
      {
        name: "End User",
        selector: (row) => row?.EndUserName || "N/A",
        sortable: true,
      },
      {
        name: "Status",
        selector: (row) => row?.StatusName || "N/A",
        sortable: true,
      },
      {
        name: "Actions",
        cell: (row) => (
          <div className="flex space-x-2">
            <button
              title="view document details"
              className="p-1 text-green-500 hover:text-green-600"
              onClick={() => handleRowClick(row)}
            >
              <i className="fas fa-eye"></i>
            </button>
            <button
              title="edit document"
              className="p-1 text-blue-500 hover:text-blue-700"
              onClick={() => handleRowClick(row)}
            >
              <i className="fas fa-edit"></i>
            </button>
            <button
            title="view document logs"
              className="p-1 text-gray-500 hover:text-gray-700"
              onClick={() => handleDeleteModal(row)}
            >
              <i className="fas fa-file"></i>
            </button>
            <button
            title="delete document"
              className="p-1 text-red-500 hover:text-red-700"
              onClick={() => handleDeleteModal(row)}
            >
              <i className="fas fa-trash"></i>
            </button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <>
      {isLoading && <Spinner />}
      {!isLoading && (
        <section className="text-gray-600 body-font w-full">
          {selectedDocument === null && (
            <div className="container px-5 py-10 sm:py-5 mx-auto">
              <SearchBar onSearch={handleSearch} />

              {/* Tabs for All, Inward, Outward */}
              <div className="mb-5 flex justify-center p-5">
                <div className="relative w-full">
                  <div className="grid grid-cols-3 text-center cursor-pointer border-b border-gray-300">
                    <div
                      className={`px-4 py-2 hover:bg-blue-100 hover:text-blue-500 ${
                        selectedTab === "All"
                          ? "bg-blue-100 text-blue-500 border-b-2 rounded-t-md border-blue-500"
                          : "rounded-md text-gray-600"
                      }`}
                      onClick={() => handleDocumentTab("All")}
                    >
                      <i
                        className={`fa-${
                          selectedTab === "All" ? "solid" : "regular"
                        } fa-folder-open`}
                      ></i>{" "}
                      All
                      {selectedTab === "All" && (
                        <span className="mx-2">
                          ({filteredDocuments.length})
                        </span>
                      )}
                    </div>
                    <div
                      className={`px-4 py-2 hover:bg-blue-100 hover:text-blue-500 ${
                        selectedTab === "Inward"
                          ? "bg-blue-100 text-blue-500 border-b-2 rounded-t-md border-blue-500"
                          : "rounded-md text-gray-600"
                      }`}
                      onClick={() => handleDocumentTab("Inward")}
                    >
                      <i
                        className={`fa-${
                          selectedTab === "Inward" ? "solid" : "regular"
                        } fa-folder`}
                      ></i>{" "}
                      Inward
                      {selectedTab === "Inward" && (
                        <span className="mx-2">
                          ({filteredDocuments.length})
                        </span>
                      )}
                    </div>
                    <div
                      className={`px-4 py-2 hover:bg-blue-100 hover:text-blue-500 ${
                        selectedTab === "Outward"
                          ? "bg-blue-100 text-blue-500 border-b-2 rounded-t-md border-blue-500"
                          : "rounded-md text-gray-600"
                      }`}
                      onClick={() => handleDocumentTab("Outward")}
                    >
                      <i
                        className={`fa-${
                          selectedTab === "Outward" ? "solid" : "regular"
                        } fa-folder`}
                      ></i>{" "}
                      Outward
                      {selectedTab === "Outward" && (
                        <span className="mx-2">
                          ({filteredDocuments.length})
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mb-5 px-5">
                <div className="text-base font-semibold">
                  <i className="fa-solid fa-clock-rotate-left mx-2 text-base"></i>
                  Recent Documents
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
                    <p>
                      No documents found with searched name or applied filter!
                    </p>
                  </div>
                ) : viewType === "list" ? (
                  <DataTable
                    columns={columns}
                    data={filteredDocuments}
                    selectableRows
                    onRowClicked={handleRowClick}
                    fixedHeader
                    className="data-table rounded-lg table-auto w-full text-sm text-gray-700 border-separate border-spacing-2 shadow-lg bg-white hover:bg-blue-100 hover:text-blue-500"
                  />
                ) : (
                  filteredDocuments.map((document) => (
                    <DocumentItem
                      key={document.DocumentId}
                      document={document}
                      onSelect={()=>handleRowClick(document)}
                    />
                  ))
                )}
              </div>
            </div>
          )}

          {selectedDocument && (
            <div className="w-full h-full bg-white z-50 flex items-center justify-center">
              <button
                className="absolute top-4 right-4 text-xl rounded-full bg-blue-100 h-10 w-10 hover:bg-blue-300"
                onClick={() => setSelectedDocument(null)}
              >
                <i className="fa-solid fa-xmark text-blue-500"></i>
              </button>
              <DocumentDetails document={selectedDocument} />
            </div>
          )}

          <ModalAlert
            modalRef={deleteRef}
            heading="Are you sure?"
            description="Once you delete a document it cannot be retrive!"
            btnText2="Delete"
            btnText1="Cencel"
          />
        </section>
      )}
    </>
  );
}

export default DocumentContent;
