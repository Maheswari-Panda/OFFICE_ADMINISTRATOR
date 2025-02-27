import React, { useContext, useEffect, useRef, useState } from "react";
import DocumentPreview from "./DocumentPreview";
import { useNavigate } from "react-router-dom";
import DocumentContext from "../context/document/documentContext";
import ModalAlert from "./ModalAlert";

function DocumentItem(props) {
  const {document,onSelect} = props;
  const {getDocumentLogsByDocumentId}=useContext(DocumentContext);
  const navigate = useNavigate();
  
  const handleDocumentLogView = async() =>{
    const documentLog = await getDocumentLogsByDocumentId(document.DocumentId)
    navigate("/dashboard/documentLogs",{ state: { documentLog: documentLog } });
  }

  const handleRowClick = async () => {
    console.log("Row clicked:", document);
    onSelect(document);
    await addDocumentLog(user.UserId,document.DocumentId,"Document Viewed");
  };

   const deleteRef = useRef();
    const handleDeleteModal = async () => {
      deleteRef.current.click();
    };
  

  return (
    <div className='lg:w-1/5 md:w-1/2 p-2'>
      <div className='shadow-md border-2 border-gray-200 bg-white rounded-lg  hover:shadow-lg hover:border-blue-500 transition duration-300 group'>
        <div className='block relative h-32 rounded-t-lg overflow-hidden cursor-pointer' onClick={() => onSelect(document)}>
          {/* Badge */}
          <span className='absolute top-2 right-2 bg-blue-50 text-blue-400 text-xs font-semibold px-2 py-1 rounded-full shadow-md z-10'>
            {document.DocumentTypeName}
          </span>
          {/* <img
            alt="Document Preview"
            className={` ${viewType!=='list'?'object-cover  border-b-2  rounded-t-lg w-full border-blue-400':'hidden'} `}
            src={document?.DocumentPath ||"http://localhost:3000/uploads/UserProfiles/1738161944885.png"}
          /> */}

              <DocumentPreview docpath={document.DocumentPath}/>

        </div>
        <div className='p-4 flex justify-between items-center border-t border-gray-200 group-hover:bg-blue-500  transition duration-300'>
          <div className="">
            
            <h2 className='text-gray-900 title-font text-sm font-semibold group-hover:text-white'>
              {document.DocumentName.length>30?(document.DocumentName).slice(0,27)+"..":document.DocumentName}
            </h2>
            <p className='text-gray-600 text-sm mt-1 group-hover:text-white hidden'>
            {document.DocumentTypeName}
            </p>
            <p className='text-gray-400 text-sm group-hover:text-white'>
              From : {document.SenderName}
            </p>
            <p className='text-gray-400 text-sm group-hover:text-white'>
              To : {document.ReceiverName}
            </p>
            <p className='text-gray-400 text-sm group-hover:text-white'>
              {new Date(document.DispatchedDateTime).toLocaleDateString()}
            </p>

            </div>
            <div>
              <div className="dropdown dropdown-end group-hover:text-white">
                <div tabIndex={0} role="button" className="cursor-pointer"><i className="fa-solid fa-ellipsis-vertical"></i></div>
                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                  <li className="text-black"><a> <i className="fas fa-edit text-blue-500"></i> Edit</a></li>
                  <li className="text-black" onClick={handleDeleteModal}><a> <i className="fas fa-trash text-blue-500"></i> Delete</a></li>
                  <li className="text-black" onClick={handleDocumentLogView}><div> <i className="fas fa-file text-blue-500"></i> View Logs</div></li>
                  <li className="text-black" onClick={handleRowClick}><a> <i className="fas fa-eye text-blue-500"></i> View Details</a></li>
                </ul>
              </div>
            </div>
        </div>
      </div>
      <ModalAlert
            modalRef={deleteRef}
            heading="Are you sure?"
            description="Once you delete a document it cannot be retrive!"
            btnText2="Delete"
            btnText1="Cencel"
          />
    </div>
  );
}

export default DocumentItem;
