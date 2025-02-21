import React, { useContext, useEffect, useState } from "react";
import DocumentPreview from "./DocumentPreview";

function DocumentItem(props) {
  const {document,onSelect} = props;

  return (
    <div className='lg:w-1/5 md:w-1/2 p-2' onClick={() => onSelect(document)}>
      <div className='shadow-md border-2 border-gray-200 bg-white rounded-lg  hover:shadow-lg hover:border-blue-500 transition duration-300 group'>
        <div className='block relative h-32 rounded-t-lg overflow-hidden'>
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
           
            </div>
        </div>
      </div>
    </div>
  );
}

export default DocumentItem;
