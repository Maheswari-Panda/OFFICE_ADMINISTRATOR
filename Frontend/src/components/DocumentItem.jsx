import React, { useContext, useEffect, useState } from "react";
import DocumentContext from "../context/document/documentContext";
import userContext from "../context/user/userContext";

function DocumentItem(props) {
  const {document,viewType} = props;
   const context = useContext(userContext);
   const documentContext = useContext(DocumentContext);
   const {documentTypes}=documentContext;

   const {getUserById}=context;

   const [sender, setSender] = useState(null);
   const [receiver, setReceiver] = useState(null);
   const [documentTypeText, setDocumentTypeText] = useState("");

   
 
   useEffect(() => {
     const fetchUsers = async () => {
       try {
         const fetchedReceiver = await getUserById(document.ReceiverId);
         const fetchedSender = await getUserById(document.SenderId);
         setReceiver(fetchedReceiver);
         setSender(fetchedSender);
       } catch (error) {
         console.error("Error fetching users:", error);
       }
     };
 
     fetchUsers();
   }, [document.ReceiverId, document.SenderId, getUserById]);
 
   useEffect(() => {
    if (documentTypes && documentTypes.length > 0) {
      const matchedType = documentTypes.find(
        (type) => type.DocumentTypeId === document.DocumentTypeId
      );
      if (matchedType) {
        setDocumentTypeText(matchedType.DocumentTypeName);
      } else {
        setDocumentTypeText("Unknown Document Type");
      }
    }
  }, [documentTypes, document.DocumentTypeId]);

  //  console.log(sender);
  //  console.log(receiver);
  const handleDocumentView = () => {
    console.log("Clicked on view document");
  };
  return (
    <div className={`${viewType!=='list'?'lg:w-1/5 md:w-1/2 p-2':'w-full p-1'} `} onClick={handleDocumentView}>
      <div className={`${viewType!=='list'?'shadow-md':'flex items-center p-1'} border-2 border-gray-200 bg-white rounded-lg  hover:shadow-lg hover:border-blue-500 transition duration-300 group`}>
        <a className={`${viewType!=='list'?'block relative h-32 rounded-t-lg overflow-hidden':''} `}>
          {/* Badge */}
          <span className={`${viewType!=='list'?'absolute top-2 right-2 bg-blue-50 text-blue-400 text-xs font-semibold px-2 py-1 rounded-full shadow-md z-3':'hidden'} `}>
            {documentTypeText || "Loading..."}
          </span>
          <img
            alt="Document Preview"
            className={` ${viewType!=='list'?'object-cover  border-b-2  rounded-t-lg w-full border-blue-400':'hidden'} `}
            // src="../src/assets/Default_Doc.png"
            src={document?.DocumentPath ||"http://localhost:3000/uploads/UserProfiles/1738161944885.png"}
          />
          <i className="fas fa-file text-blue-500 text-xl p-1"></i>
        </a>
        <div className={`${viewType!=='list'?'p-4 flex justify-between items-center border-t-2 group-hover:bg-blue-500':'w-full group-hover:text-blue-500'}  transition duration-300 `}>
          <div className={`${viewType!=='list'?'':'flex justify-between items-center mx-4'} `}>
            <h2 className={`${viewType!=='list'?'text-gray-900 title-font text-sm my-2 font-semibold group-hover:text-white':'group-hover:text-blue-500 w-1/3'}`}>
              {document.DocumentName}
            </h2>
            <p className={`${viewType!=='list'?'text-gray-600 text-sm mt-1 group-hover:text-white hidden':'group-hover:text-blue-500'}`}>
            {documentTypeText || "Loading..."}
            </p>
            <p className={`${viewType!=='list'?'text-gray-600 text-sm mt-1 group-hover:text-white':'group-hover:text-blue-500'}`}>
              reciever: {receiver ? receiver.FirstName : "Loading..."}
            </p>
            <p className={`${viewType!=='list'?'text-gray-600 text-sm mt-1 group-hover:text-white':'group-hover:text-blue-500'}`}>
              {document.DispatchedDateTime}
            </p>
            <div className={`${viewType!=='list'?'hidden':'relative'} `}>
            <div className="dropdown dropdown-end dropdown-hover">
              <button
                tabIndex={0}
                className={`${viewType!=='list'?'text-blue-500 hover:text-blue-600':'text-gray-500 hover:text-blue-500'}`}
              >
                <i className={`fa-solid fa-ellipsis-vertical ${viewType!=='list'?' group-hover:text-white':'group-hover:text-blue-500'} text-xl`}></i>
              </button>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-white shadow-lg rounded-lg w-44 py-2 border border-gray-200 z-10"
              >
                <li>
                  <a className="px-4 py-2 hover:bg-blue-100 text-gray-700">
                    View Details
                  </a>
                </li>
                <li>
                  <a className="px-4 py-2 hover:bg-blue-100 text-gray-700">
                    Add Comment
                  </a>
                </li>
              </ul>
            </div>
          </div>
          </div>
          <div className={`${viewType!=='list'?'relative':'hidden'} `}>
            <div className="dropdown dropdown-end dropdown-hover">
              <button
                tabIndex={0}
                className="text-blue-500 hover:text-blue-600"
              >
                <i className="fa-solid fa-ellipsis-vertical text-xl group-hover:text-white"></i>
              </button>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-white shadow-lg rounded-lg w-44 py-2 border border-gray-200 z-10"
              >
                <li>
                  <a className="px-4 py-2 hover:bg-blue-100 text-gray-700">
                    View Details
                  </a>
                </li>
                <li>
                  <a className="px-4 py-2 hover:bg-blue-100 text-gray-700">
                    Add Comment
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DocumentItem;
