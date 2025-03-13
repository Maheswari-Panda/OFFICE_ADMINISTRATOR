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
import { useNavigate } from "react-router-dom";
import Feedback from "./feedback";


function DocumentContent() {
  const documentContext = useContext(DocumentContext);
  const {user} = useContext(userContext);
  const { documents, getAllDocuments, addDocumentLog,getDocumentLogsByDocumentId,getAllDocumentsReceivedDispatched,getAllDocumentsReceivedDispatchedByOfficeId} = documentContext;
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  
  const modalRef = useRef();
  const [alertHeading, setAlertHeading] = useState("");
  const [alertDescription, setAlertDescription] = useState(null);
  const [alertBtnText2, setAlertBtnText2] = useState("");
  const [alertBtnText1, setAlertBtnText1] = useState("");
  const [extraComponent,setExtraComponent] = useState(null);
  const [isfeedbackform,setIsfeedbackform] = useState(false);
  

  useEffect(() => {
    // getAllDocuments();
    if(user.Role==="Admin" || user.Role==="admin" || user.Role==="user" || user.Role==="User"){
      getAllDocumentsReceivedDispatchedByOfficeId(user.OfficeId);
    }
    else{
      getAllDocumentsReceivedDispatched();
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  const [viewType, setViewType] = useState("grid"); // 'grid' for current view, 'list' for list view
  const [filteredDocuments, setFilteredDocuments] = useState(documents); // State to hold filtered documents
  const [selectedTab, setSelectedTab] = useState("All"); // Track selected tab
  const [isUnread,setIsUnread] = useState(false);

  useEffect(() => {
    setFilteredDocuments(documents); // Reset filtered documents on initial render
    let unreadDocuments = documents.filter(
      (document) => document.StatusName === "Received"
    );
    if(unreadDocuments.length>0){
      setIsUnread(true);
    }
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

  const handleDocumentLogView = async(row) =>{
    const documentLog = await getDocumentLogsByDocumentId(row.DocumentId)
    navigate("/dashboard/documentLogs",{ state: { documentLog: documentLog } });
  }

  const handleDeleteModal = async (document) => {
    setAlertHeading("Are you Sure you want to delete this document?");
    setAlertDescription(<span>Once you delete this <b>{document.DocumentName} </b> then you cannot retrive it.</span>);
    setExtraComponent(null);
    setAlertBtnText1("Cencel");
    setAlertBtnText2("Delete");
    modalRef.current.click();
  };

  const handleFeedbackModal = async (document)=>{
    setAlertHeading("Document Feedback");
    setAlertDescription(
      <>
        <span className="font-bold">{document.DocumentName} </span>
      </>
    );
    setExtraComponent(<Feedback documentId={document.DocumentId}/>);
    setAlertBtnText1("");
    setAlertBtnText2("Ok");
    modalRef.current.click();
  }

  const handleDownload = (document) => {
    console.log("Downloading...",document);
  };

  const columns = useMemo(
    () => [
      {
        name: "Srno.",
        selector: (row, index) => index + 1,
        sortable: true,
        width: "80px"
      },
      {
        name: "Inward/Outward",
        selector: (row) => (
          <span>
          {row.StatusName==="Received" && 
            <div className="inline-grid *:[grid-area:1/1] p-2">
              <div className="status status-error animate-ping"></div>
              <div className="status status-error"></div>
            </div>}
            {row?.IsInward ? "Outward" : "Inward" || "N/A"}
        
        </span>),
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
        width: "200px"
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
        name: "Status",
        selector: (row) => row?.StatusName || "N/A",
        sortable: true,
      },
      {
        name: "Actions",
        width:"200px",
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
              onClick={() => handleDocumentLogView(row)}
            >
              <i className="fas fa-file"></i>
            </button>
            <button
            title="view feedbacks"
              className="p-1 text-pink-500 hover:text-pink-700"
              onClick={() => handleFeedbackModal(row)}
            >
              <i className="fas fa-comments"></i>
            </button>
            <button
            title="download document"
              className="p-1 text-black hover:text-black"
              onClick={() => handleDownload(row)}
            >
              <i className="fas fa-download"></i>
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
                      
                      {isUnread && 
            <div className="inline-grid *:[grid-area:1/1] p-2">
              <div className="status status-error animate-ping"></div>
              <div className="status status-error"></div>
            </div>}
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
                      
                      {isUnread && 
            <div className="inline-grid *:[grid-area:1/1] p-2">
              <div className="status status-error animate-ping"></div>
              <div className="status status-error"></div>
            </div>}
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
                      handleDeleteModal={()=>handleDeleteModal(document)}
                      handleFeedbackModal={()=>handleFeedbackModal(document)}
                      handleDownload={()=>handleDownload(document)}
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
        modalRef={modalRef}
        heading={alertHeading}
        description={alertDescription}
        btnText1={alertBtnText1}
        btnText2={alertBtnText2}
        extraComponent={extraComponent}
          />
        </section>
      )}
    </>
  );
}

export default DocumentContent;
