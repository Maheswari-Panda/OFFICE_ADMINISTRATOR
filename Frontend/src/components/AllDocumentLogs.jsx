import React from 'react'

function AllDocumentLogs() {
  return (
    <div className="min-h-screen bg-blue-100 p-4 w-full">
    <h2 className="text-blue-500 text-2xl font-bold mb-4">Documents Logs</h2>

    <div className="overflow-x-auto bg-white rounded-lg shadow-md">
      {/* <DataTable
        columns={columns} // Columns for the table
        data={activeDocuments} // Data for the table
      /> */}
      <p className='text-center text-blue-500 p-2'>No Document Logs found right now</p>
    </div>
  </div>
  )
}

export default AllDocumentLogs