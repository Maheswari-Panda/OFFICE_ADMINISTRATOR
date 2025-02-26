import React from 'react'

function Spinner() {
  return (
    <div className='flex items-center justify-center bg-white w-full h-screen'>
        {/* <span className="loading loading-dots loading-lg text-blue-500"></span> */}
        <span className="loading loading-spinner loading-lg text-blue-500"></span>
    </div>
  )
}

export default Spinner