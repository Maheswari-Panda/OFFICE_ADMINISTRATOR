import React, { useContext, useEffect, useRef, useState } from "react";
import DataTable from "react-data-table-component";
import DocumentContext from "../context/document/documentContext";
import { useNavigate } from "react-router-dom";
import userContext from "../context/user/userContext";
import ModalAlert from "./ModalAlert";

function ReviewDocuments() {
  const {
    documents,
    getAllDocuments,
    addDocumentLog,
    approveDocument,
    addFeedback,
    returnDocument,
  } = useContext(DocumentContext);
  const { user } = useContext(userContext);

  const [activeTab, setActiveTab] = useState("Pending Review"); // Tabs state
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  
  const navigate = useNavigate();
  const modalRef = useRef();
  
  const [alertHeading, setAlertHeading] = useState("");
  const [alertDescription, setAlertDescription] = useState(null);
  const [alertBtnText1, setAlertBtnText1] = useState("");
  const [alertBtnText2, setAlertBtnText2] = useState("");

  const [documentToApprove, setDocumentToApprove] = useState([]);
  const [documentToReturn, setDocumentToReturn] = useState([]);

  useEffect(() => {
    getAllDocuments();
  }, []);

  useEffect(() => {
    // Filter documents based on the selected tab
    const filterDocs = () => {
      switch (activeTab) {
        case "Pending Review":
          return documents.filter((doc) => doc.StatusName === "Pending Review");
        case "Approved":
          return documents.filter((doc) => doc.StatusName === "Approved");
        case "Returned":
          return documents.filter((doc) => doc.StatusName === "Rejected");
        default:
          return documents;
      }
    };

    setFilteredDocuments(filterDocs());
  }, [documents, activeTab]);

  const handleViewDocument = (row) => {
    addDocumentLog(user.UserId, row.DocumentId, "Pending Document Viewed");
    navigate("/dashboard/reviewDocument", { state: { document: row } });
  };

  const handleApproveDocument = (document) => {
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
    const response = await approveDocument(
      documentToApprove.DocumentId,
      "Document Approved"
    );
    if (response) {
      if (feedback) {
        await addFeedback(documentToApprove.DocumentId, feedback, documentToApprove.ReceiverId);
        alert("Document approved with Feedback successfully");
      } else {
        alert("Document Approved without feedback!");
      }
      getAllDocuments();
    } else {
      alert("Error approving document");
    }
  };

  const handleReturnDocument = (document) => {
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

  const onClickReturnDocument = async (feedback) => {
    const response = await returnDocument(
      documentToReturn.DocumentId,
      "Document Returned"
    );
    if (response) {
      if (feedback) {
        await addFeedback(documentToReturn.DocumentId, feedback, documentToReturn.ReceiverId);
        alert("Document returned with Feedback successfully");
      } else {
        alert("Document Returned without feedback!");
      }
      getAllDocuments();
    } else {
      alert("Error in Returning Document");
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
      <h2 className="text-blue-500 text-2xl font-bold mb-4">Review Documents</h2>

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
        <DataTable columns={columns} data={filteredDocuments} />
      </div>

      {/* Modal Alert */}
      <ModalAlert
        modalRef={modalRef}
        heading={alertHeading}
        description={alertDescription}
        btnText1={alertBtnText1}
        btnText2={alertBtnText2}
        feedbackform={true}
        onClickBtn={
          documentToApprove.length === 0 ? onClickReturnDocument : onClickApproveDocument
        }
      />
    </div>
  );
}

export default ReviewDocuments;
