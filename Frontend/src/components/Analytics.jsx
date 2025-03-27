import React, { useContext, useEffect, useState } from 'react'
import DocumentPieChart from './DocumentPieChart'
import DocumentLogChart from './DocumentLogChart'
import DocumentAvailabilityChart from './DocumentAvailabilityChart'
import DocumentContext from '../context/document/documentContext'
import userContext from '../context/user/userContext'

function Analytics() {
    const {user} = useContext(userContext);
    const {getDocumentCounts,getMonthlyDocumentLogCounts} = useContext(DocumentContext);

    const [documentData,setDocumentData]=useState([]);
    const [monthlyDocumentCounts,setMonthlyDocumentCounts]=useState([]);
    const [monthlyDocumentLogCounts,setMonthlyDocumentLogCounts]=useState([]);

    useEffect(() => {
        const fetchDocumentCounts = async () => {
          try {
            const documentCounts = await getDocumentCounts(user.OfficeId);
            const monthlyLogs = await getMonthlyDocumentLogCounts(user.OfficeId);
      
            if (Array.isArray(documentCounts) && documentCounts.length > 4) {
              setDocumentData(documentCounts[4] || {});  // Default to empty object if undefined
              setMonthlyDocumentCounts(documentCounts[3] || {}); 
            } else {
              console.warn("Unexpected response structure for documentCounts:", documentCounts);
            }
      
            if (Array.isArray(monthlyLogs[0])) {
              setMonthlyDocumentLogCounts(monthlyLogs[0] || []);
            } else {
              console.warn("Unexpected response structure for monthlyLogs:", monthlyLogs[0]);
            }
      
            console.log("Document Data:", documentCounts[4]);
            console.log("Monthly Document Counts:", documentCounts[3]);
            console.log("Monthly Logs:", monthlyLogs[0]);
            
          } catch (error) {
            console.error("Failed to fetch document counts for given office ID:", error);
          }
        };
      
        fetchDocumentCounts();
      }, []);  // Add user.OfficeId as dependency if it can change
      

  return (
    <div className='items-start bg-blue-100 w-full h-screen overflow-scroll'>
       <div className='flex flex-wrap items-center justify-around bg-white rounded-md m-2'>
            <div className='text-center w-auto'>
                <DocumentLogChart data={monthlyDocumentLogCounts} />
                <p className="text-black text-center">Monthly Document Log Counts</p>
            </div>
            <div>
                <DocumentPieChart documentCounts={documentData}/>
                <p className="text-black text-center mb-10">Document Counts by Status</p>
            </div>
       </div>
       <div className='bg-white rounded-md border-2 border-dashed border-gray-300 m-2 p-2'>
            <DocumentAvailabilityChart monthlyDocumentCounts={monthlyDocumentCounts}/>
       </div>
    </div>
  )
}

export default Analytics