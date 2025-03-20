import React, { useContext, useEffect, useRef, useState } from "react";
import DataTable from "react-data-table-component";
import DocumentContext from "../context/document/documentContext";
import { useNavigate } from "react-router-dom";
import userContext from "../context/user/userContext";
import ModalAlert from "./ModalAlert";
import Feedback from "./feedback";
import SearchBox from "./SearchBox";
import Spinner from "./Spinner";

function ReviewDocuments() {
  const {
    documents,
    getAllDocuments,
    addDocumentLog,
    approveDocument,
    addFeedback,
    returnDocument,
    getDocumentsByStatusName
  } = useContext(DocumentContext);
  const { user } = useContext(userContext);

  const [activeTab, setActiveTab] = useState("Pending Review"); // Tabs state
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  
  const navigate = useNavigate();
  const modalRef = useRef();
  
  const [alertHeading, setAlertHeading] = useState("");
  const [alertDescription, setAlertDescription] = useState(null);
  const [extraComponent, setExtraComponent] = useState(null);
  const [alertBtnText1, setAlertBtnText1] = useState("");
  const [alertBtnText2, setAlertBtnText2] = useState("");

  const [documentToApprove, setDocumentToApprove] = useState([]);
  const [documentToReturn, setDocumentToReturn] = useState([]);
  const [isfeedbackform,setIsfeedbackform] = useState(true);

  const [loading,setLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      const statusMap = {
        "Pending Review": "Pending Review",
        "Approved": "Approved",
        "Returned": "Rejected",
      };
      
      const statusName = statusMap[activeTab] || "Pending Review";
      const docs = await getDocumentsByStatusName(user.OfficeId,statusName);
      
      if (docs) {
        setFilteredDocuments(docs);
        setFilteredData(docs);
        setTimeout(()=>{ 
        setLoading(false);
        },500);
      }
    };
  
    fetchDocuments();
  }, [activeTab, getDocumentsByStatusName]);

  
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState(filteredDocuments);

  // Handle Search
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchText(value);

    const filtered = filteredDocuments.filter((document) =>
      document.DocumentName.toLowerCase().includes(value) ||
    document.DocumentTypeName.toLowerCase().includes(value) ||
    document.SenderName.toLowerCase().includes(value) ||
    document.ReceiverName.toLowerCase().includes(value) ||
    document.StatusName.toLowerCase().includes(value) ||
      document.StatusName.toLowerCase().includes(value) ||
      new Date(document.DispatchedDateTime).toLocaleDateString().includes(value)
    );

    setFilteredData(filtered);
  };


  const handleViewDocument = async (row) => {
    await addDocumentLog(user.UserId, row.DocumentId, `${activeTab} Document Viewed`);
    navigate("/dashboard/reviewDocument", { state: { document: row } });
  };

  const handleApproveDocument = async (document) => {
    setIsfeedbackform(true);
    setExtraComponent(null);
    setDocumentToApprove(document);
    setDocumentToReturn([]);
    setAlertHeading("Approve Document");
    setAlertDescription(
      <>
        Please review this <span className="font-bold">{document.DocumentName} </span> document carefully before approving it. This action
        cannot be undone!
      </>
    );
    setAlertBtnText1("Cancel");
    setAlertBtnText2("Approve");
    modalRef.current.click();
  };

  const onClickApproveDocument = async (feedback) => {
    setLoading(true);
    const response = await approveDocument(
      documentToApprove.DocumentId,
      "Document Approved"
    );
    if (response) {
      setLoading(false);
      if (feedback) {
        await addFeedback(documentToApprove.DocumentId, feedback, documentToApprove.CreatedByUserId);
        setIsfeedbackform(false);
        setExtraComponent(null);
        setAlertHeading("Document Approved");
        setAlertDescription(
          <>
            Document <span className="font-bold">{document.DocumentName} </span> has been approved with feeddback successfully!.
          </>
        );
        setAlertBtnText1("");
        setAlertBtnText2("Ok");
        modalRef.current.click();
        // alert("Document approved with Feedback successfully");
      } else {
        setIsfeedbackform(false);
        setExtraComponent(null);
        setAlertHeading("Document Approved");
        setAlertDescription(
          <>
            Document <span className="font-bold">{document.DocumentName} </span> has been approved without feeddback successfully!.
          </>
        );
        setAlertBtnText1("");
        setAlertBtnText2("Ok");
        modalRef.current.click();
        // alert("Document Approved without feedback!");
      }
      getAllDocuments();
    } else {
      
      setLoading(false);
        setIsfeedbackform(false);
        setExtraComponent(null);
        setAlertHeading("Error Approving Document!");
        setAlertDescription(
          <>
            Document <span className="font-bold">{document.DocumentName} </span> occurs some error while approving!.
          </>
        );
        setAlertBtnText1("");
        setAlertBtnText2("Ok");
        modalRef.current.click();
      // alert("Error approving document");
    }
  };

  const handleReturnDocument = (document) => {
    setIsfeedbackform(true);
    setExtraComponent(null);
    setDocumentToReturn(document);
    setDocumentToApprove([]);
    setAlertHeading("Return Document");
    setAlertDescription(
      <>
        Review this <span className="font-bold">{document.DocumentName} </span> document carefully before returning it. This action
        cannot be undone!
      </>
    );
    setAlertBtnText1("Cancel");
    setAlertBtnText2("Return");
    modalRef.current.click();
  };

  const handleFeedbackModal = async (document)=>{
    setIsfeedbackform(false);
    setAlertHeading("Document Feedback");
    setAlertDescription(
      <>
        <span className="font-bold">{document.DocumentName} </span>
      </>
    );
    setExtraComponent(<Feedback documentId={document.DocumentId}/>);
    setAlertBtnText1("");
    setAlertBtnText2("Close");
    modalRef.current.click();
  }

  const onClickReturnDocument = async (feedback) => {
    setLoading(true);
    const response = await returnDocument(
      documentToReturn.DocumentId,
      "Document Returned"
    );
    if (response) {
      setLoading(false);
      if (feedback) {
        await addFeedback(documentToReturn.DocumentId, feedback, documentToReturn.CreatedByUserId);
        setIsfeedbackform(false);
        setExtraComponent(null);
        setAlertHeading("Document Returned");
        setAlertDescription(
          <>
            Document <span className="font-bold">{document.DocumentName} </span> has been returned with feeddback successfully!.
          </>
        );
        setAlertBtnText1("");
        setAlertBtnText2("Ok");
        modalRef.current.click();
        // alert("Document returned with Feedback successfully");
      } else {
        setIsfeedbackform(false);
        setExtraComponent(null);
        setAlertHeading("Document Returned");
        setAlertDescription(
          <>
            Document <span className="font-bold">{document.DocumentName} </span> has been returned without feeddback successfully!.
          </>
        );
        setAlertBtnText1("");
        setAlertBtnText2("Ok");
        modalRef.current.click();
        // alert("Document Returned without feedback!");
      }
      getAllDocuments();
    } else {
      setLoading(false);
      setIsfeedbackform(false);
        setExtraComponent(null);
        setAlertHeading("Error Returning Document");
        setAlertDescription(
          <>
            Document <span className="font-bold">{document.DocumentName} </span> occurs some errors while returning the document!.
          </>
        );
        setAlertBtnText1("");
        setAlertBtnText2("Ok");
        modalRef.current.click();
      // alert("Error in Returning Document");
    }
  };

  const columns = [
    {
      name: "Document Name",
      selector: (row) => row.DocumentName,
      sortable: true,
    },
    {
      name: "Submission Date",
      selector: (row) => new Date(row.DispatchedDateTime).toLocaleDateString(),
      sortable: true,
    },
    {
      name: "Document Type",
      selector: (row) => row.DocumentTypeName,
      sortable: true,
    },
    {
      name: "CreatedBy",
      selector: (row) => row.CreatedByUserName,
      sortable: true,
    },
    {
      name: "Sender",
      selector: (row) => row.SenderName,
      sortable: true,
    },
    {
      name: "Final Receiver",
      selector: (row) => row.EndUserName,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.StatusName,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div>
          <button
            className="h-8 w-8 text-white p-1 rounded-full hover:bg-gray-200"
            onClick={() => handleViewDocument(row)}
            title="View Document"
          >
            <i className="fas fa-eye text-xs text-blue-500 hover:text-blue-600"></i>
          </button>
          
          <button
            className="h-8 w-8 text-white p-1 rounded-full hover:bg-gray-200"
            onClick={() => handleFeedbackModal(row)}
            title="Document Feedback"
          >
            <i className="fas fa-comments text-xs text-gray-500 hover:text-gray-600"></i>
          </button>
          {activeTab === "Pending Review" && (
            <>
              <button
                className="h-8 w-8 text-white p-1 rounded-full hover:bg-gray-200"
                onClick={() => handleApproveDocument(row)}
                title="Approve Document"
              >
                <i className="fa-solid fa-check text-green-500 hover:text-green-600"></i>
              </button>
              <button
                className="h-8 w-8 text-white p-1 rounded-full hover:bg-gray-200"
                onClick={() => handleReturnDocument(row)}
                title="Return Document"
              >
                <i className="fa-solid fa-arrow-rotate-left text-red-500 hover:text-red-600"></i>
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-blue-100 p-4 w-full">
      {loading && <Spinner/>}
       {!loading && 
       <>
       <div className="flex justify-between items-center p-2">
        <h2 className="text-blue-500 text-2xl font-bold mb-4">Review Documents</h2>
        {/* Reusable Search Box */}
        <SearchBox searchText={searchText} handleSearch={handleSearch} placeholder="Search Documents..." />
     </div>

      {/* Tabs */}
      <div className="flex justify-around border-b border-gray-300 mb-4">
        {["Pending Review", "Approved", "Returned"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 text-lg w-1/3 ${
              activeTab === tab
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <DataTable columns={columns} data={filteredData} pagination highlightOnHover />
      </div>
      </>
    }
      {/* Modal Alert */}
      <ModalAlert
        modalRef={modalRef}
        heading={alertHeading}
        description={alertDescription}
        btnText1={alertBtnText1}
        btnText2={alertBtnText2}
        feedbackform={isfeedbackform}
        onClickBtn={
          documentToApprove.length === 0 ? onClickReturnDocument : onClickApproveDocument
        }
        extraComponent={extraComponent}
      />
    </div>
  );
}

export default ReviewDocuments;
