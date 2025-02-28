import React, { useContext, useEffect, useState } from "react";
import DocumentContext from "../context/document/documentContext";
import DocumentActivity from "./DocumentActivity";
import Spinner from "./Spinner";
import userContext from "../context/user/userContext";

function AllDocumentLogs() {
  const {user} = useContext(userContext);
  const { getAllDocumentLogs,getDocumentLogsByOfficeId } = useContext(DocumentContext);
  const [documentLogs, setDocumentLogs] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        if(user.Role === "Admin" || user.Role ==="admin"){
          const docLogs = await getDocumentLogsByOfficeId(user.OfficeId); // Fetch logs for the specific user
          setDocumentLogs(docLogs);
        }
        else{
          const docLogs = await getAllDocumentLogs(); // Fetch logs for the specific user
          setDocumentLogs(docLogs);
        }
      } catch (error) {
        console.error("Failed to load document logs of this office:", error);
      } finally {
        setTimeout(()=>{
          setIsLoading(false);
        },200);
      }
    };

    fetchLogs();
  }, []);

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="min-h-screen bg-blue-100 p-4 w-full">
          <h2 className="text-blue-500 text-2xl font-bold mb-4">
            Documents Logs
          </h2>

          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <DocumentActivity documentLogs={documentLogs} />
            {documentLogs.length === 0 && (
              <p className="text-center text-blue-500 p-2">
                No Document Logs found right now
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default AllDocumentLogs;
